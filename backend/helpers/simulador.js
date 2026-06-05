const { exponencial, normal, uniforme, binomial, bernoulli } = require('./distributions');
const { crearRng } = require('./random');
const { CONFIGURACIONES_IMAN } = require('./imanes');
const { evaluarSemaforo } = require('./saturacion');

const JORNADA_MINUTOS = 480;
const TASA_LLEGADA_MEDIA = 15;
const CAPACIDAD_TOLVA_KG = 2500;
const TASA_REPROCESO = 0.1;

function formatoHora(minutos) {
  const h = Math.floor(minutos / 60);
  const m = Math.floor(minutos % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function tiempoTrituracion(tipo, rng) {
  if (tipo === 'HDD') return uniforme(6, 8, rng);
  return uniforme(8, 10, rng);
}

/** Tipo de disco: Binomial B(1, 0.7) → 1 = HDD, 0 = SSD */
function muestrearTipoDisco(rng) {
  return bernoulli(0.7, rng) === 1 ? 'HDD' : 'SSD';
}

/**
 * Destino del material post-separadora mediante Binomial encadenada:
 * B(1, p_repro) → reproceso | B(1, 0.3/(1-p_repro)) → refurbish | else destrucción
 */
function muestrearDestino(tasaReproceso, rng) {
  const pRepro = Math.min(0.99, Math.max(0, tasaReproceso));
  if (bernoulli(pRepro, rng) === 1) return 'reproceso';
  const pRefurb = 0.3 / (1 - pRepro);
  if (bernoulli(pRefurb, rng) === 1) return 'refurbish';
  return 'destruccion';
}

function crearSnapshot(estado, maquinas) {
  const sem = evaluarSemaforo(estado.wip);
  return {
    tiempoMin: estado.tiempoActual,
    hora: formatoHora(estado.tiempoActual),
    wipKg: Math.round(estado.wip * 100) / 100,
    semaforo: sem,
    trituradora: { ...maquinas.trituradora },
    separadora: { ...maquinas.separadora },
    reprocesoActivo: estado.reprocesoActivo,
  };
}

function agregarLog(estado, mensaje, tipo, snapshot) {
  estado.logEventos.push({
    tiempoMin: Math.round(estado.tiempoActual * 10) / 10,
    hora: formatoHora(estado.tiempoActual),
    mensaje,
    tipo,
    snapshot,
  });
}

function ejecutarSimulacion(input = {}) {
  const rng = crearRng(input.seed);
  const iman = CONFIGURACIONES_IMAN.estandar;

  const estado = {
    tiempoActual: 0,
    wip: 0,
    idLote: 0,
    reprocesoActivo: false,
    ciclosReproceso: 0,
    ciclosSeparacion: 0,
    countHDD: 0,
    countSSD: 0,
    wipAcum: 0,
    wipMuestras: 0,
    wipMax: 0,
    kgReproceso: 0,
    kgDestruccion: 0,
    kgRefurbish: 0,
    logEventos: [],
    serieWip: [],
    porLote: [],
    porSeparacion: [],
  };

  const maquinas = {
    trituradora: { estado: 'LIBRE', loteKg: 0 },
    separadora: { estado: 'LIBRE', loteKg: 0 },
  };

  const eventos = [];
  let sepOcupadaHasta = 0;

  const registrarWip = (t) => {
    estado.tiempoActual = t;
    estado.wipAcum += estado.wip;
    estado.wipMuestras += 1;
    if (estado.wip > estado.wipMax) estado.wipMax = estado.wip;
    estado.serieWip.push({
      tiempoMin: Math.round(t * 10) / 10,
      wipKg: Math.round(estado.wip * 100) / 100,
      semaforo: evaluarSemaforo(estado.wip),
    });
  };

  const programarSeparacion = (desde) => {
    if (estado.wip <= 0 || sepOcupadaHasta > desde) return;
    const inicio = Math.max(desde, sepOcupadaHasta);
    const duracion = uniforme(10, 15, rng);
    const pesoExtraido = Math.min(estado.wip, Math.max(50, normal(500, 50, rng)));
    maquinas.separadora = { estado: 'OCUPADA', loteKg: Math.round(pesoExtraido) };
    eventos.push({ tiempo: inicio + duracion, tipo: 'fin_separacion', pesoExtraido, inicio });
    sepOcupadaHasta = inicio + duracion;
  };

  programarSeparacion(0);

  let tArribo = exponencial(TASA_LLEGADA_MEDIA, rng);

  while (tArribo < JORNADA_MINUTOS) {
    const tipoDisco = muestrearTipoDisco(rng);
    if (tipoDisco === 'HDD') estado.countHDD += 1;
    else estado.countSSD += 1;

    const peso = Math.max(100, normal(500, 50, rng));
    const durTrit = tiempoTrituracion(tipoDisco, rng);
    const tFinTrit = tArribo + durTrit;

    const lote = {
      id: ++estado.idLote,
      tiempoArribo: Math.round(tArribo * 10) / 10,
      tiempoFinTrituracion: Math.round(tFinTrit * 10) / 10,
      tipoDisco,
      pesoKg: Math.round(peso * 100) / 100,
    };

    maquinas.trituradora = { estado: 'OCUPADA', loteKg: Math.round(peso) };
    eventos.push({ tiempo: tFinTrit, tipo: 'fin_trituracion', lote });
    tArribo += exponencial(TASA_LLEGADA_MEDIA, rng);
  }

  while (eventos.length > 0) {
    eventos.sort((a, b) => a.tiempo - b.tiempo);
    const ev = eventos.shift();
    if (ev.tiempo > JORNADA_MINUTOS) break;

    estado.tiempoActual = ev.tiempo;

    if (ev.tipo === 'fin_trituracion' && ev.lote) {
      maquinas.trituradora = { estado: 'LIBRE', loteKg: 0 };
      estado.wip += ev.lote.pesoKg;
      ev.lote.wipTrasIngreso = Math.round(estado.wip * 100) / 100;
      estado.porLote.push(ev.lote);

      const snap = crearSnapshot(estado, maquinas);
      agregarLog(
        estado,
        `Lote ${ev.lote.id} ingresó a la Tolva Pulmón (+${ev.lote.pesoKg} kg)`,
        'ingreso_tolva',
        snap,
      );

      registrarWip(ev.tiempo);
      programarSeparacion(ev.tiempo);
    }

    if (ev.tipo === 'fin_separacion' && ev.pesoExtraido != null) {
      const extraido = Math.min(ev.pesoExtraido, estado.wip);
      estado.ciclosSeparacion += 1;

      if (extraido > 0) {
        estado.wip -= extraido;
        const destino = muestrearDestino(TASA_REPROCESO, rng);
        let reprocesoKg = 0;

        if (destino === 'reproceso') {
          reprocesoKg = extraido;
          estado.wip += reprocesoKg;
          estado.kgReproceso += reprocesoKg;
          estado.ciclosReproceso += 1;
          estado.reprocesoActivo = true;
        } else {
          estado.reprocesoActivo = false;
          if (destino === 'destruccion') estado.kgDestruccion += extraido;
          else estado.kgRefurbish += extraido;
        }

        maquinas.separadora = { estado: 'LIBRE', loteKg: 0 };

        const snap = crearSnapshot(estado, maquinas);
        const msgRepro =
          destino === 'reproceso'
            ? ` — ${Math.round(reprocesoKg)} kg retornan al lazo de reproceso`
            : '';
        agregarLog(
          estado,
          `Separadora finalizó ciclo (${Math.round(extraido)} kg, ${destino})${msgRepro}`,
          'separacion',
          snap,
        );

        estado.porSeparacion.push({
          tiempoFin: Math.round(ev.tiempo * 10) / 10,
          pesoExtraidoKg: Math.round(extraido * 100) / 100,
          destino,
          pesoReprocesoKg: Math.round(reprocesoKg * 100) / 100,
          wipTrasCiclo: Math.round(estado.wip * 100) / 100,
        });

        registrarWip(ev.tiempo);
      } else {
        maquinas.separadora = { estado: 'LIBRE', loteKg: 0 };
      }
      programarSeparacion(ev.tiempo);
    }
  }

  const lotesTotales = estado.porLote.length;
  const wipPromedio =
    estado.wipMuestras > 0 ? estado.wipAcum / estado.wipMuestras : estado.wip;
  const wipFinal = estado.wip;
  const tasaReprocesoPct =
    lotesTotales > 0 ? (estado.ciclosReproceso / estado.ciclosSeparacion) * 100 : 0;
  const pctHDD = lotesTotales > 0 ? (estado.countHDD / lotesTotales) * 100 : 0;
  const pctSSD = lotesTotales > 0 ? (estado.countSSD / lotesTotales) * 100 : 0;
  const minutosReproceso = Math.round((estado.ciclosReproceso / Math.max(1, estado.ciclosSeparacion)) * JORNADA_MINUTOS);
  const pctTiempoReproceso = Math.round((minutosReproceso / JORNADA_MINUTOS) * 100);

  const requiereUpgrade = wipPromedio >= 2000;
  let decision;
  let recomendacion;

  if (requiereUpgrade) {
    decision = 'CRITICO';
    recomendacion = 'RECOMENDACIÓN: ADQUIRIR IMÁN DE NEODIMIO O SEPARADOR MAX';
  } else {
    decision = 'ESTABLE';
    recomendacion = 'Operación estable. Mantener rodillo estándar y gestión manual del flujo.';
  }

  const estadoFinal = crearSnapshot(estado, maquinas);

  return {
    configuracion: {
      iman: iman.nombre,
      tasaLlegadaMediaMin: TASA_LLEGADA_MEDIA,
      distribucionLlegada: 'Exponencial',
      pesoLoteMediaKg: 500,
      pesoLoteDesvioKg: 50,
      distribucionPeso: 'Normal',
      jornadaMinutos: JORNADA_MINUTOS,
      capacidadTolvaKg: CAPACIDAD_TOLVA_KG,
      tasaReproceso: TASA_REPROCESO,
      clasificacion: 'Binomial encadenada (60% destrucción / 30% refurbish / 10% reproceso)',
    },
    logEventos: estado.logEventos,
    serieWip: estado.serieWip,
    porLote: estado.porLote,
    porSeparacion: estado.porSeparacion,
    estadoFinal,
    reporte: {
      lotesTotales,
      pctHDD: Math.round(pctHDD),
      pctSSD: Math.round(pctSSD),
      wipPromedio: Math.round(wipPromedio * 100) / 100,
      wipFinal: Math.round(wipFinal * 100) / 100,
      wipMaximo: Math.round(estado.wipMax * 100) / 100,
      tasaReprocesoPct: Math.round(tasaReprocesoPct * 100) / 100,
      minutosReproceso,
      pctTiempoReproceso,
      kgProcesados: Math.round(estado.porLote.reduce((s, l) => s + l.pesoKg, 0) * 100) / 100,
      kgReproceso: Math.round(estado.kgReproceso * 100) / 100,
      semaforoFinal: evaluarSemaforo(wipFinal),
      requiereUpgrade,
      decision,
      recomendacion,
      decisionTexto: requiereUpgrade
        ? 'WIP PROMEDIO >= 2000 kg — ESTADO CRÍTICO. Se recomienda actualización tecnológica.'
        : 'WIP promedio dentro de límites — operación estable.',
    },
  };
}

module.exports = { ejecutarSimulacion, JORNADA_MINUTOS, CAPACIDAD_TOLVA_KG };
