/** TA = -media * ln(U) — arribos exponenciales */
const exponencial = (media, rng) => {
  const u = Math.max(rng(), 1e-10);
  return -media * Math.log(u);
};

/** Normal(media, desvio) — Box-Muller */
const normal = (media, desvio, rng) => {
  const u1 = Math.max(rng(), 1e-10);
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return media + desvio * z;
};

/** Uniforme [min, max] */
const uniforme = (min, max, rng) => min + (max - min) * rng();

/** Empírica discreta (o Bernoulli / Multinomial) */
const empiricaDiscreta = (opciones, rng) => {
  const u = rng();
  let acum = 0;
  for (const op of opciones) {
    acum += op.prob;
    if (u <= acum) return op.valor;
  }
  return opciones[opciones.length - 1].valor;
};

module.exports = { exponencial, normal, uniforme, empiricaDiscreta };