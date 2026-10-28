const { menu } = require('../data/menu');

const obtenerMenu = (req, res) => {
    return res.status(200).json(menu);
};

module.exports = { obtenerMenu };
