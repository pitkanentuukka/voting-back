const connection = require ('./sql.js')
const express = require('express')
const router = express.Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const {check, validationResult} = require('express-validator')
const uuid = require('uuid')
const cookieParser = require('cookie-parser')

const secret = 't0ps3cr3tf0rd3v3nv'
const verifyToken = require('./../../verifyToken')

/**
* CRUD functions for parties, districts, and questions
* or maybe just Create, Read and Delete
* Not sure if update is necessary as of now
* and read operations can also exist elsewhere
*/

/**
* takes in json in format {partyName: partyname },
* returns status 200, and {id: id, partyName: partyName} on success,
* 500 and error message on error
*/

router.post('/addparty/', verifyToken, (req, res) => {
  const partyName = req.body.party
  const link = uuid.v4()
  let sql = "insert into party (party, link) values (?, ?)"
  let inserts = [partyName, link]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json({id: results.insertId, party: inserts[0]})
    }
  })

})

/**
* add a voting district, takes {district: district}
* returns 200 & {id: id, district: district} on success
* 500 & error message on failure
*/

router.post('/adddistrict/', verifyToken, (req, res) => {
  const district = req.body.district

  let sql = "insert into district (district) values (?)"
  let inserts = [district]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json({id: results.insertId, district: inserts[0]})
    }
  })
})

/**
* add question, takes {question: question}
* returns 200 & {id: id, question: question} on success
* 500 & error message on failure
*/

router.post('/addquestion/', verifyToken, (req, res) => {
  const question = req.body.question

  let sql = "insert into question (question) values (?)"
  let inserts = [question]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).json({id: results.insertId, question: inserts[0]})
    }
  })
})

/**
* deletes a party by id, returns 200 on success, 400 if party not found,
* 500 on other errors
*/
router.get('/deleteparty/:id', verifyToken, (req, res) => {
  let sql = 'select * from party where id = ?'
  let id = req.params.id
  let inserts = [id]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      if (results[0] !== undefined) {
        let deletesql = 'delete from party where id = ?'
        connection.query(deletesql, inserts,  (error, results, fields) => {
          if (error) {
            res.status(500).json(error)
          } else {
            res.status(200).json('party deleted')
          }
        })
      } else {
        res.status(400).json('party not found')
      }
    }
  })
})

/**
* deletes a district by id, returns 200 on success, 400 if district not found,
* 500 on other errors
*/

router.get('/deletedistrict/:id', verifyToken, (req, res) => {
  let sql = "select * from district where id = ?"
  let id = req.params.id
  let inserts = [id]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      if (results[0] !== undefined) {
        let deletesql = "delete from district where id = ?"
        connection.query(deletesql, inserts,  (error, results, fields) => {
          if (error) {
            res.status(500).json(error)
          } else {
            res.status(200).json("district deleted")
          }
        })
      } else {
        res.status(400).json('district not found')
      }
    }
  })
})

/**
* deletes a question by id, returns 200 on success, 400 if question not found,
* 500 on other errors
*/

router.get('/deletequestion/:id', verifyToken, (req, res) => {
  let sql = "select * from question where id = ?"
  let id = req.params.id
  let inserts = [id]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      if (results[0] !== undefined) {
        let deletesql = "delete from question where id = ?"

        connection.query(deletesql, inserts,  (error, results, fields) => {
          if (error) {
            res.status(500).json(error)
          } else {
            res.status(200).json("question deleted")
          }
        })
      } else {
        res.status(400).json('question not found')
      }
    }
  })
})

/**
* edits a question. Takes question id as a parameter, new question
* as POST {question : question} JSON, returns 200 on success and
* 500 on failure
*/

router.post('/editquestion/:id', verifyToken, (req, res) => {
  let sql = "update question set question = ? where id = ?"
  let id = req.params.id
  let question = req.body.question
  let inserts = [question, id]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).end()
    }

  })
})

router.post('/editdistrict/:id', verifyToken, (req, res) => {
  let sql = "update district set district = ? where id = ?"
  let id = req.params.id
  let district = req.body.district
  let inserts = [district, id]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).end()
    }

  })
})

router.post('/editparty/:id', verifyToken, (req, res) => {
  let sql = "update party set party = ? where id = ?"
  let id = req.params.id
  let party = req.body.party
  let inserts = [party, id]
  connection.query(sql, inserts, (error, results, fields) => {
    if (error) {
      res.status(500).json(error)
    } else {
      res.status(200).end()
    }

  })
})

module.exports = router
