// Utilidades compartidas por las vistas

export function montoMx(n) {
  return `$${Number(n).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Escapa el texto antes de insertarlo en el HTML
export function escapar(texto) {
  return String(texto ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

export function opcionesProductos(productos) {
  return productos.map((p) => `<option value="${p.id}">${escapar(p.nombre)}</option>`).join("");
}

export function mostrarError(contenedor, err) {
  contenedor.querySelector("#mensaje").textContent = err.message;
}
