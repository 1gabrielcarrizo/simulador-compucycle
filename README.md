# CompuCycle — Simulador RAEE (JavaScript / MERN)

Simulación de eventos discretos: trituración HDD/SSD, tolva WIP y separadora Eddy Current.

## Stack

- **Backend**: Node.js + Express + Mongoose (JavaScript)
- **Frontend**: React + Vite + Bootstrap + Chart.js + SweetAlert2 + Axios

Sin Docker. Sin autenticación.

## Estructura

```
backend/
  index.js
  controllers/
  database/
  helpers/      # RNG, distribuciones, simulador
  models/
  routes/

frontend/
  src/
    api/
    components/
    styles/
```

## Backend

```bash
cd backend
copy .env.template .env
npm install
npm run dev
```

`POST /api/simulacion/run`

```json
{
  "tasaLlegadaMin": 15,
  "capacidadWipKg": 2000,
  "tipoIman": "estandar",
  "diasSimulacion": 1
}
```

## Frontend

```bash
cd frontend
copy .env.template .env
npm install
npm run dev
```

`VITE_API_URL=http://localhost:4000/api`

## Despliegue

- **Render**: carpeta `backend`, `npm start`
- **Netlify**: carpeta `frontend`, `npm run build`, publish `dist`

Modelo matemático: ver `.cursorrules`.
