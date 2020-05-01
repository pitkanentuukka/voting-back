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

// get all questions:
router.get('/', cors(), (req, res) => {
  let sql = "select * from question";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    //res.header("Access-Control-Allow-Origin", "*")
    res.json(results)
  });

})

/*router.get('/candidates', cors(), (req, res) => {
  let sql = "select * from candidate";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results)
  });

})
*/

module.exports = router;
