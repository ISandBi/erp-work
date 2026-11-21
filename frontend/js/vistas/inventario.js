import { api } from "../api.js";
import { escapar, mostrarError, opcionesProductos } from "../ui.js";

export async function renderInventario(contenedor) {
  const productos = await api("GET", "/productos");
  contenedor.innerHTML = `
    <h2>Inventario</h2>
    <table>
      <thead><tr><th>SKU</th><th>Nombre</th><th>Existencias</th></tr></thead>
      <tbody>
        ${productos.map((p) => `
          <tr>
            <td>${escapar(p.sku)}</td>
            <td>${escapar(p.nombre)}</td>
            <td>${p.stock ?? "No aplica"}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <h3>Registrar entrada</h3>
    <form id="entrada">
      <select name="productoId">${opcionesProductos(productos)}</select>
      <input name="cantidad" type="number" placeholder="Cantidad" required>
      <button>Registrar</button>
    </form>
    <p id="mensaje"></p>`;

  contenedor.querySelector("#entrada").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    try {
      await api("POST", "/inventario/entrada", {
        productoId: Number(datos.productoId),
        cantidad: Number(datos.cantidad),
      });
      renderInventario(contenedor);
    } catch (err) {
      mostrarError(contenedor, err);
    }
  });
}
