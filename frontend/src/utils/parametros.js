/** Peso medio por lote para convertir kg ↔ lotes en la UI */
export const KG_POR_LOTE = 40;

export const DEFAULT_PARAMS = {
  tasaLotesHr: 4,
  tiempoTrituracion: 8,
  eficienciaSep: 90,
  pctRefurbish: 40,
  capacidadLotes: 50,
  tipoIman: 'estandar',
  diasSimulacion: 1,
};

export function imanPorEficiencia(pct) {
  if (pct >= 95) return 'max';
  if (pct >= 88) return 'n52';
  if (pct >= 80) return 'n35';
  return 'estandar';
}

export function uiToApiParams(ui) {
  const tasaLlegadaMin = Math.round((60 / ui.tasaLotesHr) * 10) / 10;
  const capacidadWipKg = Math.round(ui.capacidadLotes * KG_POR_LOTE);

  return {
    tasaLlegadaMin,
    capacidadWipKg,
    tipoIman: imanPorEficiencia(ui.eficienciaSep),
    diasSimulacion: ui.diasSimulacion ?? 1,
    _ui: ui,
  };
}

export function kgALotes(kg) {
  return Math.round((kg / KG_POR_LOTE) * 10) / 10;
}

export function lotesAKg(lotes) {
  return lotes * KG_POR_LOTE;
}
