require('dotenv').config()
const fs = require('fs')
const cors = require('cors')
const express = require('express')
const ytdl = require('ytdl-core')
const app = express()
app.use(cors())
const routes = require('./routes/api')(app)









const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("your app is listning to port :" + PORT)