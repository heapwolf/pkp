var fs = require('fs')

exports.write = function(value, infile, outfile, cb) {

  fs.readFile(infile, function(err, infileBuf) {
    if (err) {
      return cb(err)
    }
    
    var newbuf = new Buffer(value.length)
    newbuf.write(value, 0, 'ascii')
    
    var newlen = infileBuf.length + newbuf.length
    var data = Buffer.concat([infileBuf, newbuf], newlen)
    fs.writeFile(outfile, data, cb)
  })
}

exports.read = function(len, filename, cb) {
  if (typeof len == 'string') {
    cb = filename
    filename = len
    len = 426
  }
  fs.readFile(filename, function(err, data) {
    if (err) {
      return cb(err)
    }
    cb(null, data.toString('ascii', data.length-len, data.length-1))
  })
}

