import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/** Simulación estocástica (distribuciones del modelo) */
export async function iniciarJornadaAleatoria() {
  const { data } = await api.post('/simulacion/run', { modo: 'aleatorio' });
  return data;
}

/** Simulación con valores fijos ingresados por el usuario */
export async function iniciarJornadaConValores(valoresFijos) {
  const { data } = await api.post('/simulacion/run', {
    modo: 'deterministico',
    valoresFijos,
  });
  return data;
}
