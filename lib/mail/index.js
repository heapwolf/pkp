
var nodemailer = require('nodemailer')

module.exports = function(opts) {

  if (!opts.service || !opts.user || !opts.pass) {
    return console.log('ERR: Email settings `service`, `user` and `pass` required.')
    process.exit(1)
  }

  var smtpTransport = nodemailer.createTransport('SMTP', {
      service: opts.service,
      auth: {
          user: opts.user,
          pass: opts.pass
      }
  })

  var mailOptions = {
      from: 'Fred Foo ✔ <foo@blurdybloop.com>', // sender address
      to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world ✔', // plaintext body
  }

  smtpTransport.sendMail(mailOptions, function(error, response) {

      if (error) {
          console.log(error)
      }
      else {
          console.log('Message sent: ' + response.message)
      }

      smtpTransport.close() // shut down the connection pool, no more messages
  })
}
