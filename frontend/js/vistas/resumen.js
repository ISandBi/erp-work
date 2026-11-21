import { api } from "../api.js";
import { montoMx } from "../ui.js";

export async function renderResumen(contenedor) {
  const r = await api("GET", "/resumen");
  contenedor.innerHTML = `
    <h2>Resumen</h2>
    <section class="tarjetas">
      <div class="tarjeta"><span>Ventas acumuladas</span><strong>${montoMx(r.ventasTotal)}</strong></div>
      <div class="tarjeta"><span>Número de ventas</span><strong>${r.ventasNumero}</strong></div>
      <div class="tarjeta"><span>Facturas emitidas</span><strong>${r.facturas}</strong></div>
      <div class="tarjeta"><span>Órdenes pendientes</span><strong>${r.ordenesPendientes}</strong></div>
    </section>
    <h3>Stock bajo</h3>
    <p>${r.stockBajo.length ? r.stockBajo.join(", ") : "Sin alertas"}</p>`;
}
