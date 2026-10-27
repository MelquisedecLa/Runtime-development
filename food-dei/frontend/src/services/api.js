const BASE = '/api'


async function request(url, opciones) {
  const res = await fetch(`${BASE}${url}`, opciones)
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(
      data.mensaje ||
      data.message ||
      data.error ||
      'Error en la petición'
    )
  }

  return data
}

const jsonHeaders = {
  'Content-Type': 'application/json'
}

export const getMenu = () => request('/menu')

export const getReserva = () => request('/reserva')

export const agregarAlimento = (alimentoId, cantidad = 1) =>
  request('/reserva/agregar', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ alimentoId, cantidad }),
  })

export const actualizarPorciones = (id, cantidad) =>
  request(`/reserva/actualizar-porciones/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ cantidad }),
  })

export const eliminarAlimento = (id) =>
  request(`/reserva/eliminar/${id}`, {
    method: 'DELETE',
  })

export const confirmarReserva = () =>
  request('/reserva/confirmar', {
    method: 'POST',
  })

export const reiniciarReserva = () =>
  request('/reserva/reiniciar', {
    method: 'POST',
  })

export const confirmarReserva = () =>
  request('/reserva/confirmar', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ reservaId: RESERVA_ID }),
  })