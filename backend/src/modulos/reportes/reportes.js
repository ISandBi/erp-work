const { obtenerEstado } = require("../../store");
const proyectos = require("../proyectos/proyectos");

function resumen() {
  const lista = proyectos.listarProyectos();
  const activos = lista.filter((p) => p.estado === "planeacion" || p.estado === "en_curso");
  const avancePromedio = activos.length
    ? Math.round(activos.reduce((acc, p) => acc + p.avance, 0) / activos.length)
    : 0;
  return {
    proyectosTotal: lista.length,
    proyectosActivos: activos.length,
    enRiesgo: lista.filter((p) => p.salud === "en riesgo").map((p) => p.nombre),
    avancePromedio,
    ticketsAbiertos: obtenerEstado().tickets.filter((t) => t.estado !== "cerrado" && t.estado !== "resuelto").length,
  };
}

module.exports = { resumen };
