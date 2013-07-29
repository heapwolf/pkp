
var fs = require('fs')
var path = require('path')
var crypto = require('crypto')

var hashd = require('hashd')
var ignore = require('fstream-ignore')
var gitio = require('gitio')
var hyperquest = require('hyperquest')
var es = require('event-stream')
var JSONStream = require('JSONStream')
var prompt = require('cli-prompt')

var files = require('../files')
var mail = require('../mail')

//
// TODO: these ignore files should be in the config
//

var request = module.exports = {}

request.create = function(opts, callback) {

  //
  // get the users public key
  // 
  var package = files.get('package')
  var version = package.version
  var author = package.author
  var repository = package.repository

  var key = files.get('config').public
  var dir = opts.location || process.cwd()
  var request = {}

  //
  // get a hash of the code base and build the signing request
  //
  hashd(dir, { ignores: files.get('config').ignores }, function(err, sha1) {

    if (err) {
      return callback(err)
    }

    request.version = version
    request.author = author

    request.key = key
    request.date = Date.now()
    request.sha1 = sha1
    request.repository = repository
    request.signatures = []

    var v = request.version
    delete request.version // just use the version as the key

    files.get('pki')[v] = request
    files.set('pki')

    console.log('Successfully created a signing request for', version)

    callback(null, request)
  })
}

request.sign = function(opts, callback) {

  hyperquest(opts.sign)
    .pipe(JSONStream.parse())
    .pipe(es.through(function(json) {

      var versions = Object.keys(json)

      if (!versions) {
        console.log('No versions could not be read from the source.')
        process.exit(1)
      }

      var request = json[versions[versions.length-1]]

      if (!request.sha1) {
        console.log('A sha1 shash could not be read from the source.')
        process.exit(1)
      }

      var config = files.get('config')
      var sign = crypto.createSign('sha1')
      var pk = config.private

      sign.update(request.sha1)

      request.signatures.push({
        key: config.public,
        signature: sign.sign(pk, 'base64').toString()
      })

      callback(null, request)

    }))
}

request.verify = function(opts, callback) {
  
  var pki = files.get('pki')

  var versions = Object.keys(pki)

  if (!versions) {
    console.log('No versions could not be read from the source.')
    process.exit(1)
  }

  var request = pki[
    typeof opts.verify !== 'boolean'
      ? opts.verify 
      : versions[versions.length-1]
  ]

  if (!request) {
    console.log('A request for the version specified could not be found.')
    process.exit(1)
  }

  var verifier = crypto.createVerify('sha1')

  verifier.write(request.sha1)
  var count = 0

  request.signatures.forEach(function(s) {
    if (verifier.verify(s.key, s.signature, 'base64')) {
      if (s.author) {
        console.log('verifying signature from %j', s.author)
      }
      count++
    }
  })

  console.log('%d signatures are valid!', count)
}
