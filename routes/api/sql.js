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

module.exports = connection
