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

const secret = 't0ps3cr3tf0rd3v3nv'
const verifyToken = require('./../../verifyToken')

router.get('/auth/', verifyToken, (req, res) => {
  res.status(200).end()
})

router.get('/logout/', verifyToken, (req, res) => {
  res.clearCookie('token')
  res.status(200).json({'msg': 'logged out'})
})

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
            const token = jwt.sign(payload, secret, {
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
router.post('/adduser/', verifyToken, (req, res) => {
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


router.post('/addparty', verifyToken, (req, res) => {
  const partyName = req.body.partyName
  const link = uuid.v4()
  let sql = "insert into party (name, link) values (?, ?)"
  let inserts = [partyName, link]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) console.log(error)
    res.status(200).json(inserts)
  })

})
/*
function verifyToken(req, res, next) {
  if(typeof req.cookies.token !== 'undefined') {

    jwt.verify(req.cookies.token, secret, (err, authData) => {
      console.log("err")
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
*/


module.exports = router
