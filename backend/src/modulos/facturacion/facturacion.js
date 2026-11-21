const { obtenerEstado, siguienteId } = require("../../store");
const { redondear } = require("../../util");

const IVA = 0.16;

// El IVA se calcula sobre el subtotal de la venta
function facturarVenta(ventaId) {
  const venta = obtenerEstado().ventas.find((v) => v.id === ventaId);
  if (!venta) throw new Error(`La venta ${ventaId} no existe`);
  const iva = redondear(venta.subtotal * IVA);
  const factura = {
    id: siguienteId("factura"),
    ventaId,
    cliente: venta.cliente,
    fecha: new Date().toISOString(),
    subtotal: venta.subtotal,
    iva,
    total: redondear(venta.total + iva),
  };
  venta.facturada = true;
  obtenerEstado().facturas.push(factura);
  return factura;
}

function listarFacturas() {
  return obtenerEstado().facturas;
}

module.exports = { facturarVenta, listarFacturas };
