const TABLA_SATURACION = [
  { grado: 0, minKg: 0, maxKg: 500, descripcion: 'Operación Estable (Sin congestión)' },
  { grado: 1, minKg: 501, maxKg: 1000, descripcion: 'Flujo Controlado (Acumulación inicial)' },
  { grado: 2, minKg: 1001, maxKg: 1500, descripcion: 'Alerta Intermedia (Tolva al 50%)' },
  { grado: 3, minKg: 1501, maxKg: 2000, descripcion: 'Saturación Alta (Riesgo de atasco)' },
  { grado: 4, minKg: 2001, maxKg: null, descripcion: 'Estado Crítico (Requiere parada o inversión)' },
];

function calcularGradoSaturacion(wipKg) {
  const w = Math.max(0, wipKg);
  if (w <= 500) return TABLA_SATURACION[0];
  if (w <= 1000) return TABLA_SATURACION[1];
  if (w <= 1500) return TABLA_SATURACION[2];
  if (w <= 2000) return TABLA_SATURACION[3];
  return TABLA_SATURACION[4];
}

module.exports = { TABLA_SATURACION, calcularGradoSaturacion };
