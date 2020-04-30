const express = require('express')
const mysql = require('mysql')
const path = require('path')


const app = express()
app.listen("7777",() => {
  console.log("listening to port 7777")
})

app.use('/api/questions', require('./routes/api/questions'))
