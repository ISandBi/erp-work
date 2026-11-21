const { obtenerEstado, siguienteId } = require("../../store");

// Áreas a las que TI reporta incidencias
const AREAS = ["QA", "Testing", "UI/UX", "Desarrollo"];
const TIPOS = ["bug", "mejora", "tarea"];
const PRIORIDADES = ["baja", "media", "alta", "critica"];
const ESTADOS = ["abierto", "en_proceso", "resuelto", "cerrado"];

function registrarMovimiento(ticket, estado, comentario) {
  ticket.historial.push({ fecha: new Date().toISOString(), estado, comentario });
}

function listarTickets({ area, estado } = {}) {
  return obtenerEstado().tickets.filter(
    (t) => (!area || t.area === area) && (!estado || t.estado === estado)
  );
}

function crearTicket({ titulo, descripcion = "", tipo = "bug", prioridad = "media", area, reportadoPor }) {
  if (!titulo) throw new Error("El título es obligatorio");
  if (!AREAS.includes(area)) throw new Error(`Área no válida: ${area}`);
  if (!TIPOS.includes(tipo)) throw new Error(`Tipo no válido: ${tipo}`);
  if (!PRIORIDADES.includes(prioridad)) throw new Error(`Prioridad no válida: ${prioridad}`);
  const ticket = {
    id: siguienteId("ticket"),
    titulo,
    descripcion,
    tipo,
    prioridad,
    area,
    reportadoPor: reportadoPor || "Anónimo",
    estado: "abierto",
    creado: new Date().toISOString(),
    historial: [],
  };
  registrarMovimiento(ticket, "abierto", "Ticket creado");
  obtenerEstado().tickets.push(ticket);
  return ticket;
}

// El historial conserva cada cambio de estado con su comentario
function cambiarEstado(id, estado, comentario = "") {
  if (!ESTADOS.includes(estado)) throw new Error(`Estado no válido: ${estado}`);
  const ticket = obtenerEstado().tickets.find((t) => t.id === id);
  if (!ticket) throw new Error(`El ticket ${id} no existe`);
  ticket.estado = estado;
  registrarMovimiento(ticket, estado, comentario);
  return ticket;
}

function resumenPorArea() {
  const tickets = obtenerEstado().tickets;
  return AREAS.map((area) => ({
    area,
    abiertos: tickets.filter((t) => t.area === area && t.estado !== "cerrado").length,
  }));
}

module.exports = { AREAS, listarTickets, crearTicket, cambiarEstado, resumenPorArea };
