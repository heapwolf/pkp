var fs = require('fs')
var net = require('net')
var path = require('path')
var crypto = require('crypto')

var multilevel = require('multilevel')
var hashd = require('hashd')
var secure = require('secure-peer')
var ip = require('ip')
var lib = require('./index')

exports.verify = function(argv, config, callback) {

  // TODO:
  // - Try each hostname in the servers-at array.
  // - Pull down the image and get the key out of it.
  // - Report to the user where the key was validated from.
  //
  var p = path.normalize(argv._[1])
  lib.png.read(p, function(err, data) {
    console.log(data)
  })
}

function execTemplate(t, argv, config, context, callback) {

  var t = path.join(__dirname, '..', 'templates', t + '.template')

  lib.template.exec(t, context, function(err, cert) {
    if (err) {
      return callback(err)
    }
    
    if (cert.public == 'default') {
      cert.public = config.public
      done(cert)
    }
    else {
      fs.readFile(cert.public, { encoding: 'utf8' }, function(err, data) {
        if (err) {
          return callback(err)
        }
        cert.public = data
        done(cert)
      })
    }
    
    function done(cert) {
      var data = JSON.stringify(cert, 2, 2)
      var alt = path.join(process.cwd(), (argv._[1] || 'new') + '.cert.json')
      var out = argv.out || alt
      console.log('Writing signed certificate to %s', out)
      fs.writeFile(out, data, callback)
    }
  })
}

//
// Create a new name-certificate
//
exports.image = function(argv, config, callback) {

  var infile = path.resolve(argv._[1])
  var outfile = path.resolve(argv._[2])

  lib.png.write(config.public, infile, outfile, function(err) {
    if (err) {
      callback(err)
    }
    console.log('Writing new image to %s', outfile)
  })
}

//
// Create a new data-certificate or add a signature 
// to an existing data-certificate.
//
exports.sign = function(argv, config, callback) {
  lib.repos.get(argv._[1], argv, function(err, url, tmpdir) {

    if (err) {
      return callback(err)
    }

    console.log('Computing hash for %s', tmpdir)

    var hash = hashd(tmpdir, { patterns: '.git' })
    var sign = crypto.createSign('sha1')
    sign.update(hash)

    var templatePath = path.join(__dirname, '..', 'templates', 'cert.template')

    var context = {}
    context.address = config['address-at']
    context.realname = config['real-name']
    context.urls = config['urls-at']
    context.origin = url
    context.data = sign.sign(new Buffer(config.private), 'base64').toString()
    context.algorithm = 'sha1-base64'
    context.key = config.public

    execTemplate('data', argv, config, context, callback)
  })
}

