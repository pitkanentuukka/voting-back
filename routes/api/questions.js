const express = require('express')
const router = express.Router()
const cors = require('cors')
const connection = require ('./sql.js')



// get all questions:
router.get('/', cors(), (req, res) => {
  let sql = "select * from question";
  connection.query(sql, function (error, results, fields) {
    if (error) console.log(error)
    //res.header("Access-Control-Allow-Origin", "*")
    res.json(results)
  });

})

module.exports = router;
