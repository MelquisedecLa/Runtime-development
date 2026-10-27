let reserva = {
    id: 1,
    saldo: 25,
    itemsReservados: [],
    total: 0,
    estado: 'pendiente',
    fechaExpiracion: new Date(Date.now() + 1 * 60 * 1000) // 1 minuto a partir de ahora
};

module.exports = {
    reserva
};