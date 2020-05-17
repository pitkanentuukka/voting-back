const mysql = require('mysql')
// FIXME! we're using a single mySQL connection for the whole app
// it works okay when in dev, but needs to be reworked to connection pool
// before moving to production

// also, all queries need to be reworked to use promises
// this might require using mysql-promise module
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
