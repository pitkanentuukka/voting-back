const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

dotenv.config()

/**
* checks the cookie authentication cookie for email
* if there's an email address we know they're a logged in user
*/

module.exports = function checkAdmin(req, res, next) {
  if(typeof req.cookies.token !== 'undefined') {
    jwt.verify(req.cookies.token, process.env.JWT_KEY, (err, authData) => {
      if(err) {
        res.sendStatus(403)
      } else {
        if (authData.email) {
          // this is a logged in user
          next()
        } else {
          // this is some other kind of user with a token
          res.sendStatus(403)
        }
      }
   })
 }
}
