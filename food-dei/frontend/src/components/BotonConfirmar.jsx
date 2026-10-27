import { Button } from 'reactstrap'

function BotonConfirmar({ items, estado, cargando, onConfirmar }) {
  const vacia = items.length === 0
  const confirmada = estado === 'confirmada'

  return (
    <Button
      color="success"
      block
      className="mt-3"
      disabled={vacia || cargando || confirmada}
      onClick={() => onConfirmar()}
    >
      {confirmada ? 'Reserva confirmada' : 'Confirmar reserva'}
    </Button>
  )
}

export default BotonConfirmar