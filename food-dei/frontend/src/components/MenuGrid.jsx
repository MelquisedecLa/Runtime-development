import { Row, Col, Spinner } from 'reactstrap'
import MenuCard from './MenuCard'

function MenuGrid({ menu, loading, disabled, onAgregar }) {
  if (menu.length === 0 && loading) {
    return <Spinner color="primary">Cargando...</Spinner>
  }

  return (
    <Row>
      {menu.map((plato) => (
        <Col xs="12" md="4" key={plato.id}>
          <MenuCard
            plato={plato}
            loading={loading}
            disabled={disabled}
            onAgregar={onAgregar}
          />
        </Col>
      ))}
    </Row>
  )
}

export default MenuGrid
