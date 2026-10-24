const { menu } = require('../data/menu');
const { reserva } = require('../data/reserva');

function calcularTotal(reserva) {
    if (!menu || !reserva || !reserva.itemsReservados) {
        throw new Error('Datos de reserva o menú no válidos');
    }
    const total = reserva.itemsReservados.reduce((acc, item) => {
        const plato = menu.find(p => p.id === item.platoId);
        return acc + (plato.precio * item.cantidad);
    }, 0);
    return total;
}

function verificarExpiracionReserva(reserva) {
    if (reserva.estado !== 'pendiente') {
        return false;
    }
    if (new Date() >= new Date(reserva.fechaExpiracion)) {
        reserva.estado = 'expirada';
        return false;
    }
    return true;
}

function buscarReserva(reservaId) {
    if (reserva.id !== Number(reservaId)) {
        throw new Error('Reserva no encontrada');
    }
    return reserva;
}

function getReserva(reservaId) {
    buscarReserva(reservaId);
    return reserva;
}

function agregarReserva(reservaId, platoId, cantidad) {
    const reserva = buscarReserva(reservaId);
    platoId = Number(platoId);
    cantidad = Number(cantidad);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error('La cantidad debe ser un entero positivo');
    }
    if (reserva.estado !== 'pendiente') {
        throw new Error('La reserva no está pendiente');
    }
    if (!verificarExpiracionReserva(reserva)) {
        throw new Error('La reserva ha expirado');
    }
    const plato = menu.find(p => p.id === platoId);
    if (!plato) {
        throw new Error('Plato no encontrado en el menú');
    }
    const itemExistente = reserva.itemsReservados.find(
        item => item.platoId === platoId
    );
    const cantidadActual = itemExistente ? itemExistente.cantidad : 0;
    const cantidadTotal = cantidadActual + cantidad;
    if (cantidadTotal > plato.stock) {
        throw new Error('Stock insuficiente');
    }
    const nuevoTotal = calcularTotal(reserva) + plato.precio * cantidad;
    if (nuevoTotal > reserva.saldoInicial) {
        throw new Error('Saldo insuficiente');
    }
    if (itemExistente) {
        itemExistente.cantidad = cantidadTotal;
    } else {
        reserva.itemsReservados.push({ platoId, cantidad });
    }
    reserva.total = nuevoTotal;

    return reserva;
}

function actualizarPorciones(reservaId, platoId, cantidad) {
    const reserva = buscarReserva(reservaId);
    platoId = Number(platoId);
    cantidad = Number(cantidad);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        throw new Error('La cantidad debe ser un entero positivo');
    }
    if (reserva.estado !== 'pendiente') {
        throw new Error('La reserva no está pendiente');
    }
    if (!verificarExpiracionReserva(reserva)) {
        throw new Error('La reserva ha expirado');
    }
    const item = reserva.itemsReservados.find(
        i => i.platoId === platoId
    );
    if (!item) {
        throw new Error('Plato no encontrado en la reserva');
    }
    const plato = menu.find(p => p.id === platoId);
    if (!plato) {
        throw new Error('Plato no encontrado en el menú');
    }
    if (cantidad > plato.stock) {
        throw new Error('Stock insuficiente');
    }
    const totalActual = calcularTotal(reserva);
    const nuevoTotal =
        totalActual -
        (plato.precio * item.cantidad) +
        (plato.precio * cantidad);
    if (nuevoTotal > reserva.saldoInicial) {
        throw new Error('Saldo insuficiente');
    }
    item.cantidad = cantidad;
    reserva.total = nuevoTotal;

    return reserva;
}

function eliminarPlato(reservaId, platoId) {
    const reserva = buscarReserva(reservaId);
    platoId = Number(platoId);
    if (reserva.estado !== 'pendiente') {
        throw new Error('La reserva no está pendiente');
    }
    if (!verificarExpiracionReserva(reserva)) {
        throw new Error('La reserva ha expirado');
    }
    const idBuscado = reserva.itemsReservados.findIndex(
        item => item.platoId === platoId
    );
    if (idBuscado === -1) {
        throw new Error('Plato no encontrado en la reserva');
    }
    reserva.itemsReservados.splice(idBuscado, 1);
    reserva.total = calcularTotal(reserva);

    return reserva;
}

function confirmarReserva(reservaId) {
    const reserva = buscarReserva(reservaId);
    if (reserva.estado !== 'pendiente') {
        throw new Error('La reserva no está pendiente');
    }
    if (!verificarExpiracionReserva(reserva)) {
        throw new Error('La reserva ha expirado');
    }
    if (reserva.itemsReservados.length === 0) {
        throw new Error('No se puede confirmar una reserva sin platos');
    }
    for (const item of reserva.itemsReservados) {
        const plato = menu.find(p => p.id === item.platoId);
        if (!plato) {
            throw new Error('Uno de los platos no existe en el menú');
        }
        if (plato.stock < item.cantidad) {
            throw new Error(`Stock insuficiente para el plato ${item.platoId}`);
        }
    }
    const total = calcularTotal(reserva);
    if (total > reserva.saldoInicial) {
        throw new Error('Saldo insuficiente');
    }
    for (const item of reserva.itemsReservados) {
        const plato = menu.find(p => p.id === item.platoId);
        plato.stock -= item.cantidad;
    }
    reserva.total = total;
    reserva.saldoInicial -= total;
    reserva.estado = 'confirmada';

    return reserva;
}

module.exports = {
    getReserva,
    agregarReserva, 
    actualizarPorciones, 
    eliminarPlato,
    confirmarReserva
};
