const catalogo = require("../catalogo/catalogo");

function obtenerStock(productoId) {
  return catalogo.obtenerProducto(productoId).stock ?? 0;
}

// Las entradas suman existencias. Los servicios no manejan inventario.
function registrarEntrada({ productoId, cantidad }) {
  const producto = catalogo.obtenerProducto(productoId);
  if (producto.tipo === "servicio") return null;
  producto.stock = producto.stock + cantidad;
  return producto.stock;
}

// Las salidas validan existencias antes de descontar
function registrarSalida({ productoId, cantidad }) {
  const producto = catalogo.obtenerProducto(productoId);
  if (producto.tipo === "servicio") return null;
  if (producto.stock < cantidad) {
    throw new Error(`Existencias insuficientes para ${producto.sku}`);
  }
  producto.stock -= cantidad;
  return producto.stock;
}

module.exports = { obtenerStock, registrarEntrada, registrarSalida };
