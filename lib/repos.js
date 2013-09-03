var path = require('path')
var url = require('url')

var request = require('hyperquest')
var JSONStream = require('JSONStream')
var spawn = require('child_process').spawn
var psexit = require('psexit')
var lib = require('./index')

var tmpdir = '/tmp/repos'

function pullRepo(repourl, callback) {
  
  var parsedURL = url.parse(repourl)
  parsedURL.pathname = parsedURL.pathname.replace('.git', '')

  if (parsedURL.protocol.indexOf('http') < 0) {
    repourl = 'https://' + parsedURL.host + parsedURL.pathname
  }

  console.log('Cloning repository from %s', repourl)

  var dest = path.join(tmpdir, parsedURL.pathname)

  git = spawn('git', ['clone', repourl, dest])
  psexit(git, function(code, sig) {
    if (code === 0) {
      return callback(null, dest)
    }
    callback(code)
  })
}

//
// try to get the repo for either a package or the specified remote
//
exports.get = function(value, opts, callback) {

  if (value.indexOf(':') === -1) {

    var reg = opts.reg || 'http://registry.npmjs.org/'
    console.log('Resolving package from %s', reg + value)

    request(reg + value)
      .pipe(JSONStream.parse('versions'))
      .on('error', callback)
      .on('data', function(versions) {
        
        keys = Object.keys(versions)
        var version = (versions[opts.version] || versions[keys[keys.length-1]])
        if (version.repository && version.repository.url) {
           pullRepo(version.repository.url, callback)
        }
      })
  }
  else {
    pullRepo(value, callback)
  }
  return false
}
