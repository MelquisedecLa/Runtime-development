import { Alert, Badge } from 'reactstrap'

function PanelSuperior({ saldo, total }) {
  return (
    <Alert color="info" className="d-flex justify-content-between align-items-center">
      <span>Tu saldo actual: ${saldo.toFixed(2)}</span>
      <Badge color="dark" pill>
        Total de tu Reserva: ${total.toFixed(2)}
      </Badge>
    </Alert>
  )
}

export default PanelSuperior