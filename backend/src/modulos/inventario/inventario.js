// Módulo de inventario (primer ciclo).
// Estado en memoria mientras no exista base de datos.

const stock = new Map();

function obtenerStock(productoId) {
  return stock.get(productoId) ?? 0;
}

function registrarEntrada({ productoId, cantidad }) {
  // TODO: validar cantidad (ver docs/incidencias/INC-001)
  stock.set(productoId, obtenerStock(productoId) + cantidad);
  return obtenerStock(productoId);
}

function reiniciarStock() {
  stock.clear();
}

module.exports = { obtenerStock, registrarEntrada, reiniciarStock };
