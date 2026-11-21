import { api } from "../api.js";
import { escapar, mostrarError, opcionesProductos } from "../ui.js";

export async function renderCompras(contenedor) {
  const [ordenes, productos] = await Promise.all([api("GET", "/compras"), api("GET", "/productos")]);
  contenedor.innerHTML = `
    <h2>Órdenes de compra</h2>
    <table>
      <thead><tr><th>ID</th><th>Proveedor</th><th>Líneas</th><th>Estado</th><th></th></tr></thead>
      <tbody>
        ${ordenes.map((o) => `
          <tr>
            <td>${o.id}</td>
            <td>${escapar(o.proveedor)}</td>
            <td>${o.lineas.length}</td>
            <td>${o.estado}</td>
            <td>${o.estado === "pendiente" ? `<button data-recibir="${o.id}">Recibir</button>` : ""}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <h3>Nueva orden</h3>
    <form id="orden">
      <input name="proveedor" placeholder="Proveedor" required>
      <div id="lineas" style="width:100%"></div>
      <button type="button" id="agregar">Agregar línea</button>
      <button>Crear orden</button>
    </form>
    <p id="mensaje"></p>`;

  const lineas = contenedor.querySelector("#lineas");
  const agregarLinea = () => {
    const fila = document.createElement("div");
    fila.innerHTML = `
      <select name="productoId">${opcionesProductos(productos)}</select>
      <input name="cantidad" type="number" placeholder="Cantidad">
      <input name="costoUnitario" type="number" step="0.01" placeholder="Costo unitario">`;
    lineas.appendChild(fila);
  };
  agregarLinea();
  contenedor.querySelector("#agregar").addEventListener("click", agregarLinea);

  contenedor.querySelector("#orden").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = [...lineas.children].map((fila) => ({
      productoId: Number(fila.querySelector('[name="productoId"]').value),
      cantidad: Number(fila.querySelector('[name="cantidad"]').value),
      costoUnitario: Number(fila.querySelector('[name="costoUnitario"]').value),
    }));
    try {
      await api("POST", "/compras", { proveedor: e.target.proveedor.value, lineas: datos });
      renderCompras(contenedor);
    } catch (err) {
      mostrarError(contenedor, err);
    }
  });

  contenedor.querySelectorAll("[data-recibir]").forEach((boton) => {
    boton.addEventListener("click", async () => {
      try {
        await api("POST", `/compras/${boton.dataset.recibir}/recibir`);
        renderCompras(contenedor);
      } catch (err) {
        mostrarError(contenedor, err);
      }
    });
  });
}
