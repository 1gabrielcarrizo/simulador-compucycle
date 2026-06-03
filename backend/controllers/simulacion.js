const { response } = require('express');
const Simulacion = require('../models/Simulacion');
const { ejecutarSimulacion } = require('../helpers/simulador');
const { TIPOS_IMAN_VALIDOS } = require('../helpers/imanes');

const runSimulacion = async (req, res = response) => {
  try {
    const body = req.body;
    const tipoIman = body.tipoIman || 'estandar';

    if (!TIPOS_IMAN_VALIDOS.includes(tipoIman)) {
      return res.status(400).json({
        ok: false,
        msg: `tipoIman inválido. Valores: ${TIPOS_IMAN_VALIDOS.join(', ')}`,
      });
    }

    const parametros = {
      tasaLlegadaMin: body.tasaLlegadaMin,
      capacidadWipKg: body.capacidadWipKg,
      tipoIman,
      diasSimulacion: body.diasSimulacion,
      seed: body.seed,
    };

    const resultado = ejecutarSimulacion(parametros);

    if (body.guardar !== false && process.env.DB_CNN) {
      try {
        await Simulacion.create({
          parametros: resultado.parametros,
          totales: resultado.totales,
          porDia: resultado.porDia,
          serieWip: resultado.serieWip.slice(0, 500),
        });
      } catch (dbErr) {
        console.error('No se pudo guardar:', dbErr);
      }
    }

    return res.json({ ok: true, resultado });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al ejecutar la simulación' });
  }
};

const getHistorial = async (req, res = response) => {
  try {
    if (!process.env.DB_CNN) {
      return res.json({ ok: true, simulaciones: [] });
    }
    const simulaciones = await Simulacion.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('parametros totales porDia createdAt');
    return res.json({ ok: true, simulaciones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error al obtener historial' });
  }
};

module.exports = { runSimulacion, getHistorial };
