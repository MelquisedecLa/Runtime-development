//Esto es un placeholder, es decir es solo para que el codigo furule hasta que llegue Luis a chambiar
import { Alert, Badge } from 'reactstrap'

function PanelSuperior({ saldo, total }) {
  return (
    <Alert color="info" className="mb-0 rounded-0 d-flex justify-content-between">
      <span>Tu saldo actual: ${Number(saldo).toFixed(2)}</span>
      <span>
        Total de tu Reserva: <Badge color="dark" pill>${Number(total).toFixed(2)}</Badge>
      </span>
    </Alert>
  )
}

export default PanelSuperior