const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

dotenv.config()



/**
* middleware for validating authentication cookie
* this either returns to 403 in case the cookie is missing
* or invalid, or calls next() if everything is okay
*/

module.exports = function verifyToken(req, res, next) {
  if(typeof req.cookies.token !== 'undefined') {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, authData) => {
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
