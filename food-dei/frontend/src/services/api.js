const BASE_URL = '/api'

// Función central: todas las peticiones pasan por aquí
const request = async (path, options = {}) => {
    let res
    try {
        res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    })
    } catch {
    throw new Error('No se pudo conectar con el servidor')
    }

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
    // El backend responde { mensaje: "Stock insuficiente" }
    throw new Error(data.mensaje || 'Ocurrió un error inesperado')
    }
    return data
}

export const getMenu = () => request('/menu')

export const getReserva = () => request('/reserva')

export const agregarAlimento = (alimentoId, cantidad = 1) =>
    request('/reserva/agregar', {
    method: 'POST',
    body: JSON.stringify({ alimentoId, cantidad }),
    })

export const actualizarPorciones = (id, cantidad) =>
    request(`/reserva/actualizar-porciones/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ cantidad }),
    })

export const eliminarAlimento = (id) =>
    request(`/reserva/eliminar/${id}`, { method: 'DELETE' })