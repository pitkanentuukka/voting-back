const connection = require ('./sql.js')
const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')
const uuid = require('uuid')
const cookieParser = require('cookie-parser')

const secret = 't0ps3cr3tf0rd3v3nv'
const verifyToken = require('./../../verifyToken')

/*
* CRUD functions for parties, districts, and questions
* or maybe just Create, Read and Delete
* Not sure if update is necessary as of now
* and read operations can also exist elsewhere
 **/

router.post('/addparty', verifyToken, (req, res) => {
  const partyName = req.body.partyName
  const link = uuid.v4()
  let sql = "insert into party (name, link) values (?, ?)"
  let inserts = [partyName, link]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json(inserts)
    }
  })

})

router.post('/adddistrict', verifyToken, (req, res) => {
  const district = req.body.district

  let sql = "insert into district (district) values (?)"
  let inserts = [district]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json(inserts)
    }
  })

})
router.post('/adddquestion', verifyToken, (req, res) => {
  const question = req.body.question

  let sql = "insert into question (question) values (?)"
  let inserts = [question]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json(inserts)
    }
  })
})


module.exports = router
