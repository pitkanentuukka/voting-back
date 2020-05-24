const mysql = require('mysql')
const dotenv = require('dotenv')

// FIXME! we're using a single mySQL connection for the whole app
// it works okay when in dev, but needs to be reworked to connection pool
// before moving to production

// also, all queries need to be reworked to use promises
// this might require using mysql-promise module

dotenv.config()
const pool = mysql.createPool({

  host: `${process.env.MYSQL_HOST}`,
  user: `${process.env.MYSQL_USER}`,
  password: `${process.env.MYSQL_PASSWORD}`,
  database: `${process.env.MYSQL_DATABASE}`,
})

module.exports = pool
