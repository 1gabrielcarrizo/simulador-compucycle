/** TA = -media * ln(U) — Distribución Exponencial */
function exponencial(media, rng) {
  const u = Math.max(rng(), 1e-10);
  return -media * Math.log(u);
}

/** Normal(media, desvio) — Box-Muller */
function normal(media, desvio, rng) {
  const u1 = Math.max(rng(), 1e-10);
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return media + desvio * z;
}

/** Uniforme continua [min, max] */
function uniforme(min, max, rng) {
  return min + (max - min) * rng();
}

/**
 * Distribución Binomial B(n, p)
 * Cuenta éxitos en n ensayos de Bernoulli independientes.
 */
function binomial(n, p, rng) {
  const trials = Math.max(0, Math.floor(n));
  const prob = Math.min(1, Math.max(0, p));
  let exitos = 0;
  for (let i = 0; i < trials; i++) {
    if (rng() < prob) exitos += 1;
  }
  return exitos;
}

/** Bernoulli B(1, p) — caso particular de binomial */
function bernoulli(p, rng) {
  return binomial(1, p, rng);
}

module.exports = { exponencial, normal, uniforme, binomial, bernoulli };
