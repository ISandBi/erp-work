const { obtenerEstado, siguienteId } = require("../../store");
const catalogo = require("../catalogo/catalogo");
const inventario = require("../inventario/inventario");

function crearOrden({ proveedor, lineas }) {
  if (!proveedor || !Array.isArray(lineas) || lineas.length === 0) {
    throw new Error("La orden necesita proveedor y al menos una línea");
  }
  const lineasOrden = lineas.map((linea) => {
    catalogo.obtenerProducto(linea.productoId);
    return {
      productoId: linea.productoId,
      cantidad: Number(linea.cantidad),
      costoUnitario: Number(linea.costoUnitario),
    };
  });
  const orden = {
    id: siguienteId("orden"),
    proveedor,
    estado: "pendiente",
    lineas: lineasOrden,
    creada: new Date().toISOString(),
  };
  obtenerEstado().ordenesCompra.push(orden);
  return orden;
}

// Al recibir la orden, cada línea entra al inventario
function recibirOrden(id) {
  const orden = obtenerEstado().ordenesCompra.find((o) => o.id === id);
  if (!orden) throw new Error(`La orden ${id} no existe`);
  for (const linea of orden.lineas) {
    inventario.registrarEntrada({ productoId: linea.productoId, cantidad: linea.cantidad });
  }
  orden.estado = "recibida";
  return orden;
}

module.exports = { crearOrden, recibirOrden };
