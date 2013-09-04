exports.keys = require('./keys')
exports.repos = require('./repos')
exports.template = require('./template')
exports.config = require('./config')
exports.cert = require('./cert')

exports.nicetxt = function(str) {
  return str
    .replace(/(\.H1(\s+)?([A-Z]+))/g, '\x1B[4m\x1B[1m$3\x1B[24m\x1B[22m')
    .replace(/(\.H2(\s+)?([A-Z]+))/g, '  \x1B[1m$3\x1B[22m')
}

