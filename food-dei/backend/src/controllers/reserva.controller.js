const reservaService = require('../services/reserva.service');

const RESERVA_ACTIVA_ID = 1;

const getReserva = (req, res) => {
    try {
        const reserva = reservaService.getReserva(RESERVA_ACTIVA_ID);
        return res.status(200).json(reserva);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};

const agregarReserva = (req, res) => {
    try {
        const { alimentoId, platoId, cantidad } = req.body;
        const idAlimento = alimentoId ?? platoId;

        if (idAlimento == null || cantidad == null) {
            return res.status(400).json({
                error: 'alimentoId y cantidad son obligatorios'
            });
        }

        const reservaActualizada = reservaService.agregarReserva(
            RESERVA_ACTIVA_ID,
            idAlimento,
            cantidad
        );

        return res.status(201).json({
            mensaje: 'Plato agregado a la reserva exitosamente',
            reserva: reservaActualizada
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const actualizarPorciones = (req, res) => {
    try {
        const alimentoId = Number(req.params.id);
        const { cantidad } = req.body;

        if (cantidad == null) {
            return res.status(400).json({ error: 'La cantidad es obligatoria' });
        }

        const reservaActualizada = reservaService.actualizarPorciones(
            RESERVA_ACTIVA_ID,
            alimentoId,
            cantidad
        );

        return res.status(200).json({
            mensaje: 'Porciones actualizadas exitosamente',
            reserva: reservaActualizada
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const eliminarPlato = (req, res) => {
    try {
        const alimentoId = Number(req.params.id);
        const reservaActualizada = reservaService.eliminarPlato(
            RESERVA_ACTIVA_ID,
            alimentoId
        );

        return res.status(200).json({
            mensaje: 'Plato eliminado exitosamente',
            reserva: reservaActualizada
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const confirmarReserva = (req, res) => {
    try {
        const reservaConfirmada = reservaService.confirmarReserva(RESERVA_ACTIVA_ID);

        return res.status(200).json({
            mensaje: 'Reserva confirmada exitosamente',
            reserva: reservaConfirmada
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const reiniciarReserva = (req, res) => {
    try {
        const reservaReiniciada = reservaService.reiniciarReserva(RESERVA_ACTIVA_ID);

        return res.status(200).json({
            mensaje: 'Nueva reserva iniciada exitosamente',
            reserva: reservaReiniciada
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getReserva,
    agregarReserva,
    actualizarPorciones,
    eliminarPlato,
    confirmarReserva,
    reiniciarReserva
};
