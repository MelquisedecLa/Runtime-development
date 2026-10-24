let reserva = {
    id: 1,
    saldoInicial: 25,
    itemsReservados: [],
    total: 0,
    estado: 'pendiente',
    fechaExpiracion: new Date(Date.now() + 10 * 60 * 1000) // 10 minutos a partir de ahora
};

module.exports = {
    reserva
};