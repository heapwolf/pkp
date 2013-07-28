
var fs = require('fs')
var path = require('path')

var hashd = require('hashd')
var ignore = require('fstream-ignore')

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

    request.version = files.get('package').version
    request.author = files.get('package').author

    request.key = key
    request.date = Date.now()
    request.sha1 = sha1
    request.signatures = []

    var v = request.version
    delete request.version // just use the version as the key

    files.get('pki')[v] = request
    files.set('pki')

    callback(null)
  })
}

request.signer = function(opts, callback) {
  
  // send mail with sha1 which is the unique identity to the services' public record

}

request.sign = function(opts, callback) {
  
  // send mail with the signed message which is the unique identity to the public record

}

request.accept = function(opts, callback) {
  
  // pull down the signed message from the public record service

}


