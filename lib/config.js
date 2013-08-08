var path = require('path')
var fs = require('fs')

var lib = require('../lib')
var configpath = path.join(process.env['HOME'], '.pkp')
var templatePath = path.join(__dirname, '..', 'templates', 'config.template')

function write(json, callback) {
  fs.writeFile(configpath, JSON.stringify(json, 2, 2), function(err) {
    if (err) {
      return callback(err)
    }
    callback(null, json)
  })
}

//
// return the config, if one does not exist create and then return it
//
exports.get = function(callback) {

  try {

    var data = fs.readFileSync(configpath, { encoding: 'utf8' })
    var config = JSON.parse(data)
    callback(null, config)
  }
  catch (ex) {

    exports.exec(callback)
  }
}

exports.exec = function(callback) {
  
  lib.template.exec(templatePath, {}, function(err, config) {
    if (err) {
      return callback(err)
    }

    if (config['public'] === 'Auto-Generate' ||
        config['private'] === 'Auto-Generate') {

      return lib.keys.create(function(err, pair) {
        if (err) {
          return callback(err)
        }
        config['public'] = pair.public
        config['private'] = pair.private
        write(config, callback)
      })
    }
    else {
      return lib.keys.add(config, function(err, pair) {
        if (err) {
          return callback(err)
        }
        config['public'] = pair.public
        config['private'] = pair.private
        write(config, callback)
      })
    }
  })
}