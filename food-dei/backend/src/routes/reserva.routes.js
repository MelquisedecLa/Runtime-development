const express = require('express');
const router = express.Router();

const {
    getReserva,
    agregarReserva,
    actualizarPorciones,
    eliminarPlato,
    confirmarReserva
} = require('../controllers/reserva.controller');

router.get('/reserva', getReserva);
router.post('/reserva/agregar', agregarReserva);
router.put('/reserva/actualizar-porciones/:id', actualizarPorciones);
router.delete('/reserva/eliminar/:id', eliminarPlato);
router.post('/reserva/confirmar', confirmarReserva);

module.exports = router;