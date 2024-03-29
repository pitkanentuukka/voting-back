const express = require('express')
const mysql = require('mysql')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')



const app = express()
app.use(cookieParser())
app.use(bodyParser())

app.listen("7777", () => {
  console.log("listening to port 7777")
})

app.use('/api/questions', require('./routes/api/questions'))
app.use('/api/parties', require('./routes/api/parties'))
app.use('/api/districts', require('./routes/api/districts'))
app.use('/api/authenticate', require('./routes/api/authenticate'))
app.use('/api/admin', require('./routes/api/admin'))
app.use('/api/answers', require('./routes/api/answers'))
app.use('/api/candidates', require('./routes/api/candidates'))


app.use(express.static(path.join(__dirname, 'public')));