var fs = require('fs')
var prompter = require('prompter')

exports.exec = function(path, opts, callback) {

  var src = fs.readFileSync(path, 'utf8')
  var s = prompter(src, opts, function (err, output) {
    if (err) {
      console.log(src)
      return callback(err)
    }
    callback(null, JSON.parse(output))
  })
  s.pipe(process.stdout)
  process.stdin.pipe(s)
}
