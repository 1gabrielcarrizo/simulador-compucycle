/** Semáforo WIP — rangos para UI SCADA */
const ZONAS_SEMAFORO = [
  { id: 'verde', minKg: 0, maxKg: 1000, grado: '0-1', etiqueta: 'Operación Estable' },
  { id: 'amarillo', minKg: 1001, maxKg: 1500, grado: 2, etiqueta: 'Alerta Intermedia' },
  { id: 'naranja', minKg: 1501, maxKg: 2000, grado: 3, etiqueta: 'Saturación Alta' },
  { id: 'rojo', minKg: 2001, maxKg: null, grado: 4, etiqueta: 'Estado Crítico' },
];

function evaluarSemaforo(wipKg) {
  const w = Math.max(0, wipKg);
  if (w <= 1000) return { ...ZONAS_SEMAFORO[0], wipKg: w };
  if (w <= 1500) return { ...ZONAS_SEMAFORO[1], wipKg: w };
  if (w <= 2000) return { ...ZONAS_SEMAFORO[2], wipKg: w };
  return { ...ZONAS_SEMAFORO[3], wipKg: w };
}

module.exports = { ZONAS_SEMAFORO, evaluarSemaforo };
