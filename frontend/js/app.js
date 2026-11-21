import { renderResumen } from "./vistas/resumen.js";
import { renderCatalogo } from "./vistas/catalogo.js";
import { renderInventario } from "./vistas/inventario.js";
import { renderCompras } from "./vistas/compras.js";
import { renderVentas } from "./vistas/ventas.js";
import { renderFacturas } from "./vistas/facturas.js";

const rutas = {
  resumen: renderResumen,
  catalogo: renderCatalogo,
  inventario: renderInventario,
  compras: renderCompras,
  ventas: renderVentas,
  facturas: renderFacturas,
};

async function navegar() {
  const nombre = location.hash.replace("#/", "") || "resumen";
  const vista = rutas[nombre] ?? rutas.resumen;
  document.querySelectorAll("nav a").forEach((a) => {
    a.classList.toggle("activa", a.getAttribute("href") === `#/${nombre}`);
  });
  const contenedor = document.getElementById("app");
  try {
    await vista(contenedor);
  } catch (err) {
    contenedor.textContent = `No se pudo cargar la vista: ${err.message}`;
  }
}

window.addEventListener("hashchange", navegar);
navegar();
