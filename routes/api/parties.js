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
        res.status(200).json(results)

      } else {
        res.status(403).json({'msg': 'invalid link'})
      }
    })
  } else {
    res.status(400).json({'msg': 'bad request'})
  }

})


module.exports = router;
