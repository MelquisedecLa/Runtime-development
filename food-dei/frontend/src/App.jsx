import { useState, useEffect } from 'react'
import { Container, Row, Col, Alert } from 'reactstrap'
import * as api from './services/api'
import PanelSuperior from './components/PanelSuperior'
import AlertaError from './components/AlertaError'
import Carrito from './components/Carrito'
import MenuGrid from './components/MenuGrid'
import TemporizadorReserva from './components/TemporizadorReserva'
import BotonConfirmar from './components/BotonConfirmar'

function App() {
  const [menu, setMenu] = useState([])
  const [reserva, setReserva] = useState({ saldo: 0, itemsReservados: [], total: 0 })
  const [error, setError] = useState(null)
  const [errorId, setErrorId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [exito, setExito] = useState(null)

  const mostrarError = (mensaje) => {
    setError(mensaje)
    setErrorId((n) => n + 1)
  }

  const cargarDatos = async () => {
    const [menuData, reservaData] = await Promise.all([api.getMenu(), api.getReserva()])
    setMenu(menuData)
    setReserva(reservaData)
  }

  useEffect(() => {
    cargarDatos().catch((e) => mostrarError(e.message))
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

  const agregar = (alimentoId) => ejecutar(() => api.agregarAlimento(alimentoId, 1))
  const eliminar = (id) => ejecutar(() => api.eliminarAlimento(id))

  const actualizar = (id, cantidad) => {
    if (cantidad < 1) return eliminar(id)
    return ejecutar(() => api.actualizarPorciones(id, cantidad))
  }

  const confirmar = () => {
    setExito(null)
    return ejecutar(async () => {
      const res = await api.confirmarReserva()
      setExito(res?.mensaje || 'Reserva confirmada con éxito')
    })
  }

  // Saldo disponible = saldo inicial - total reservado (si el backend ya manda "saldo", se usa ese)
  const saldoDisponible = reserva.saldo ?? (reserva.saldoInicial ?? 0) - (reserva.total ?? 0)

  return (
    <Container className="py-3">
      <AlertaError key={errorId} mensaje={error} />

      {exito && (
        <Alert color="success" toggle={() => setExito(null)}>
          {exito}
        </Alert>
      )}

      {reserva.estado === 'pendiente' && (
        <TemporizadorReserva
          fechaExpiracion={reserva.fechaExpiracion}
          onExpirar={cargarDatos}
        />
      )}

      <PanelSuperior saldo={saldoDisponible} total={reserva.total} />
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
          <BotonConfirmar
            items={reserva.itemsReservados}
            estado={reserva.estado}
            cargando={loading}
            onConfirmar={confirmar}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default App