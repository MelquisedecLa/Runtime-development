//Esto es provisional
const express = require('express')
const cors = require('cors')
const menuRoutes = require('./routes/menu.routes')
const reservaRoutes = require('./routes/reserva.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/menu', menuRoutes)
app.use('/api/reserva', reservaRoutes)

module.exports = app