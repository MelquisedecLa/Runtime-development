const express = require('express');
const router = express.Router();

const {
    getReserva,
    agregarReserva,
    actualizarPorciones,
    eliminarPlato,
    confirmarReserva
} = require('../controllers/reserva.controller');

router.get('/', getReserva);
router.post('/agregar', agregarReserva);
router.put('/actualizar-porciones/:id', actualizarPorciones);
router.delete('/eliminar/:id', eliminarPlato);
router.post('/confirmar', confirmarReserva);

module.exports = router;