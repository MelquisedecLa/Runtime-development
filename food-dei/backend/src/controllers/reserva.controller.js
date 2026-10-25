const reservaService = require('../services/reserva.service');

const getReserva = (req, res) => {
    try {
        const reserva = reservaService.getReserva(1);

        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(404).json({
            error: error.message
        });
    }
};

const agregarReserva = (req, res) => {
    try {
        const { reservaId, platoId, cantidad } = req.body;
        if (reservaId == null || platoId == null || cantidad == null) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }
        const reservaActualizada = reservaService.agregarReserva(
            Number(reservaId),
            Number(platoId),
            Number(cantidad)
        );
        return res.status(201).json({
            mensaje: 'Plato agregado a la reserva exitosamente',
            reserva: reservaActualizada
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

const actualizarPorciones = (req, res) => {
    try {
        const reservaId = Number(req.body.reservaId);
        const platoId = Number(req.params.id);
        const cantidad = Number(req.body.cantidad);
        const reservaActualizada = reservaService.actualizarPorciones(
            reservaId,
            platoId,
            cantidad
        );
        return res.status(200).json({
            mensaje: 'Porciones actualizadas exitosamente',
            reserva: reservaActualizada
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

const eliminarPlato = (req, res) => {
    try {
        const reservaId = Number(req.body.reservaId);
        const platoId = Number(req.params.id);
        const reservaActualizada = reservaService.eliminarPlato(reservaId, platoId);
        return res.status(200).json({
            mensaje: 'Plato eliminado exitosamente',
            reserva: reservaActualizada
    });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

const confirmarReserva = (req, res) => {
    try {
        const reservaId = Number(req.body.reservaId);
        const reservaConfirmada = reservaService.confirmarReserva(reservaId);
        return res.status(200).json({
            mensaje: 'Reserva confirmada exitosamente',
            reserva: reservaConfirmada
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

module.exports = {
    getReserva,
    agregarReserva,
    actualizarPorciones,
    eliminarPlato,
    confirmarReserva
};