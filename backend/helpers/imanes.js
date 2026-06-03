const CONFIGURACIONES_IMAN = {
  estandar: {
    id: 'estandar',
    nombre: 'Rodillo Estándar',
    reduccionRetorno: 0,
    tasaRetorno: 0.1,
    estabilidadMediaDias: 8,
    estabilidadDesvioDias: 2,
    calibracionHoras: 0,
  },
  n35: {
    id: 'n35',
    nombre: 'Imán Neodimio N35',
    reduccionRetorno: 0.04,
    tasaRetorno: 0.06,
    estabilidadMediaDias: 12,
    estabilidadDesvioDias: 2,
    calibracionHoras: 4,
  },
  n52: {
    id: 'n52',
    nombre: 'Imán Neodimio N52',
    reduccionRetorno: 0.06,
    tasaRetorno: 0.04,
    estabilidadMediaDias: 22,
    estabilidadDesvioDias: 2,
    calibracionHoras: 6,
  },
  max: {
    id: 'max',
    nombre: 'Separador Max',
    reduccionRetorno: 0.08,
    tasaRetorno: 0.02,
    estabilidadMediaDias: 33,
    estabilidadDesvioDias: 2,
    calibracionHoras: 12,
  },
};

const TIPOS_IMAN_VALIDOS = Object.keys(CONFIGURACIONES_IMAN);

module.exports = { CONFIGURACIONES_IMAN, TIPOS_IMAN_VALIDOS };
