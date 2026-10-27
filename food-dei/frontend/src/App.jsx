import { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import * as api from './services/api'
import PanelSuperior from './components/PanelSuperior'
import AlertaError from './components/AlertaError'
import Carrito from './components/Carrito'
import MenuGrid from './components/MenuGrid'
import TemporizadorReserva from './components/TemporizadorReserva'
import BotonConfirmar from './components/BotonConfirmar'

function App() {
  const [menu, setMenu] = useState([])
  const [reserva, setReserva] = useState({
    saldo: 0,
    itemsReservados: [],
    total: 0,
    estado: 'pendiente'
  })
  const [error, setError] = useState(null)
  const [errorId, setErrorId] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tiempoRestante, setTiempoRestante] = useState(0)

  const mostrarError = (mensaje) => {
    setError(mensaje)
    setErrorId((n) => n + 1)
  }

  const cargarDatos = async () => {
    const [menuData, reservaData] = await Promise.all([
      api.getMenu(),
      api.getReserva()
    ])

    setMenu(menuData)
    setReserva(reservaData)
  }

  useEffect(() => {
    let activo = true

    Promise.all([api.getMenu(), api.getReserva()])
      .then(([menuData, reservaData]) => {
        if (!activo) return

        setMenu(menuData)
        setReserva(reservaData)
      })
      .catch((e) => {
        if (!activo) return

        setError(e.message)
        setErrorId((n) => n + 1)
      })
      .finally(() => {
        if (activo) {
          setLoading(false)
        }
      })

    return () => {
      activo = false
    }
  }, [])

  const ejecutar = async (accion) => {
    setLoading(true)
    setError(null)

    try {
      await accion()
      await cargarDatos()
    } catch (e) {
      mostrarError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const agregar = (alimentoId) =>
    ejecutar(() => api.agregarAlimento(alimentoId, 1))

  const eliminar = (id) =>
    ejecutar(() => api.eliminarAlimento(id))

  const actualizar = (id, cantidad) => {
    if (cantidad < 1) {
      return eliminar(id)
    }

    return ejecutar(() => api.actualizarPorciones(id, cantidad))
  }

  const confirmar = () =>
    ejecutar(() => api.confirmarReserva())

  const reiniciar = () =>
    ejecutar(() => api.reiniciarReserva())

  // La guía pide que el saldo se descuente visualmente
  // mientras se arma la reserva.
  const saldoDisponible =
    reserva.estado === 'pendiente'
      ? Math.max(0, reserva.saldo - reserva.total)
      : reserva.saldo

  const reservaPendiente = reserva.estado === 'pendiente'

  useEffect(() => {
    // Si la reserva ya no está pendiente,
    // no necesitamos seguir ejecutando el contador.
    if (
      reserva.estado !== 'pendiente' ||
      !reserva.fechaExpiracion
    ) {
      return
    }

    const actualizarContador = async () => {
      const ahora = new Date()
      const expiracion = new Date(reserva.fechaExpiracion)
      const diferencia = expiracion - ahora

      const segundos = Math.max(
        0,
        Math.floor(diferencia / 1000)
      )

      setTiempoRestante(segundos)

      // Cuando llega a cero consultamos nuevamente el backend.
      // El backend detectará que la reserva expiró y devolverá
      // el nuevo estado.
      if (segundos === 0) {
        try {
          await cargarDatos()
        } catch (e) {
          mostrarError(e.message)
        }
      }
    }

    // Ejecutamos una vez inmediatamente para no esperar
    // un segundo antes de mostrar el tiempo.
    actualizarContador()

    const intervalo = setInterval(
      actualizarContador,
      1000
    )

    return () => clearInterval(intervalo)
  }, [reserva.fechaExpiracion, reserva.estado])

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60)
    const segundosRestantes = segundos % 60

    return `${String(minutos).padStart(2, '0')}:${String(
      segundosRestantes
    ).padStart(2, '0')}`
  }

  return (
    <Container className="py-3">
      <AlertaError
        key={errorId}
        mensaje={error}
      />

      <PanelSuperior
        saldo={saldoDisponible}
        total={reserva.total}
      />

      {reserva.estado === 'pendiente' ? (
        <p className="mb-1">
          ⏱ Tiempo restante:{' '}
          {formatearTiempo(tiempoRestante)}
        </p>
      ) : reserva.estado === 'expirada' ? (
        <p className="text-danger mb-1">
          ⏱ Reserva expirada
        </p>
      ) : null}

      {loading && (
        <p className="text-muted">
          Cargando...
        </p>
      )}

      <Row>
        <Col xs="12" md="8">
          <h4>Menú del Día</h4>

          <MenuGrid
            menu={menu}
            loading={loading}
            disabled={!reservaPendiente}
            onAgregar={agregar}
          />
        </Col>

        <Col xs="12" md="4">
          <h4>Tu Bandeja de Reserva</h4>

          <Carrito
            items={reserva.itemsReservados}
            menu={menu}
            loading={loading}
            estado={reserva.estado}
            onActualizar={actualizar}
            onEliminar={eliminar}
          />

          {reservaPendiente ? (
            <Button
              color="success"
              className="mt-3 w-100"
              disabled={
                loading ||
                reserva.itemsReservados.length === 0
              }
              onClick={confirmar}
            >
              Confirmar Reserva
            </Button>
          ) : (
            <Button
              color="primary"
              className="mt-3 w-100"
              disabled={loading}
              onClick={reiniciar}
            >
              Nueva Reserva
            </Button>
          )}

          {reserva.estado === 'confirmada' && (
            <p className="text-success mt-3">
              Reserva confirmada correctamente.
            </p>
          )}

          {reserva.estado === 'expirada' && (
            <p className="text-danger mt-3">
              La reserva expiró. Inicia una nueva reserva.
            </p>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default App

