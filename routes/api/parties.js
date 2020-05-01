const express = require('express')
const router = express.Router()
const cors = require('cors')
const mysql = require('mysql')


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ci_voting',
  password: 'FjGhAMDLbE6tUcSq',
  database: 'ci_voting'
})

connection.connect((err)=> {
  if (err) {
    console.error('error connecting: ' + err.stack)
    return;
  }
  console.log("connected  as id " + connection.threadId)

})

// get all parties:
router.get('/', cors(), (req, res) => {
  let sql = "select * from party";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    //res.header("Access-Control-Allow-Origin", "*")
    res.json(results)
  });

})

// validate party link
router.get('/validate', cors(), (req, res) => {
  let partyid = parseInt(req.query.partyId)
  let link = req.query.link
  let sql = "select * from party where id = ? and link = ?"
  let inserts = [partyid, link]
  console.log(partyid, link)
  connection.query(sql, inserts, function (error, results, fields) {
    if (error) throw error;
    res.json(results)
    console.log(sql, inserts)

  })
})


module.exports = router;
