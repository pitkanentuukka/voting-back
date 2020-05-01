const express = require('express')
const mysql = require('mysql')
const path = require('path')
const cors = require('cors')



const app = express()


app.listen("7777",() => {
  console.log("listening to port 7777")
})

app.use('/api/questions', require('./routes/api/questions'))
app.use('/api/parties', require('./routes/api/parties'))
