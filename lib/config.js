var path = require('path')
var fs = require('fs')
var argv = require('optimist').argv

var lib = require('../lib')

var configpath = path.resolve(path.join(
    argv['out'] || process.env['HOME'], '.pkp.json'))

var templatePath = path.join(
    __dirname, '..', 'templates', 'config.template')

function write(json, callback) {
  fs.writeFile(configpath, JSON.stringify(json, 2, 2), function(err) {
    if (err) {
      return callback(err)
    }
    console.log('Written to %s', configpath);
    callback(null, json)
  })
}

//
// return the config, if one does not exist create and then return it
//
exports.get = function(callback) {

  var config

  try {
    config = require(configpath)
  }
  catch(ex) {}
  
  if (config) {
    callback(null, config)
  }
  else {
    console.log('Configuration not found, creating...')
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

      console.log('Generating Key-Pair...');

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

