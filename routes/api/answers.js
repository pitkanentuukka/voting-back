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


router.get('/candidatesandanswers/:district', cors(), async (req, res) => {
  const district = req.params.district;
  const sql = "select * from candidate where district_id = ?";

  const candidates = await new Promise((resolve, reject) => {
    connection.query(sql, [district], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });

  for (const candidate of candidates) {
    candidate.answers = await new Promise((resolve, reject) => {
      const getanswers = "select * from answer where candidate_id = ? ";
      connection.query(getanswers, [candidate.id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  }

  return res.status(200).json(candidates).end();
});
module.exports = router;
