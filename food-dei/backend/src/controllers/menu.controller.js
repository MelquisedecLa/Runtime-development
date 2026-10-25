const menuData = require('../data/menu')

// Acepta que data/menu.js exporte el array directo o como { menu }
const menu = Array.isArray(menuData) ? menuData : menuData.menu

const obtenerMenu = (req, res) => {
  res.status(200).json(menu)
}

module.exports = { obtenerMenu }