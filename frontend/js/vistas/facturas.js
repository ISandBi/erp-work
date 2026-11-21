import { api } from "../api.js";
import { escapar, montoMx } from "../ui.js";

export async function renderFacturas(contenedor) {
  const facturas = await api("GET", "/facturas");
  contenedor.innerHTML = `
    <h2>Facturas</h2>
    <table>
      <thead><tr><th>Folio</th><th>Venta</th><th>Cliente</th><th>Subtotal</th><th>IVA</th><th>Total</th></tr></thead>
      <tbody>
        ${facturas.map((f) => `
          <tr>
            <td>${f.id}</td>
            <td>${f.ventaId}</td>
            <td>${escapar(f.cliente)}</td>
            <td>${montoMx(f.subtotal)}</td>
            <td>${montoMx(f.iva)}</td>
            <td>${montoMx(f.total)}</td>
          </tr>`).join("") || `<tr><td colspan="6">Sin facturas todavía</td></tr>`}
      </tbody>
    </table>`;
}
