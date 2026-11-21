const { obtenerEstado, siguienteId } = require("../../store");

// Áreas de la consultoría a las que se asignan las personas
const AREAS = ["Dirección general", "Dirección de proyectos", "Ventas", "Desarrollo", "QA", "Testing", "UI/UX"];

function listarAreas() {
  return AREAS;
}

function listarPersonas() {
  return obtenerEstado().personas;
}

function obtenerPersona(id) {
  const persona = obtenerEstado().personas.find((p) => p.id === id);
  if (!persona) throw new Error(`La persona ${id} no existe`);
  return persona;
}

function crearPersona({ nombre, rol = "", area }) {
  if (!nombre) throw new Error("El nombre es obligatorio");
  if (!AREAS.includes(area)) throw new Error(`Área no válida: ${area}`);
  const persona = { id: siguienteId("persona"), nombre, rol, area };
  obtenerEstado().personas.push(persona);
  return persona;
}

function listarClientes() {
  return obtenerEstado().clientes;
}

function obtenerCliente(id) {
  const cliente = obtenerEstado().clientes.find((c) => c.id === id);
  if (!cliente) throw new Error(`El cliente ${id} no existe`);
  return cliente;
}

function crearCliente({ nombre, contacto = "" }) {
  if (!nombre) throw new Error("El nombre del cliente es obligatorio");
  const cliente = { id: siguienteId("cliente"), nombre, contacto };
  obtenerEstado().clientes.push(cliente);
  return cliente;
}

module.exports = {
  listarAreas,
  listarPersonas,
  obtenerPersona,
  crearPersona,
  listarClientes,
  obtenerCliente,
  crearCliente,
};
