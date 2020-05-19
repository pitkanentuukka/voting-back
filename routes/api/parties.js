const express = require('express')
const router = express.Router()
const cors = require('cors')
const connection = require ('./sql.js')



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
  let partyid = parseInt(req.query.partyId)
  let link = req.query.link
  let sql = "select * from party where id = ? and link = ?"
  let inserts = [partyid, link]
  connection.query(sql, inserts, function (error, results, fields) {
    if (error) throw error;
    res.json(results)

  })
})


module.exports = router;
