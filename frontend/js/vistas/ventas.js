import { api } from "../api.js";
import { escapar, montoMx, mostrarError, opcionesProductos } from "../ui.js";

export async function renderVentas(contenedor) {
  const [ventas, productos] = await Promise.all([api("GET", "/ventas"), api("GET", "/productos")]);
  const precios = new Map(productos.map((p) => [String(p.id), p.precio]));

  contenedor.innerHTML = `
    <h2>Ventas</h2>
    <table>
      <thead><tr><th>ID</th><th>Cliente</th><th>Subtotal</th><th>Descuento</th><th>Total</th><th>Facturada</th><th></th></tr></thead>
      <tbody>
        ${ventas.map((v) => `
          <tr>
            <td>${v.id}</td>
            <td>${escapar(v.cliente)}</td>
            <td>${montoMx(v.subtotal)}</td>
            <td>${montoMx(v.descuento)}</td>
            <td>${montoMx(v.total)}</td>
            <td>${v.facturada ? "Sí" : "No"}</td>
            <td>${v.facturada ? "" : `<button data-facturar="${v.id}">Facturar</button>`}</td>
          </tr>`).join("")}
      </tbody>
    </table>
    <h3>Nueva venta</h3>
    <form id="venta">
      <input name="cliente" placeholder="Cliente" required>
      <input name="descuentoPct" type="number" value="0" min="0" max="100" placeholder="Descuento %">
      <div id="lineas" style="width:100%"></div>
      <button type="button" id="agregar">Agregar línea</button>
      <p style="width:100%">Total estimado: <strong id="estimado">${montoMx(0)}</strong></p>
      <button>Registrar venta</button>
    </form>
    <p id="mensaje"></p>`;

  const lineas = contenedor.querySelector("#lineas");
  const agregarLinea = () => {
    const fila = document.createElement("div");
    fila.innerHTML = `
      <select name="productoId">${opcionesProductos(productos)}</select>
      <input name="cantidad" type="number" min="1" placeholder="Cantidad">`;
    lineas.appendChild(fila);
  };
  agregarLinea();
  contenedor.querySelector("#agregar").addEventListener("click", agregarLinea);

  // Total estimado en pantalla, calculado con el precio de lista de cada línea
  const recalcular = () => {
    let subtotal = 0;
    [...lineas.children].forEach((fila) => {
      const id = fila.querySelector('[name="productoId"]').value;
      const cantidad = Number(fila.querySelector('[name="cantidad"]').value) || 0;
      subtotal += (precios.get(id) ?? 0) * cantidad;
    });
    contenedor.querySelector("#estimado").textContent = montoMx(subtotal);
  };
  contenedor.querySelector("#venta").addEventListener("input", recalcular);

  contenedor.querySelector("#venta").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = [...lineas.children].map((fila) => ({
      productoId: Number(fila.querySelector('[name="productoId"]').value),
      cantidad: Number(fila.querySelector('[name="cantidad"]').value),
    }));
    try {
      await api("POST", "/ventas", {
        cliente: e.target.cliente.value,
        descuentoPct: Number(e.target.descuentoPct.value),
        lineas: datos,
      });
      renderVentas(contenedor);
    } catch (err) {
      mostrarError(contenedor, err);
    }
  });

  contenedor.querySelectorAll("[data-facturar]").forEach((boton) => {
    boton.addEventListener("click", async () => {
      try {
        await api("POST", `/ventas/${boton.dataset.facturar}/facturar`);
        renderVentas(contenedor);
      } catch (err) {
        mostrarError(contenedor, err);
      }
    });
  });
}
