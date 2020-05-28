const express = require('express')
const router = express.Router()
const cors = require('cors')
const connection = require ('./sql.js')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')


const verifyToken = require('./../../verifyToken')


// get all parties:
router.get('/', cors(), (req, res) => {
  let sql = "select * from party";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results)
  });

})

// validate party link
router.get('/validate', cors(), (req, res) => {
  let partyid = parseInt(req.query.id)
  let link = req.query.link
  let sql = "select * from party where id = ? and link = ?"
  let inserts = [partyid, link]
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
        res.status(200).cookie('token', token, { httpOnly: true}).json(results)
        res.end()
      } else {
        res.status(403).json({'msg': 'invalid link'})
      }
    })
  } else {
    res.status(400).json({'msg': 'bad request'})
  }

})

router.post('/addcandidate/', cors(), verifyToken, (req, res) => {
  let name = req.body.name
  let number = req.body.number
  let districtid = req.body.district
  if (name && number && districtid) {
    let decodedToken = jwt.verify(req.cookies.token, process.env.JWT_KEY)
    let partyid = decodedToken.partyid

    let inserts = [partyid, districtid, name, number]
    console.log(inserts);
    let sql = "insert into candidate (party_id, district_id, name, number) values (?, ?, ?, ?)"
    connection.query(sql, inserts, (error, results, fields) => {
      if (error) {
        res.status(500).json(error)
      } else {
        const payload = { candidateid: results.insertId };
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: '1d'
        })
        //res.status(200).cookie('token', token, { httpOnly: true })
        res.status(200).cookie('token', token, { httpOnly: true})
          .json({candidateid: results.insertId})
      }
    })
  }

})


module.exports = router;
