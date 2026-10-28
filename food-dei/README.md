# Food DEI - Parcial II Programación Web

Aplicación con integración Frontend-Backend para administrar el menú diario de Food DEI, una reserva activa, stock limitado, saldo disponible y tiempo de expiración.

## Tecnologías

- Backend: Node.js, Express y CORS.
- Frontend: React, Vite, Bootstrap y Reactstrap.
- Persistencia: datos en memoria, tal como permite la guía de evaluación.

## Requisitos

- Node.js 20 o superior.
- npm.

## Ejecutar el backend

```bash
cd backend
npm install
npm run dev
```

El servidor inicia por defecto en `http://localhost:3000`.

## Ejecutar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite mostrará la dirección local del frontend, normalmente `http://localhost:5173`.

## Endpoints obligatorios

- `GET /api/menu`: devuelve los platos, precios, categorías y stock.
- `GET /api/reserva`: devuelve saldo, items reservados y total de la reserva activa.
- `POST /api/reserva/agregar`: body `{ "alimentoId": 101, "cantidad": 1 }`.
- `PUT /api/reserva/actualizar-porciones/:id`: body `{ "cantidad": 2 }`.
- `DELETE /api/reserva/eliminar/:id`: elimina el plato y devuelve sus unidades al stock.

## Endpoints adicionales del flujo

- `POST /api/reserva/confirmar`: confirma la reserva y descuenta definitivamente su total del saldo.
- `POST /api/reserva/reiniciar`: crea una nueva reserva después de confirmar o expirar la anterior, conservando el saldo restante.

## Reglas de negocio implementadas

- El stock se aparta temporalmente al agregar o aumentar porciones.
- Disminuir porciones devuelve la diferencia al stock.
- Quitar un plato devuelve todas sus unidades al stock.
- No se permite superar el stock disponible.
- No se permite que el total de la reserva supere el saldo.
- Al confirmar, el stock no se descuenta una segunda vez.
- Una reserva confirmada queda bloqueada para edición.
- Una reserva pendiente expira a los 10 minutos; al expirar devuelve al stock las unidades apartadas.
- Después de confirmar o expirar se puede iniciar una nueva reserva.

## Nota sobre los datos en memoria

El proyecto no utiliza base de datos. Reiniciar realmente el proceso de Node.js restablece el saldo a `$25.00`, el menú a su stock inicial y crea una reserva pendiente nueva. Recargar únicamente el navegador o reiniciar Vite no reinicia los datos del backend.
