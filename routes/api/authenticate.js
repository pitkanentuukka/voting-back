const connection = require ('./sql.js')
const express = require('express')
const router = express.Router()
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')
const uuid = require('uuid')
const cookieParser = require('cookie-parser')


const checkAdmin = require('./../../checkAdmin')
const dotenv = require('dotenv')


dotenv.config()

/**
* This simply returns 200 if user is logged in. If not,
* the checkAdmin middleware returns 403. Since we're
* using httpOnly cookies in production the client cant'
* know if they're logged in without asking the server.
*/
router.get('/auth/', checkAdmin, (req, res) => {
  res.status(200).end()
})

/**
* logout. Simply deletes the authentication cookie.
* Since we're using httpOnly cookies the client can't do this.
*/
router.get('/logout/', checkAdmin, (req, res) => {
  res.clearCookie('token')
  res.status(200).json({'msg': 'logged out'})
})

/**
* login. email and password are given as json in post request as
* {email: email, password: password}. If either of them are missing
* this returns a 400: bad request. If they don't match, 403. If they
* match, 200.
*/

router.post('/', cors(), (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (email && password) {
    let sql = "select * from users where email = ?"
    let inserts = email
    connection.query(sql, inserts, (error, results, fields) => {
      if (results.length === 0) {
        // email wasn't found in the db
        res.status(403).json({"msg": "invalid email or password"})
      } else {
        bcrypt.compare(password, results[0].password, (bcerr, bcres) => {
          if (bcres) {
            const payload = { email };
            const token = jwt.sign(payload, process.env.JWT_KEY, {
              expiresIn: '1d'
            })
            res.status(200).cookie('token', token, { httpOnly: true })
            res.end()
          } else {
            // password hashes didn't match
            res.status(403).json({"msg": "invalid email or password"})
          }
        })
      }
    })
  } else {
    res.status(400).json({"msg": "missing email or password"})
  }
})

/**
* this adds a new user. email and password are POSTed as json,
* the password is hashed with bcrypt and stored in db. This was made
* for development purposes and needs to be rewritten to return error codes
* before it's suitable for production.
*/
router.post('/adduser/', checkAdmin, (req, res) => {
  const {email, password} = req.body
  bcrypt.hash(password, 10, (err, hash) => {
    let sql = "insert into users (email, password, status) values (?, ?, 1)"
    let inserts = [email, hash]
    connection.query(sql, inserts, (error, results, fields) => {
      if (error) console.log(error);
      res.json({"msg": `user ${email} added`} )

    })
  })
})

module.exports = router
