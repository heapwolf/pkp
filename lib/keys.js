var forge = require('node-forge')
var rsa = forge.pki.rsa

//
// create a pair of public and private keys
//
exports.create = function(opts, callback) {

  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  }

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

  callback(null, keypair)
}

//
// add an existing pair of public and private keys
//
exports.add = function(opts, callback) {

  if (!opts.public || !opts.private) {
    return callback(new Error('Public and Private keys required'))
  }

  try {

    keypair = {
      public: JSON.parse(fs.readFileSync(opts.public, { encoding: 'utf8 '})),
      private: JSON.parse(fs.readFileSync(opts.private, { encoding: 'utf8 '}))
    }

    callback(null, keypair)
  }
  catch(ex) {
    callback(new Error('Could not read public and private keys'))
  }
}
