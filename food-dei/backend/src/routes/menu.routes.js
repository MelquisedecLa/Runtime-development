const express = require('express')
const router = express.Router()
const { obtenerMenu } = require('../controllers/menu.controller')

router.get('/', obtenerMenu)

module.exports = router