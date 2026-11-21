const { obtenerEstado, siguienteId } = require("../../store");

// Búsqueda simple: coincide con el nombre o con el SKU
function listarProductos(termino) {
  const productos = obtenerEstado().productos;
  if (!termino) return productos;
  return productos.filter((p) => p.nombre.includes(termino) || p.sku.includes(termino));
}

function obtenerProducto(id) {
  const producto = obtenerEstado().productos.find((p) => p.id === id);
  if (!producto) throw new Error(`El producto ${id} no existe`);
  return producto;
}

function crearProducto({ sku, nombre, tipo = "producto", precio, stock = 0 }) {
  if (!sku || !nombre) throw new Error("SKU y nombre son obligatorios");
  const estado = obtenerEstado();
  if (estado.productos.some((p) => p.sku === sku)) {
    throw new Error(`Ya existe un producto con SKU ${sku}`);
  }
  const producto = {
    id: siguienteId("producto"),
    sku,
    nombre,
    tipo,
    precio: Number(precio),
    // Los servicios no llevan existencias
    stock: tipo === "servicio" ? null : Number(stock),
  };
  estado.productos.push(producto);
  return producto;
}

module.exports = { listarProductos, obtenerProducto, crearProducto };
