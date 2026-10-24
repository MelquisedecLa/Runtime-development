//Esto es un placeholder, es decir es solo para que el codigo furule hasta que llegue Luis a chambiar
import { UncontrolledAlert } from 'reactstrap'

function AlertaError({ error }) {
  if (!error) return null

  return (
    <UncontrolledAlert color="warning" key={error.id}>
      {error.mensaje}
    </UncontrolledAlert>
  )
}

export default AlertaError