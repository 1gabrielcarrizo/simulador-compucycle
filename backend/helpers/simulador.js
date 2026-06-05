const { exponencial, normal, uniforme, empiricaDiscreta } = require('./distributions');
const { crearRng } = require('./random');
const { CONFIGURACIONES_IMAN } = require('./imanes');
const { calcularGradoSaturacion } = require('./saturacion');

const JORNADA_MINUTOS = 8 * 60;
const MINUTOS_POR_DIA = 24 * 60;

function tiempoTrituracion(tipo, rng) {
  if (tipo === 'HDD') return uniforme(6, 8, rng);
  return uniforme(8, 10, rng);
}

function muestrearDestino(tasaReproceso, rng) {
  const pRepro = Math.min(0.99, Math.max(0, tasaReproceso));
  const pRefurb = 0.3;
  const pDest = Math.max(0, 1 - pRepro - pRefurb);
  return empiricaDiscreta(
    [
      { valor: 'destruccion', prob: pDest },
      { valor: 'refurbish', prob: pRefurb },
      { valor: 'reproceso', prob: pRepro },
    ],
    rng,
  );
}

function simularJornada(dia, offsetMinutos, params, tasaReprocesoActiva, rng, estado) {
  const finJornada = offsetMinutos + JORNADA_MINUTOS;
  const eventos = [];
  let sepOcupadaHasta = offsetMinutos;

  const statsDia = {
    wipAcum: 0,
    wipMuestras: 0,
    wipMax: estado.wip,
    gradoMax: 0,
    minutosParada: 0,
    lotesProcesados: 0,
    kgDestruccion: 0,
    kgRefurbish: 0,
    kgReproceso: 0,
  };

  const registrarWip = (t) => {
    const grado = calcularGradoSaturacion(estado.wip);
    estado.serieWip.push({
      tiempoMin: Math.round(t * 10) / 10,
      wipKg: Math.round(estado.wip * 100) / 100,
      grado: grado.grado,
    });
    statsDia.wipAcum += estado.wip;
    statsDia.wipMuestras += 1;
    estado.wipAcumGlobal += estado.wip;
    estado.wipMuestrasGlobal += 1;
    if (estado.wip > statsDia.wipMax) statsDia.wipMax = estado.wip;
    if (estado.wip > estado.wipMaxGlobal) estado.wipMaxGlobal = estado.wip;
    if (grado.grado > statsDia.gradoMax) statsDia.gradoMax = grado.grado;
    if (grado.grado > estado.gradoMaxGlobal) estado.gradoMaxGlobal = grado.grado;
    if (grado.grado >= 4) statsDia.minutosParada += 1;
  };

  const programarSeparacion = (desde) => {
    if (estado.wip <= 0) return;

    // NUEVA REGLA: Si la separadora ya está ocupada trabajando, no encolar otra orden
    if (sepOcupadaHasta > desde) return;

    const inicio = Math.max(desde, sepOcupadaHasta);
    const duracion = uniforme(10, 15, rng);
    const pesoExtraido = Math.min(estado.wip, Math.max(50, normal(500, 50, rng)));
    eventos.push({ tiempo: inicio + duracion, tipo: 'fin_separacion', pesoExtraido });
    sepOcupadaHasta = inicio + duracion;
  };

  programarSeparacion(offsetMinutos);

  let tArribo = offsetMinutos + exponencial(params.tasaLlegadaMin, rng);

  while (tArribo < finJornada) {
    const tipoDisco = empiricaDiscreta(
      [
        { valor: 'HDD', prob: 0.7 },
        { valor: 'SSD', prob: 0.3 },
      ],
      rng,
    );
    const peso = Math.max(100, normal(500, 50, rng));
    const tFinTrit = tArribo + tiempoTrituracion(tipoDisco, rng);

    const lote = {
      id: ++estado.idLote,
      dia,
      tiempoArribo: Math.round(tArribo * 10) / 10,
      tiempoFinTrituracion: Math.round(tFinTrit * 10) / 10,
      tipoDisco,
      pesoKg: Math.round(peso * 100) / 100,
      wipTrasIngreso: 0,
      gradoTrasIngreso: 0,
    };

    eventos.push({ tiempo: tFinTrit, tipo: 'fin_trituracion', lote });
    tArribo += exponencial(params.tasaLlegadaMin, rng);
  }

  // eventos.sort((a, b) => a.tiempo - b.tiempo);

  // for (const ev of eventos) {
  //   if (ev.tiempo > finJornada) break;
  // REEMPLAZO DEL MOTOR DE EVENTOS
  while (eventos.length > 0) {
    // Ordenar dinámicamente para procesar siempre el evento más antiguo
    eventos.sort((a, b) => a.tiempo - b.tiempo);
    const ev = eventos.shift(); // Saca el primer evento de la lista

    if (ev.tiempo > finJornada) break;

    if (ev.tipo === 'fin_trituracion' && ev.lote) {
      estado.wip += ev.lote.pesoKg;
      ev.lote.wipTrasIngreso = Math.round(estado.wip * 100) / 100;
      ev.lote.gradoTrasIngreso = calcularGradoSaturacion(estado.wip).grado;
      estado.porLote.push(ev.lote);
      statsDia.lotesProcesados += 1;
      registrarWip(ev.tiempo);
      programarSeparacion(ev.tiempo);
    }

    if (ev.tipo === 'fin_separacion' && ev.pesoExtraido != null) {
      const extraido = Math.min(ev.pesoExtraido, estado.wip);
      if (extraido > 0) {
        estado.wip -= extraido;
        const destino = muestrearDestino(tasaReprocesoActiva, rng);
        let reprocesoKg = 0;

        if (destino === 'reproceso') {
          reprocesoKg = extraido;
          estado.wip += reprocesoKg;
          estado.kgReproceso += reprocesoKg;
          statsDia.kgReproceso += reprocesoKg;
        } else if (destino === 'destruccion') {
          estado.kgDestruccion += extraido;
          statsDia.kgDestruccion += extraido;
        } else {
          estado.kgRefurbish += extraido;
          statsDia.kgRefurbish += extraido;
        }

        estado.porSeparacion.push({
          dia,
          tiempoFin: Math.round(ev.tiempo * 10) / 10,
          pesoExtraidoKg: Math.round(extraido * 100) / 100,
          destino,
          pesoReprocesoKg: Math.round(reprocesoKg * 100) / 100,
          wipTrasCiclo: Math.round(estado.wip * 100) / 100,
          grado: calcularGradoSaturacion(estado.wip).grado,
        });
        registrarWip(ev.tiempo);
      }
      programarSeparacion(ev.tiempo);
    }
  }

  return {
    wipPromedio: statsDia.wipMuestras > 0 ? statsDia.wipAcum / statsDia.wipMuestras : estado.wip,
    wipMaximo: statsDia.wipMax,
    gradoMaximo: statsDia.gradoMax,
    minutosParada: statsDia.minutosParada,
    lotesProcesados: statsDia.lotesProcesados,
    kgDestruccion: statsDia.kgDestruccion,
    kgRefurbish: statsDia.kgRefurbish,
    kgReproceso: statsDia.kgReproceso,
  };
}

function ejecutarSimulacion(input = {}) {
  const params = {
    tasaLlegadaMin: Number(input.tasaLlegadaMin) || 15,
    capacidadWipKg: Number(input.capacidadWipKg) || 2000,
    tipoIman: input.tipoIman || 'estandar',
    diasSimulacion: Math.min(Math.max(Number(input.diasSimulacion) || 1, 1), 30),
    seed: input.seed,
  };

  const rng = crearRng(params.seed);
  const iman = CONFIGURACIONES_IMAN[params.tipoIman] || CONFIGURACIONES_IMAN.estandar;
  const estabilidadImanDias = Math.max(1, normal(iman.estabilidadMediaDias, iman.estabilidadDesvioDias, rng));
  const estabilidadMinutos = estabilidadImanDias * MINUTOS_POR_DIA;

  const estado = {
    wip: 0,
    porLote: [],
    porSeparacion: [],
    serieWip: [],
    wipAcumGlobal: 0,
    wipMuestrasGlobal: 0,
    wipMaxGlobal: 0,
    gradoMaxGlobal: 0,
    kgDestruccion: 0,
    kgRefurbish: 0,
    kgReproceso: 0,
    idLote: 0,
  };

  const porDia = [];
  let minutosParadaTotal = 0;
  let requiereUpgradeGlobal = false;

  for (let dia = 1; dia <= params.diasSimulacion; dia++) {
    const offset = (dia - 1) * JORNADA_MINUTOS;
    const minutosSimulados = dia * JORNADA_MINUTOS;
    const imanOptimo = minutosSimulados <= estabilidadMinutos;
    const tasaReproceso = imanOptimo ? iman.tasaRetorno : 0.1;

    const stats = simularJornada(dia, offset, params, tasaReproceso, rng, estado);
    const requiereUpgrade = stats.wipPromedio >= params.capacidadWipKg;
    if (requiereUpgrade) requiereUpgradeGlobal = true;

    let decisionInversion;
    if (requiereUpgrade) {
      decisionInversion =
        'SI: WIP promedio >= capacidad tolerada. Se recomienda upgrade de rodillos magnéticos.';
    } else if (stats.gradoMaximo >= 4) {
      decisionInversion =
        'ALERTA: Grado 4 (crítico). Evaluar inversión magnética o parada programada.';
    } else {
      decisionInversion =
        'NO: Mantener rodillo estándar y gestionar flujo manualmente.';
    }

    porDia.push({
      dia,
      lotesProcesados: stats.lotesProcesados,
      wipPromedio: Math.round(stats.wipPromedio * 100) / 100,
      wipMaximo: Math.round(stats.wipMaximo * 100) / 100,
      gradoMaximo: stats.gradoMaximo,
      minutosParada: stats.minutosParada,
      kgDestruccion: Math.round(stats.kgDestruccion * 100) / 100,
      kgRefurbish: Math.round(stats.kgRefurbish * 100) / 100,
      kgReproceso: Math.round(stats.kgReproceso * 100) / 100,
      decisionInversion,
      requiereUpgrade,
    });

    minutosParadaTotal += stats.minutosParada;
  }

  const kgProcesados = estado.porLote.reduce((s, l) => s + l.pesoKg, 0);
  const wipPromedioGlobal =
    estado.wipMuestrasGlobal > 0 ? estado.wipAcumGlobal / estado.wipMuestrasGlobal : 0;
  const scrapRecuperadoKg = estado.kgRefurbish + estado.kgDestruccion * 0.35;
  const tasaRechazoPct = kgProcesados > 0 ? (estado.kgReproceso / kgProcesados) * 100 : 0;

  const costosOperativosUsd = Math.round(
    minutosParadaTotal * 125 +
    iman.calibracionHoras * 450 +
    (estado.gradoMaxGlobal >= 4 ? 3500 : 0),
  );

  let decisionFinal;
  if (requiereUpgradeGlobal) {
    decisionFinal =
      'Regla IF-THEN #1: Promedio WIP >= umbral → Aplicar plan de actualización tecnológica (imanes).';
  } else if (estado.gradoMaxGlobal >= 4) {
    decisionFinal =
      'Regla IF-THEN #3: Grado 4 alcanzado → Parada o inversión en infraestructura magnética.';
  } else if (params.tipoIman !== 'estandar' && estabilidadImanDias < params.diasSimulacion) {
    decisionFinal =
      'Regla IF-THEN #4: Estabilidad del imán vencida → Reevaluar desgaste y recalibrar.';
  } else {
    decisionFinal =
      'Regla IF-THEN #2: Operación dentro de límites → Mantener configuración y gestión manual.';
  }

  return {
    parametros: params,
    iman,
    estabilidadImanDias: Math.round(estabilidadImanDias * 100) / 100,
    porLote: estado.porLote,
    porSeparacion: estado.porSeparacion,
    porDia,
    serieWip: estado.serieWip,
    totales: {
      lotesTotales: estado.porLote.length,
      kgProcesados: Math.round(kgProcesados * 100) / 100,
      wipPromedioGlobal: Math.round(wipPromedioGlobal * 100) / 100,
      wipMaximoGlobal: Math.round(estado.wipMaxGlobal * 100) / 100,
      gradoMaximoGlobal: estado.gradoMaxGlobal,
      costosOperativosUsd,
      scrapRecuperadoKg: Math.round(scrapRecuperadoKg * 100) / 100,
      tasaRechazoPct: Math.round(tasaRechazoPct * 100) / 100,
      minutosParadaTotales: minutosParadaTotal,
      decisionFinal,
      requiereUpgradeIman: requiereUpgradeGlobal,
    },
  };
}

module.exports = { ejecutarSimulacion };
