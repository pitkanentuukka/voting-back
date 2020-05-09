const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const secret = 't0ps3cr3tf0rd3v3nv'

//exports.verifyToken = function(req, res, next) {
module.exports = function verifyToken(req, res, next) {

    if(typeof req.cookies.token !== 'undefined') {

      jwt.verify(req.cookies.token, secret, (err, authData) => {
        if(err) {
          res.sendStatus(403)
        } else {
          next()
        }
      })
    } else {
      res.sendStatus(403)
    }
  }
//module.exports.verifyToken = verifyToken
