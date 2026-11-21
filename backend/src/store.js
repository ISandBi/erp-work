// Almacén en memoria. Todo se pierde al reiniciar el servidor.

function crearEstadoInicial() {
  return {
    personas: [
      { id: 1, nombre: "Ana López", rol: "Director general", area: "Dirección general" },
      { id: 2, nombre: "Luis Ortega", rol: "Director de proyectos", area: "Dirección de proyectos" },
      { id: 3, nombre: "Marta Ruiz", rol: "Ejecutiva de ventas", area: "Ventas" },
      { id: 4, nombre: "Jorge Méndez", rol: "Líder de QA", area: "QA" },
      { id: 5, nombre: "Sofía Vera", rol: "Diseñadora UI/UX", area: "UI/UX" },
      { id: 6, nombre: "Diego Ramos", rol: "Desarrollador", area: "Desarrollo" },
    ],
    clientes: [{ id: 1, nombre: "Cliente demo", contacto: "contacto@ejemplo.com" }],
    proyectos: [
      {
        id: 1,
        nombre: "Proyecto de ejemplo",
        clienteId: 1,
        responsableId: 2,
        equipo: [4, 5, 6],
        estado: "en_curso",
        inicio: "2026-11-01",
        fechaCompromiso: "2026-12-15",
        presupuesto: 500000,
        creado: "2026-11-01T00:00:00.000Z",
        avances: [
          { id: 1, fecha: "2026-11-10T00:00:00.000Z", porcentaje: 20, nota: "Levantamiento de requisitos", autorId: 2 },
        ],
        entregables: [{ id: 1, nombre: "Prototipo", fechaLimite: "2026-11-30", estado: "en_proceso" }],
        documentos: [],
      },
    ],
    tickets: [],
    secuencias: { persona: 6, cliente: 1, proyecto: 1, avance: 1, entregable: 1, documento: 0, ticket: 0 },
  };
}

let estado = crearEstadoInicial();

function obtenerEstado() {
  return estado;
}

function siguienteId(nombre) {
  estado.secuencias[nombre] += 1;
  return estado.secuencias[nombre];
}

function reiniciarEstado() {
  estado = crearEstadoInicial();
}

module.exports = { obtenerEstado, siguienteId, reiniciarEstado };
