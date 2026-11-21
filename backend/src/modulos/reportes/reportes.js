const { obtenerEstado } = require("../../store");
const { redondear } = require("../../util");

function resumen() {
  const estado = obtenerEstado();
  const ventasTotal = estado.ventas.reduce((acc, v) => acc + v.total, 0);
  const stockBajo = estado.productos
    .filter((p) => p.tipo !== "servicio" && p.stock < 5)
    .map((p) => p.sku);
  return {
    ventasTotal: redondear(ventasTotal),
    ventasNumero: estado.ventas.length,
    facturas: estado.facturas.length,
    ordenesPendientes: estado.ordenesCompra.filter((o) => o.estado === "pendiente").length,
    stockBajo,
  };
}

module.exports = { resumen };
