const { test, beforeEach } = require("node:test");
const assert = require("node:assert");
const { reiniciarEstado } = require("../src/store");
const tickets = require("../src/modulos/tickets/tickets");

beforeEach(() => reiniciarEstado());

test("un ticket válido se crea abierto y con su primer registro en el historial", () => {
  const t = tickets.crearTicket({ titulo: "El botón no responde", area: "UI/UX" });
  assert.strictEqual(t.estado, "abierto");
  assert.strictEqual(t.historial.length, 1);
});

test("no se acepta un área fuera del catálogo", () => {
  assert.throws(() => tickets.crearTicket({ titulo: "Algo", area: "Ventas" }));
});

test("cambiar el estado agrega un registro al historial", () => {
  const t = tickets.crearTicket({ titulo: "Algo", area: "QA" });
  tickets.cambiarEstado(t.id, "en_proceso", "Tomado por el equipo");
  assert.strictEqual(t.estado, "en_proceso");
  assert.strictEqual(t.historial.length, 2);
});
