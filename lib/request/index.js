
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

request.signer = function(opts, callback) {

  // https://raw.github.com/hij1nx/pkp/master/pki.json


  // lib.mail.send(/* ... */)

  // send email
  // with shortened link to where the pki.json file lives

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
        user: val,
        key: config.public,
        signature: sign.sign(pk, 'base64').toString()
      })

      callback(null, request)

    }))

  // use link to see sha1, original author
  // create signature using sha1
  // gist public key of signer and signature
  // email original author with link to gist

}

request.accept = function(opts, callback) {
  
  // use link to write data back to pki.json

}


