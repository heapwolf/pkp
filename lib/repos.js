var path = require('path')
var url = require('url')

var npm = require('npm')
var Pullover = require('pullover')

var tmpdir = '/tmp/repos'
var pullover = Pullover(tmpdir)

function pullRepo(repourl, callback) {

  var parsedURL = url.parse(repourl)
  parsedURL.pathname = parsedURL.pathname.replace('.git', '')

  if (parsedURL.protocol.indexOf('http') < 0) {
    repourl = 'https://' + parsedURL.host + parsedURL.pathname
  }

  pullover.pull({ repository: { url: repourl }}, function(err) {
    if (err) { 
      return callback(err)
    }
    callback(null, parsedURL.pathname)
  })
}

//
// try to get the repo for either a package or the specified remote
//
exports.get = function(remote, packagename, versionspec, callback) {

  if (packagename) {

    npm.load({}, function() {

      npm.commands.view([packagename], [true], function(err, package) {

        var versions = Object.keys(package)
        var version = package[versionspec] || package[versions[versions.length-1]]

        if (version.repository && version.repository.url) {
          pullRepo(version.repository.url, callback)
        }
      })
    })
  }
  else if (remote) {
    pullRepo(remote, callback)
  }
}
