
var forge = require('node-forge')
var files = require('../files')
var rsa = forge.pki.rsa

function createPair(opts) {

  opts.bits = opts.bits || 2048
  opts.e = opts.e || 0x10001

  var keypair = rsa.generateKeyPair(opts)

  function fixreturns(str) {
    return str.replace(/\r/g, '') + '\n'
  }

  keypair = {
    public: fixreturns(forge.pki.publicKeyToRSAPublicKeyPem(keypair.publicKey, 72)),
    private: fixreturns(forge.pki.privateKeyToPem(keypair.privateKey, 72))
  }

  return keypair
}

exports.create = function(opts) {

  var pair = createPair(opts)
  var config = files.get('config')

  config.public = pair.public
  config.private = pair.private
  files.set('config')
}

exports.add = function(opts) {

  try {

    var pub = JSON.parse(fs.readFileSync(opts.public, { encoding: 'utf8 '}))
    var priv = JSON.parse(fs.readFileSync(opts.private, { encoding: 'utf8 '}))

    var config = files.get('config')

    config.public = pub
    config.private = priv
    files.set('config')
  }
  catch(ex) {
    console.log(ex)
    process.exit(1)
  }
}
