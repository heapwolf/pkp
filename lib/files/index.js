
var path = require('path')
var fs = require('fs')
var keys = require('../keys')

var files
var refs = {}

exports.init = function(opts) {

  files = opts

  //
  // get or create the current pki file
  //
  try {

    refs.pki = JSON.parse(fs.readFileSync(files.pki, { encoding: 'utf8' }))
  }
  catch (ex) {

    fs.writeFileSync(path.join(path.dirname(files.pki), '.pkiignore'), 'pki.json')
    refs.pki = {}
  }

  //
  // get or create the user config
  //
  try {

    refs.config = JSON.parse(fs.readFileSync(files.config, { encoding: 'utf8' }))
  }
  catch (ex) {
    refs.config = {
      ignores: ['.pkiignore', '.gitignore', '.npmignore']
    }
    keys.create({})
  }

  //
  // try to get the package.json
  //
  try {
    refs.package = require(files.package)
  }
  catch (ex) {
    console.log('ERR: The package.json file could not be read.')
    process.exit(1)
  }

  refs.help = fs.readFileSync(files.help).toString()
  refs.meta = require(files.meta)
}

exports.get = function(ref) {
  return refs[ref]
}

exports.set = function(ref) {
  try {
    fs.writeFileSync(files[ref], JSON.stringify(refs[ref], 2, 2))
  }
  catch(ex) {
    console.log(ex)
    process.exit(1)
  }
}
