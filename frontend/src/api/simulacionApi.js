import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export async function ejecutarSimulacion(params) {
  const { data } = await api.post('/simulacion/run', { ...params, guardar: true });
  return data;
}

export async function obtenerHistorial() {
  const { data } = await api.get('/simulacion/historial');
  return data;
}
