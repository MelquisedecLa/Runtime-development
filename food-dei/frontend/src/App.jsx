import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'reactstrap'
import {
  getMenu,
  getReserva,
  agregarAlimento,
  actualizarPorciones,
  eliminarAlimento,
} from './services/api'
import PanelSuperior from './components/PanelSuperior'
import AlertaError from './components/AlertaError'
import MenuGrid from './components/MenuGrid'
import Carrito from './components/Carrito'

function App() {
  const [menu, setMenu] = useState([])
  const [reserva, setReserva] = useState({ saldo: 0, itemsReservados: [], total: 0 })
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Vuelve a pedir menú y reserva al backend
  const refrescar = async () => {
    const [menuData, reservaData] = await Promise.all([getMenu(), getReserva()])
    setMenu(menuData)
    setReserva(reservaData)
  }

  // Carga inicial
  useEffect(() => {
    refrescar()
      .catch((err) => setError({ mensaje: err.message, id: Date.now() }))
      .finally(() => setCargando(false))
  }, [])

  // Envuelve cualquier acción: loading + error + refresco
  const ejecutar = async (accion) => {
    setCargando(true)
    setError(null)
    try {
      await accion()
      await refrescar()
    } catch (err) {
      setError({ mensaje: err.message, id: Date.now() })
    } finally {
      setCargando(false)
    }
  }

  const handleAgregar = (alimentoId) => ejecutar(() => agregarAlimento(alimentoId, 1))
  const handleActualizar = (id, cantidad) => ejecutar(() => actualizarPorciones(id, cantidad))
  const handleEliminar = (id) => ejecutar(() => eliminarAlimento(id))

  return (
    <>
      <PanelSuperior saldo={reserva.saldo} total={reserva.total} />

      <Container className="mt-3">
        <AlertaError error={error} />

        <Row>
          <Col xs="12" md="8">
            <h4 className="mb-3">Menú del día</h4>
            <MenuGrid menu={menu} cargando={cargando} onAgregar={handleAgregar} />
          </Col>

          <Col xs="12" md="4">
            <Carrito
              items={reserva.itemsReservados}
              menu={menu}
              total={reserva.total}
              cargando={cargando}
              onActualizar={handleActualizar}
              onEliminar={handleEliminar}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App