// Redondea a centavos
function redondear(n) {
  return Math.round(n * 100) / 100;
}

module.exports = { redondear };
