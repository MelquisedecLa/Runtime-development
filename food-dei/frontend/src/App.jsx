import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import * as api from './services/api'
import PanelSuperior from './components/PanelSuperior'
import AlertaError from './components/AlertaError'
import Carrito from './components/Carrito'
import MenuGrid from './components/MenuGrid'
import TemporizadorReserva from './components/TemporizadorReserva'

function App() {
  const [menu, setMenu] = useState([])
  const [reserva, setReserva] = useState({ saldo: 0, itemsReservados: [], total: 0 })
  const [error, setError] = useState(null)
  const [errorId, setErrorId] = useState(0)
  const [loading, setLoading] = useState(false)

  const mostrarError = (mensaje) => {
    setError(mensaje)
    setErrorId((n) => n + 1) // fuerza que el alert reaparezca aunque el mensaje se repita
  }

  const cargarDatos = async () => {
    const [menuData, reservaData] = await Promise.all([api.getMenu(), api.getReserva()])
    setMenu(menuData)
    setReserva(reservaData)
  }

  useEffect(() => {
    cargarDatos().catch((e) => mostrarError(e.message))
  }, [])

  // Patrón común: loading -> acción -> refrescar -> manejar error -> quitar loading
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

  const agregar = (alimentoId) => ejecutar(() => api.agregarAlimento(alimentoId, 1))

  const eliminar = (id) => ejecutar(() => api.eliminarAlimento(id))

  const actualizar = (id, cantidad) => {
    if (cantidad < 1) return eliminar(id)
    return ejecutar(() => api.actualizarPorciones(id, cantidad))
  }

  return (
    <Container className="py-3">
      <AlertaError key={errorId} mensaje={error} />
      <TemporizadorReserva
      fechaExpiracion={reserva.fechaExpiracion}
      onExpirar={cargarDatos}
      />
      <PanelSuperior saldo={reserva.saldoInicial} total={reserva.total} />
      {loading && <p className="text-muted">Cargando...</p>}

      <Row>
        <Col xs="12" md="8">
          <h4>Menú del Día</h4>
          <MenuGrid menu={menu} loading={loading} onAgregar={agregar} />
        </Col>
        <Col xs="12" md="4">
          <h4>Tu Bandeja de Reserva</h4>
          <Carrito
            items={reserva.itemsReservados}
            menu={menu}
            loading={loading}
            onActualizar={actualizar}
            onEliminar={eliminar}
          />
        </Col>
      </Row>
    </Container>
  )
}



export default App