const { response } = require('express');
const Simulacion = require('../models/Simulacion');
const { ejecutarSimulacion } = require('../helpers/simulador');

const runSimulacion = async (req, res = response) => {
  try {
    const resultado = ejecutarSimulacion({ seed: req.body?.seed });

    if (process.env.DB_CNN) {
      try {
        await Simulacion.create({
          parametros: resultado.configuracion,
          totales: resultado.reporte,
          porDia: [],
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

module.exports = { runSimulacion };
