const { Schema, model } = require('mongoose');

const SimulacionSchema = new Schema(
  {
    parametros: { type: Schema.Types.Mixed, required: true },
    totales: { type: Schema.Types.Mixed, required: true },
    porDia: { type: [Schema.Types.Mixed], default: [] },
    serieWip: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

module.exports = model('Simulacion', SimulacionSchema);
