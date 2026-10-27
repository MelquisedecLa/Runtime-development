const express = require('express');
const router = express.Router();

const {
    getReserva,
    agregarReserva,
    actualizarPorciones,
    eliminarPlato,
    confirmarReserva,
    reiniciarReserva
} = require('../controllers/reserva.controller');

router.get('/', getReserva);
router.post('/agregar', agregarReserva);
router.put('/actualizar-porciones/:id', actualizarPorciones);
router.delete('/eliminar/:id', eliminarPlato);
router.post('/confirmar', confirmarReserva);
router.post('/reiniciar', reiniciarReserva);

module.exports = router;