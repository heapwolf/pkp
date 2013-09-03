var fs = require('fs')
var net = require('net')
var path = require('path')
var crypto = require('crypto')

var multilevel = require('multilevel')
var hashd = require('hashd')
var secure = require('secure-peer')
var ip = require('ip')
var lib = require('./index')

//
// publish a name-certificate or data-certificate
//
exports.publish = function(argv, config, callback) {

  fs.readFile(argv._[1], { encoding: 'utf8' }, function(cert) {

    try {
      cert = JSON.parse(cert)
    }
    catch(ex) {
      return callback(ex)
    }

    var peer = secure({
      public: config.public,
      private: config.private
    })

    var db = multilevel.client()

    var sec = peer(function (s) {

      s.pipe(db.createRpcStream()).pipe(s)

      db.put(cert.public, cert, function (err, data) {
        s.end()
        if (err) {
          return callback(err)
        }
        callback(null)
      })
    })

    //
    // TODO: Try all servers in servers-at
    //
    var host = argv.host ||
      cert['servers-at'].length && cert['servers-at'].split(' ')[0]

    var con = net.connect(11372, host)

    con.on('error', function(err) {

      if (err.errno === 'ENOTFOUND') {
        return callback(new Error('Server not reachable'))
      }
      callback(err)
    })

    sec.pipe(con).pipe(sec)
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
exports.name = function(argv, config, callback) {

  var context = {}
  context.address = config['address-at']
  context.realname = config['real-name']
  context.servers = config['servers-at']
  execTemplate('name', argv, config, context, callback)
}

//
// Create a new data-certificate or add a signature 
// to an existing data-certificate.
//
exports.sign = function(argv, config, callback) {
  lib.repos.get(argv._[1], argv, function(err, tmpdir) {

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
    context.servers = config['servers-at']
    context.data = sign.sign(new Buffer(config.private), 'base64').toString()
    context.algorithm = 'sha1-base64'
    context.key = config.public

    execTemplate('data', argv, config, context, callback)
  })
}

