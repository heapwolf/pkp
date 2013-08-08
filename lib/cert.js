var fs = require('fs')
var net = require('net')
var path = require('path')

var multilevel = require('multilevel')
var secure = require('secure-peer')
var ip = require('ip')
var lib = require('./index')

exports.publish = function(argv, config, callback) {

  var templatePath = path.join(__dirname, '..', 'templates', 'cert.template')

  var context = { key: argv.key || '' }

  lib.template.exec(templatePath, context, function(err, cert) {
    if (err) {
      return callback(err)
    }

    fs.readFile(cert.public || '', { encoding: 'utf8' }, function(err, data) {
      if (err) {
        return callback(new Error('Could not read public key (' + cert.public + ')'))
      }

      cert.public = data.toString()

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

      var host = argv.host ||
        cert['servers-at'].length && cert['servers-at'].split(' ')[0]

      var con = net.connect(11372, host)

      con.on('error', function(err) {

        if (err.errno === 'ENOTFOUND') {
          return callback(new Error('URL not reachable'))
        }
        callback(err)
      })

      sec.pipe(con).pipe(sec)
    })
  })
}
