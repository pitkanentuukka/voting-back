const express = require('express')
const router = express.Router()
const cors = require('cors')
const connection = require('./sql.js')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')


const verifyToken = require('./../../verifyToken')


// get all parties:
router.get('/', cors(), (req, res) => {
  let sql = "select id, party from party";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results)
  });

})


// validate party link
router.get('/validate', cors(), (req, res) => {
  const partyid = parseInt(req.query.id)
  const link = req.query.link
  const sql = "select * from party where id = ? and link = ?"
  const inserts = [partyid, link]
  if (partyid && link) {
    connection.query(sql, inserts, function (error, results, fields) {
      if (error) {
        res.status(500).json(error)
      }

      if (results[0]) {

        const payload = { partyid };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: '1d'
        })
        //res.status(200).cookie('token', token, { httpOnly: true })
        res.status(200).cookie('token', token, { httpOnly: true }).json(results)
        res.end()
      } else {
        res.status(403).json({ 'msg': 'invalid link' })
      }
    })
  } else {
    res.status(400).json({ 'msg': 'bad request' })
  }

})

router.post('/addcandidate/', cors(), verifyToken, (req, res) => {

  const name = req.body.name;
  const number = req.body.number;
  const email = req.body.email;
  const districtid = req.body.district;
  const facebook = req.body.facebook;
  const twitter = req.body.twitter;
  const website = req.body.website;
  const linkedin = req.body.linkedin;
  const tiktok = req.body.tiktok;
  const instagram = req.body.instagram;


  if (name && number && districtid) {
    const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_KEY)
    const partyid = decodedToken.partyid

    const inserts = [partyid, districtid, name, number, email, facebook, twitter, website, linkedin, tiktok, instagram];

    const sql = "insert into candidate (party_id, district_id, name, number, email, facebook, twitter, website, linkedin, tiktok, instagram) \
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

    connection.query(sql, inserts, (error, results, fields) => {
      if (error) {
        res.status(500).json(error)
      } else {
        const payload = { candidateid: results.insertId };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: '1d'
        })
        res.status(200).cookie('token', token, { httpOnly: true })
          .json({ candidateid: results.insertId })
      }
    })
  }
})



module.exports = router;
