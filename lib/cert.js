var fs = require('fs')
var net = require('net')
var path = require('path')
var crypto = require('crypto')

var hashd = require('hashd')
var rimraf = require('rimraf')
var lib = require('./index')
var request = require('hyperquest')

exports.verify = function(argv, config, callback) {

  var remote = argv.module || argv.remote
  var cert

  function verify(tmpdir) {

    var certpath = path.join(path.resolve(tmpdir), 'cert.json')

    try {
      cert = require(certpath)
      fs.unlinkSync(certpath)
    }
    catch(ex) {
      return callback(new Error('could not read cert.json from ' + tmpdir))
    }

    if (!cert.urls || cert.urls.length === 0) {
      return callback(new Error('the certificate contains no verifiable urls'))
    }

    function createVerifier() {
      var verifier = crypto.createVerify('sha1')
      verifier.update(new Buffer(cert))
      return verifier
    }

    function prep() {
      // save the old signatures but ignore them for now.
      var oldsigs = cert.signatures.slice(0)
      cert.signatures = []
      var hash = hashd(tmpdir, { patterns: ['.git'], files: ['.gitignore'] })
      // verify against all the found keys
      Object.keys(keys).forEach(function(key) {
        if (key.indexOf('gist.github.com') > 0) {
          var verifier = createVerifier()
          var verified = verifier.verify(keys[key], cert.signature, 'base64')
          if (verified && hash === cert.hash) {
            return console.log('VERIFIED from %s', key)
          }
          console.log('FAILED from %s', key)
        }
      })
      cert.signatures = oldsigs

      if (remote) {
        return rimraf(tmpdir, function(err) {
          if (err) {
            return callback(err)
          }
          callback(null)
        })
      }
      fs.writeFile(certpath, JSON.stringify(cert, 2, 2), callback)
    }

    var requests = 0
    var keys = {}
    function end() {
      requests--
      if (requests == 0) {
        prep(null)
      }
    }

    cert.urls.forEach(function(url) {
      requests++
      request(url)
        .on('data', function(d) {
          if (!keys[url]) {
            return keys[url] = d.toString()
          }
          keys[url] += d.toString()
        })
        .on('error', function(err) {
          delete keys[url]
          console.log('Failed to read a key from %s', url)
        })
        .on('end', end)
    })
  }

  if (remote) {
    lib.repos.get(remote, argv, function(err, url, tmpdir) {
      if (err) {
        return callback(err)
      }
      verify(tmpdir, url)
    })
  }
  else if (argv._[1]) {
    verify(argv._[1])
  }
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

    var hash = hashd(tmpdir, { patterns: ['.git', 'cert.json'], files: ['.gitignore'] })
    var templatePath = path.join(__dirname, '..', 'templates', 'cert.template')

    var context = {}
    context.addresses = config.addresses
    context.name = config.name
    context.hash = hash
    context.algorithm = 'sha1-base64'
    context.public = config.public
    context.urls = config.urls || '' 
  
    if (!url && userpkg) {
      context.origin = userpkg.repository.url
    }
    else {
      context.origin = url || ''
    }

    lib.template.exec(template, context, function(err, cert) {
      if (err) {
        return callback(err)
      }

      var sign = crypto.createSign('sha1')
      sign.update(new Buffer(cert))
      cert.signature = sign.sign(new Buffer(config.private), 'base64').toString()

      if (remote) {
        return rimraf(tmpdir, function(err) {
          if (err) {
            return callback(err)
          }
          write(cert)
        })
      }
      write(cert)
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

