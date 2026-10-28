const express = require('express')
const cors = require('cors')
const guessNumber = require('./routes/routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', guessNumber)

module.exports = app
