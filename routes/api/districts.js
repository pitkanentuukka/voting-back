const express = require('express')
const router = express.Router()
const cors = require('cors')
const connection = require ('./sql.js')

router.get('/', cors(), (req, res) => {
  let sql = "select * from district";
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    res.json(results)
  });

})
module.exports = router;
