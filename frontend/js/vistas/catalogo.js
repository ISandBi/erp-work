import { api } from "../api.js";
import { escapar, montoMx, mostrarError } from "../ui.js";

export async function renderCatalogo(contenedor, termino = "") {
  const productos = await api("GET", `/productos?q=${termino}`);
  contenedor.innerHTML = `
    <h2>Catálogo</h2>
    <input id="buscar" placeholder="Buscar por nombre o SKU" value="${escapar(termino)}">
    <table>
      <thead><tr><th>SKU</th><th>Nombre</th><th>Tipo</th><th>Precio</th></tr></thead>
      <tbody>
        ${productos.map((p) => `
          <tr>
            <td>${escapar(p.sku)}</td>
            <td>${escapar(p.nombre)}</td>
            <td>${escapar(p.tipo)}</td>
            <td>${montoMx(p.precio)}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <h3>Nuevo producto</h3>
    <form id="nuevo">
      <input name="sku" placeholder="SKU" required>
      <input name="nombre" placeholder="Nombre" required>
      <select name="tipo">
        <option value="producto">Producto</option>
        <option value="licencia">Licencia</option>
        <option value="hardware">Hardware</option>
        <option value="servicio">Servicio</option>
      </select>
      <input name="precio" type="number" step="0.01" placeholder="Precio" required>
      <input name="stock" type="number" placeholder="Stock inicial">
      <button>Guardar</button>
    </form>
    <p id="mensaje"></p>`;

  contenedor.querySelector("#buscar").addEventListener("change", (e) => {
    renderCatalogo(contenedor, e.target.value);
  });

  contenedor.querySelector("#nuevo").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    try {
      await api("POST", "/productos", datos);
      renderCatalogo(contenedor, termino);
    } catch (err) {
      mostrarError(contenedor, err);
    }
  });
}
