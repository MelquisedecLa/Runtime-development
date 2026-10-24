import { Card, CardBody, CardTitle, CardSubtitle, Badge, Button } from 'reactstrap'

function MenuCard({ plato, cargando, onAgregar }) {
  const agotado = plato.stock === 0

  return (
    <Card className="mb-3">
      <CardBody>
        <CardTitle tag="h5">{plato.nombre}</CardTitle>
        <CardSubtitle className="mb-2 text-muted">{plato.categoria}</CardSubtitle>

        <p className="mb-2">
          <Badge color="success" className="fs-6">
            ${plato.precio.toFixed(2)}
          </Badge>
        </p>
        <p className="mb-3">Stock disponible: {plato.stock}</p>

        {agotado ? (
          <Button color="secondary" disabled block>
            Agotado
          </Button>
        ) : (
          <Button color="primary" block disabled={cargando} onClick={() => onAgregar(plato.id)}>
            Añadir a la Reserva
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default MenuCard