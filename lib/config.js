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
    console.log('Configuration written to %s', configpath);
    callback(null)
  })
}

function read() {
  try {
    return require(configpath)
  }
  catch(ex) {
    return null
  }
}

exports.get = function(callback) {

  var config = read()

  if (config) {
    callback(null, config)
  }
  else {
    console.log('Configuration not found, creating...')
    exports.create(callback)
  }
}

exports.addUrl = function(value, callback) {

  var config = read()

  config.urls = config.urls || []
  config.urls.push(value)
  write(config, callback)
}

exports.create = function(callback) {

  var config = read()
  var context = {}
  if (config) {
    context = config
  }

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

