const { menu } = require('../data/menu');
const { reserva } = require('../data/reserva');

const redondearDinero = (valor) => Math.round((valor + Number.EPSILON) * 100) / 100;

function calcularTotal(reservaActual) {
    if (!reservaActual || !Array.isArray(reservaActual.itemsReservados)) {
        throw new Error('Datos de reserva no válidos');
    }

    return redondearDinero(
        reservaActual.itemsReservados.reduce((acumulado, item) => {
            const plato = menu.find((p) => p.id === item.id);

            if (!plato) {
                throw new Error(`El plato ${item.id} ya no existe en el menú`);
            }

            return acumulado + plato.precio * item.cantidad;
        }, 0)
    );
}

function verificarExpiracionReserva(reservaActual) {
    if (reservaActual.estado !== 'pendiente') {
        return;
    }

    if (new Date() < new Date(reservaActual.fechaExpiracion)) {
        return;
    }

    // Una reserva pendiente ya había apartado estas unidades; al expirar se liberan.
    for (const item of reservaActual.itemsReservados) {
        const plato = menu.find((p) => p.id === item.id);

        if (plato) {
            plato.stock += item.cantidad;
        }
    }

    reservaActual.itemsReservados = [];
    reservaActual.total = 0;
    reservaActual.estado = 'expirada';
}

function buscarReserva(reservaId) {
    if (reserva.id !== Number(reservaId)) {
        throw new Error('Reserva no encontrada');
    }

    return reserva;
}

function validarReservaPendiente(reservaActual) {
    verificarExpiracionReserva(reservaActual);

    if (reservaActual.estado === 'expirada') {
        throw new Error('La reserva ha expirado');
    }

    if (reservaActual.estado !== 'pendiente') {
        throw new Error('La reserva no está pendiente');
    }
}

function getReserva(reservaId) {
    const reservaActual = buscarReserva(reservaId);
    verificarExpiracionReserva(reservaActual);
    return reservaActual;
}

function agregarReserva(reservaId, alimentoId, cantidad) {
    const reservaActual = buscarReserva(reservaId);
    validarReservaPendiente(reservaActual);

    alimentoId = Number(alimentoId);
    cantidad = Number(cantidad);

    if (!Number.isInteger(alimentoId)) {
        throw new Error('El id del alimento no es válido');
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error('La cantidad debe ser un entero positivo');
    }

    const plato = menu.find((p) => p.id === alimentoId);

    if (!plato) {
        throw new Error('Plato no encontrado en el menú');
    }

    if (cantidad > plato.stock) {
        throw new Error('Stock insuficiente');
    }

    const nuevoTotal = redondearDinero(reservaActual.total + plato.precio * cantidad);

    if (nuevoTotal > reservaActual.saldo) {
        throw new Error('Saldo insuficiente');
    }

    const itemExistente = reservaActual.itemsReservados.find(
        (item) => item.id === alimentoId
    );

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
    } else {
        reservaActual.itemsReservados.push({ id: alimentoId, cantidad });
    }

    // Apartar temporalmente las unidades mientras la reserva está pendiente.
    plato.stock -= cantidad;
    reservaActual.total = nuevoTotal;

    return reservaActual;
}

function actualizarPorciones(reservaId, alimentoId, nuevaCantidad) {
    const reservaActual = buscarReserva(reservaId);
    validarReservaPendiente(reservaActual);

    alimentoId = Number(alimentoId);
    nuevaCantidad = Number(nuevaCantidad);

    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
    }

    const item = reservaActual.itemsReservados.find(
        (elemento) => elemento.id === alimentoId
    );

    if (!item) {
        throw new Error('Plato no encontrado en la reserva');
    }

    const plato = menu.find((p) => p.id === alimentoId);

    if (!plato) {
        throw new Error('Plato no encontrado en el menú');
    }

    const diferencia = nuevaCantidad - item.cantidad;

    if (diferencia > 0 && diferencia > plato.stock) {
        throw new Error('Stock insuficiente');
    }

    const nuevoTotal = redondearDinero(
        reservaActual.total + diferencia * plato.precio
    );

    if (nuevoTotal > reservaActual.saldo) {
        throw new Error('Saldo insuficiente para esta cantidad');
    }

    // diferencia > 0 reserva más stock; diferencia < 0 devuelve stock.
    plato.stock -= diferencia;
    item.cantidad = nuevaCantidad;
    reservaActual.total = nuevoTotal;

    return reservaActual;
}

function eliminarPlato(reservaId, alimentoId) {
    const reservaActual = buscarReserva(reservaId);
    validarReservaPendiente(reservaActual);

    alimentoId = Number(alimentoId);

    const indice = reservaActual.itemsReservados.findIndex(
        (item) => item.id === alimentoId
    );

    if (indice === -1) {
        throw new Error('Plato no encontrado en la reserva');
    }

    const item = reservaActual.itemsReservados[indice];
    const plato = menu.find((p) => p.id === alimentoId);

    if (!plato) {
        throw new Error('Plato no encontrado en el menú');
    }

    // El endpoint DELETE debe devolver las unidades al stock general.
    plato.stock += item.cantidad;
    reservaActual.itemsReservados.splice(indice, 1);
    reservaActual.total = calcularTotal(reservaActual);

    return reservaActual;
}

function confirmarReserva(reservaId) {
    const reservaActual = buscarReserva(reservaId);
    validarReservaPendiente(reservaActual);

    if (reservaActual.itemsReservados.length === 0) {
        throw new Error('No se puede confirmar una reserva sin platos');
    }

    const total = calcularTotal(reservaActual);

    if (total > reservaActual.saldo) {
        throw new Error('Saldo insuficiente');
    }

    // El stock ya fue apartado al agregar/modificar; no se descuenta otra vez.
    reservaActual.total = total;
    reservaActual.saldo = redondearDinero(reservaActual.saldo - total);
    reservaActual.estado = 'confirmada';

    return reservaActual;
}

function reiniciarReserva(reservaId) {
    const reservaActual = buscarReserva(reservaId);
    verificarExpiracionReserva(reservaActual);

    if (reservaActual.estado === 'pendiente') {
        throw new Error('La reserva actual todavía está pendiente');
    }

    reservaActual.itemsReservados = [];
    reservaActual.total = 0;
    reservaActual.estado = 'pendiente';
    reservaActual.fechaExpiracion = new Date(Date.now() + 1 * 60 * 1000);

    return reservaActual;
}

module.exports = {
    getReserva,
    agregarReserva,
    actualizarPorciones,
    eliminarPlato,
    confirmarReserva,
    reiniciarReserva
};
