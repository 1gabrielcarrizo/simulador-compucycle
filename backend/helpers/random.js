/** Generador congruencial mixto — U(0,1) */
function crearGenerador(seed, a = 17, c = 43, m = 1000) {
  let xn = seed;
  return () => {
    xn = (a * xn + c) % m;
    return xn / m;
  };
}

function crearRng(seed) {
  const s = seed != null ? Number(seed) : Date.now();
  return crearGenerador(s);
}

module.exports = { crearGenerador, crearRng };
