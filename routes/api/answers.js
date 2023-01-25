const express = require('express')
const router = express.Router()
const cors = require('cors')
const connection = require('./sql.js')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const verifyToken = require('./../../verifyToken')

// adds the answers submitted by candidate

router.post('/addanswers', cors(), verifyToken, (req, res) => {
  const answers = req.body.answers
  const questionids = Object.keys(answers)
  const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_KEY)
  const candidateid = decodedToken.candidateid

  for (const key in answers) {
    const questionId = key
    const { text, value } = answers[key]
    connection.query('INSERT INTO answer (answer, text, question_id, candidate_id) VALUES (?, ?, ?, ?)',
      [value, text, questionId, candidateid], (error, results) => {
        if (error) {
          console.log(error);
        }
      })

  }
  res.status(200).json({ "msg": 'Answers saved successfully!' }).end();
})


module.exports = router;
