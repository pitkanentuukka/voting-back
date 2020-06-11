const express = require('express')
const router = express.Router()
const cors = require('cors')
const connection = require ('./sql.js')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const verifyToken = require('./../../verifyToken')

router.post('/addanswers', cors(), verifyToken, (req, res) => {
  const answers = req.body.answers
  const questionids = Object.keys(answers)
  const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_KEY)
  const candidateid = decodedToken.candidateid

  const inserts = questionids.map(function (item) {
    return [item, candidateid, answers[item]['value'], answers[item]['text']]
  })
  const sql = "insert into answer (question_id, candidate_id, answer, text) values ?"

  connection.query(sql, [inserts], (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json({"msg": "thank you for your contribution"})
    }
  })
})






module.exports = router;
