const connection = require ('./sql.js')
const express = require('express')
const router = express.Router()
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')

const secret = 't0ps3cr3tf0rd3v3nv'



router.post('/', cors(), (req, res) => {

  const email = req.body.email
  const password = req.body.password
  if (email && password) {
    let sql = "select * from users where email = ?"
    let inserts = email
    connection.query(sql, inserts, (error, results, fields) => {
      if (results.length === 0) {
        // email wasn't found in the db
        res.status(200).json({"msg": "invalid email or password"})
      } else {
        bcrypt.compare(password, results[0].password, (bcerr, bcres) => {
          if (bcres) {
            const payload = { email };
            const token = jwt.sign(payload, secret, {
              expiresIn: '1h'
            })
            res.cookie('token', token, { httpOnly: true })
            .sendStatus(200)

          } else {
            // password hashes didn't match
            res.status(200).json({"msg": "invalid email or password"})
          }
        })
      }
    })
  } else {
    res.status(400).json({"msg": "missing email or password"})
  }
})

router.post('/adduser/', cors(), (req, res) => {
  const {email, password} = req.body
  console.log(req.body.email)
  bcrypt.hash(password, 10, (err, hash) => {
    let sql = "insert into users (email, password, status) values (?, ?, 1)"
    let inserts = [email, hash]
    connection.query(sql, inserts, (error, results, fields) => {
      if (error) console.log(error);
      res.json({"msg": `user ${email} added`} )

    })
  })
})

/*
// validate party link
router.get('/validate', cors(), (req, res) => {
  let partyid = parseInt(req.query.partyId)
  let link = req.query.link
  let sql = "select * from party where id = ? and link = ?"
  let inserts = [partyid, link]
  connection.query(sql, inserts, function (error, results, fields) {
    if (error) throw error;
    res.json(results)

  })
})
*/

module.exports = router;
