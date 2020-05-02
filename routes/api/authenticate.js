const connection = require ('./sql.js')
const router = express.Router()
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const secret = 't0ps3cr3tf0rd3v3nv'



router.get('/', cors(), (req, res) => {
  const {email, password} = req.body;
  let sql = "select * from users where email = ?"
  let inserts = email
  connection.query(sql, inserts (error, results, fields) {
    if (error) throw error
    bcrypt.compare(password, results.password, (err, res) {
      if (error) throw error
      if (res) {
        const payload = { email };
        const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          })
        res.cookie('token', token, { httpOnly: true })
  .sendStatus(200)

      } else {
        // thank you for participating, unfortunately no match
        res.json("msg": "invalid email or password")
      }
    })
  })

})
/*
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
*/

module.exports = router;
