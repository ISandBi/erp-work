const { test, beforeEach } = require("node:test");
const assert = require("node:assert");
const { reiniciarEstado } = require("../src/store");
const proyectos = require("../src/modulos/proyectos/proyectos");

beforeEach(() => reiniciarEstado());

test("un proyecto válido se crea en planeación", () => {
  const p = proyectos.crearProyecto({
    nombre: "Portal de clientes",
    clienteId: 1,
    responsableId: 2,
    inicio: "2026-12-01",
    fechaCompromiso: "2027-02-01",
  });
  assert.strictEqual(p.estado, "planeacion");
});

test("la fecha compromiso no puede ser anterior al inicio", () => {
  assert.throws(() =>
    proyectos.crearProyecto({
      nombre: "X",
      clienteId: 1,
      responsableId: 2,
      inicio: "2026-12-01",
      fechaCompromiso: "2026-11-01",
    })
  );
});

test("un avance dentro de rango se registra y cambia el avance del proyecto", () => {
  const p = proyectos.registrarAvance(1, { porcentaje: 40, autorId: 2 });
  assert.strictEqual(p.avance, 40);
});

// Criterio de aceptación de INC-001
test("un avance mayor a 100 se rechaza", () => {
  assert.throws(() => proyectos.registrarAvance(1, { porcentaje: 150, autorId: 2 }));
});
