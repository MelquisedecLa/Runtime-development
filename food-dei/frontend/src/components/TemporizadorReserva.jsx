import { useState, useEffect } from 'react'
import { Alert } from 'reactstrap'

function TemporizadorReserva({ fechaExpiracion, onExpirar }) {
  const [segundos, setSegundos] = useState(null)

  useEffect(() => {
    if (!fechaExpiracion) return

    const calcular = () =>
      Math.max(0, Math.floor((new Date(fechaExpiracion) - Date.now()) / 1000))

    setSegundos(calcular())

    const intervalo = setInterval(() => {
      const restante = calcular()
      setSegundos(restante)
      if (restante === 0) {
        clearInterval(intervalo)
        onExpirar()
      }
    }, 1000)

    return () => clearInterval(intervalo)
  }, [fechaExpiracion])

  if (segundos === null) return null

  if (segundos === 0) {
    return (
      <Alert color="danger">
        Tu reserva expiró. Inicia una nueva para continuar.
      </Alert>
    )
  }

  const min = String(Math.floor(segundos / 60)).padStart(2, '0')
  const seg = String(segundos % 60).padStart(2, '0')

  return <Alert color="warning">Tiempo restante: {min}:{seg}</Alert>
}

export default TemporizadorReserva