const { obtenerEstado, siguienteId } = require("../../store");
const { redondear } = require("../../util");
const catalogo = require("../catalogo/catalogo");
const inventario = require("../inventario/inventario");

function crearVenta({ cliente, lineas, descuentoPct = 0 }) {
  if (!cliente || !Array.isArray(lineas) || lineas.length === 0) {
    throw new Error("La venta necesita cliente y al menos una línea");
  }
  let subtotal = 0;
  const detalle = lineas.map((linea) => {
    const producto = catalogo.obtenerProducto(linea.productoId);
    const cantidad = Number(linea.cantidad);
    // Cada línea descuenta existencias en cuanto se procesa
    inventario.registrarSalida({ productoId: producto.id, cantidad });
    const importe = producto.precio * cantidad;
    subtotal += importe;
    return {
      productoId: producto.id,
      sku: producto.sku,
      nombre: producto.nombre,
      cantidad,
      precioUnitario: producto.precio,
      importe,
    };
  });
  // El descuento se aplica sobre el subtotal
  const descuento = redondear(subtotal * (Number(descuentoPct) / 100));
  const venta = {
    id: siguienteId("venta"),
    cliente,
    fecha: new Date().toISOString(),
    lineas: detalle,
    subtotal: redondear(subtotal),
    descuentoPct: Number(descuentoPct),
    descuento,
    total: redondear(subtotal - descuento),
    facturada: false,
  };
  obtenerEstado().ventas.push(venta);
  return venta;
}

module.exports = { crearVenta };
