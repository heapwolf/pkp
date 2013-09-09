var fs = require('fs')
var net = require('net')
var path = require('path')
var crypto = require('crypto')

var hashd = require('hashd')
var rimraf = require('rimraf')
var lib = require('./index')

exports.verify = function(argv, config, callback) {

  // TODO:
  // - read the certificate
  // - Try each hostname in the urls-at array.
  // - Pull down the image and get the key out of it.
  // - Report to the user where the key was validated from.
  //
  var p = path.normalize(argv._[1])

  lib.steg.read(p, function(err, data) {
    console.log(data)
  })
}

//
// Create a new data-certificate or add a signature 
// to an existing data-certificate.
//
exports.sign = function(argv, config, callback) {

  var remote = argv.module || argv.remote
  var template = path.join(__dirname, '..', 'templates', 'cert.template')

  function write(cert) {
    var data = JSON.stringify(cert, 2, 2)
    var out = path.join(process.cwd(), 'cert.json')
    console.log('Writing certificate to %s', out)
    fs.writeFile(out, data, callback)
  }

  function create(tmpdir, url) {

    console.log('Computing hash for %s', tmpdir)

    var userpkg

    try {
      var p = path.join(path.resolve(tmpdir), 'package.json')
      userpkg = require(p)
    }
    catch(ex) { 
      /* oh well. not critical. */ 
    }

    var hash = hashd(tmpdir, { patterns: '.git' })
    var sign = crypto.createSign('sha1')
    sign.update(hash)

    var templatePath = path.join(__dirname, '..', 'templates', 'cert.template')

    var context = {}
    context.addresses = config.addresses
    context.name = config.name
    context.data = sign.sign(new Buffer(config.private), 'base64').toString()
    context.algorithm = 'sha1-base64'
    context.key = config.public
  
    if (!url && userpkg) {
      context.origin = userpkg.repository.url
    }
    else {
      context.origin = ''
    }

    lib.template.exec(template, context, function(err, cert) {
      if (err) {
        return callback(err)
      }
      cert.public = config.public
      cert.urls = config.urls
      if (remote) {
        rimraf(tmpdir, function(err) {
          if (err) {
            return callback(err)
          }
          write(cert)
        })
      }
      else {
        write(cert)
      }
    })
  }

  // create from remote or local data
  if (remote) {
    lib.repos.get(remote, argv, function(err, url, tmpdir) {
      if (err) {
        return callback(err)
      }
      create(tmpdir, url)
    })
  }
  else if (argv._[1]) {
    create(argv._[1])
  }
}

