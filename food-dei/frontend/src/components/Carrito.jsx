import { ListGroup, ListGroupItem, ButtonGroup, Button } from 'reactstrap'

function Carrito({ items, menu, loading, estado, onActualizar, onEliminar }) {
  if (items.length === 0) {
    return <p className="text-muted">Tu bandeja está vacía.</p>
  }

  const bloqueado = loading || estado !== 'pendiente'

  return (
    <ListGroup>
      {items.map((item) => {
        const plato = menu.find((p) => p.id === item.id)

        return (
          <ListGroupItem
            key={item.id}
            className="d-flex justify-content-between align-items-center gap-2"
          >
            <span className="flex-grow-1">
              {plato ? plato.nombre : `Plato ${item.id}`}
            </span>

            <ButtonGroup size="sm">
              <Button
                disabled={bloqueado}
                onClick={() => onActualizar(item.id, item.cantidad - 1)}
              >
                -
              </Button>

              <Button disabled>{item.cantidad}</Button>

              <Button
                disabled={bloqueado}
                onClick={() => onActualizar(item.id, item.cantidad + 1)}
              >
                +
              </Button>
            </ButtonGroup>

            <Button
              color="danger"
              outline
              size="sm"
              disabled={bloqueado}
              onClick={() => onEliminar(item.id)}
            >
              Quitar
            </Button>
          </ListGroupItem>
        )
      })}
    </ListGroup>
  )
}

export default Carrito
