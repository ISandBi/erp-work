const { obtenerEstado, siguienteId } = require("../../store");
const organizacion = require("../organizacion/organizacion");

const ESTADOS = ["planeacion", "en_curso", "en_pausa", "entregado", "cancelado"];
const ESTADOS_ENTREGABLE = ["pendiente", "en_proceso", "entregado"];

function avanceActual(proyecto) {
  const ultimo = proyecto.avances[proyecto.avances.length - 1];
  return ultimo ? ultimo.porcentaje : 0;
}

// Un proyecto está en riesgo si ya pasó su fecha compromiso y no está terminado
function salud(proyecto) {
  if (proyecto.estado === "entregado" || proyecto.estado === "cancelado") return "cerrado";
  const hoy = new Date().toISOString().slice(0, 10);
  if (proyecto.fechaCompromiso && proyecto.fechaCompromiso < hoy && avanceActual(proyecto) < 100) {
    return "en riesgo";
  }
  return "en tiempo";
}

function vista(proyecto) {
  return { ...proyecto, avance: avanceActual(proyecto), salud: salud(proyecto) };
}

function buscar(id) {
  const proyecto = obtenerEstado().proyectos.find((p) => p.id === id);
  if (!proyecto) throw new Error(`El proyecto ${id} no existe`);
  return proyecto;
}

function listarProyectos({ estado } = {}) {
  return obtenerEstado()
    .proyectos.filter((p) => !estado || p.estado === estado)
    .map(vista);
}

function obtenerProyecto(id) {
  return vista(buscar(id));
}

function crearProyecto({ nombre, clienteId, responsableId, equipo = [], inicio, fechaCompromiso, presupuesto = 0 }) {
  if (!nombre) throw new Error("El nombre del proyecto es obligatorio");
  organizacion.obtenerCliente(clienteId);
  organizacion.obtenerPersona(responsableId);
  equipo.forEach((id) => organizacion.obtenerPersona(id));
  if (inicio && fechaCompromiso && fechaCompromiso < inicio) {
    throw new Error("La fecha compromiso no puede ser anterior al inicio");
  }
  const proyecto = {
    id: siguienteId("proyecto"),
    nombre,
    clienteId,
    responsableId,
    equipo,
    estado: "planeacion",
    inicio: inicio ?? null,
    fechaCompromiso: fechaCompromiso ?? null,
    presupuesto: Number(presupuesto),
    creado: new Date().toISOString(),
    avances: [],
    entregables: [],
    documentos: [],
  };
  obtenerEstado().proyectos.push(proyecto);
  return vista(proyecto);
}

function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) throw new Error(`Estado no válido: ${estado}`);
  const proyecto = buscar(id);
  proyecto.estado = estado;
  return vista(proyecto);
}

// El avance se guarda tal como llega desde la API
function registrarAvance(id, { porcentaje, nota = "", autorId }) {
  const proyecto = buscar(id);
  organizacion.obtenerPersona(autorId);
  proyecto.avances.push({
    id: siguienteId("avance"),
    fecha: new Date().toISOString(),
    porcentaje: Number(porcentaje),
    nota,
    autorId,
  });
  if (proyecto.estado === "planeacion") proyecto.estado = "en_curso";
  return vista(proyecto);
}

function agregarEntregable(id, { nombre, fechaLimite }) {
  if (!nombre) throw new Error("El nombre del entregable es obligatorio");
  const proyecto = buscar(id);
  proyecto.entregables.push({
    id: siguienteId("entregable"),
    nombre,
    fechaLimite: fechaLimite ?? null,
    estado: "pendiente",
  });
  return vista(proyecto);
}

function cambiarEstadoEntregable(id, entregableId, estado) {
  if (!ESTADOS_ENTREGABLE.includes(estado)) throw new Error(`Estado no válido: ${estado}`);
  const proyecto = buscar(id);
  const entregable = proyecto.entregables.find((e) => e.id === entregableId);
  if (!entregable) throw new Error(`El entregable ${entregableId} no existe`);
  entregable.estado = estado;
  return vista(proyecto);
}

function agregarDocumento(id, { nombre, url }) {
  if (!nombre || !url) throw new Error("El documento necesita nombre y enlace");
  if (!/^https?:\/\//.test(url)) throw new Error("El enlace debe comenzar con http:// o https://");
  const proyecto = buscar(id);
  proyecto.documentos.push({
    id: siguienteId("documento"),
    nombre,
    url,
    subido: new Date().toISOString(),
  });
  return vista(proyecto);
}

module.exports = {
  ESTADOS,
  listarProyectos,
  obtenerProyecto,
  crearProyecto,
  cambiarEstado,
  registrarAvance,
  agregarEntregable,
  cambiarEstadoEntregable,
  agregarDocumento,
};
