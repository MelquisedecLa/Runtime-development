import { useState } from 'react';
import { Container, Card, CardBody, Button, Input, Form, Alert } from 'reactstrap';
import './App.css';

function App() {
  const [numero, setNumero] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [gano, setGano] = useState(false);

  const enviarIntento = async (e) => {
    e.preventDefault();

    const intento = Number(numero);

    if (numero === '' || !Number.isInteger(intento) ||
        intento < 1 || intento > 100) {
      setMensaje('Ingresa un número válido entre 1 y 100');
      return;
    }

    try {
      const respuesta = await fetch('/api/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numero: intento })
      });

      if (!respuesta.ok) {
        throw new Error('Error al enviar el intento');
      }

      const datos = await respuesta.json();

      setHistorial([...historial, intento]);
      setMensaje(datos.mensaje);

      if (datos.resultado === 'correcto') {
        setGano(true);
      } else {
        setIntentosFallidos(prev => prev + 1);
      }

      setNumero('');

    } catch (error) {
      setMensaje('No se pudo conectar con el servidor');
    }
  };

  const reiniciarJuego = async () => {
    try {
      const respuesta = await fetch('/api/reset', {
        method: 'POST'
      });

      if (!respuesta.ok) {
        throw new Error('Error al reiniciar');
      }

      setNumero('');
      setMensaje('¡Nuevo juego iniciado!');
      setIntentosFallidos(0);
      setHistorial([]);
      setGano(false);

    } catch (error) {
      setMensaje('No se pudo reiniciar el juego');
    }
  };

  return (
    <Container className="contenedor-juego">
      <Card className="shadow">
        <CardBody>
          <h2>Adivina el Número</h2>
          <p>Estoy pensando en un número entre 1 y 100.</p>

          <Form onSubmit={enviarIntento}>
            <Input
              type="number"
              min="1"
              max="100"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ingresa tu número"
              disabled={gano}
            />

            <Button
              color="primary"
              type="submit"
              className="mt-3"
              disabled={gano}
            >
              Adivinar
            </Button>
          </Form>

          {mensaje && (
            <Alert color={gano ? 'success' : 'info'} className="mt-3">
              {mensaje}
            </Alert>
          )}

          <h5>Intentos fallidos: {intentosFallidos}</h5>

          <h5>Historial de intentos:</h5>
          <ul>
            {historial.map((intento, index) => (
              <li key={index}>
                Intento {index + 1}: {intento}
              </li>
            ))}
          </ul>

          <Button color="danger" onClick={reiniciarJuego}>
            Reiniciar juego
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
}

export default App;