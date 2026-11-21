const { test, beforeEach } = require("node:test");
const assert = require("node:assert");
const { reiniciarEstado } = require("../src/store");
const inventario = require("../src/modulos/inventario/inventario");

beforeEach(() => reiniciarEstado());

test("una entrada válida aumenta el stock", () => {
  inventario.registrarEntrada({ productoId: 2, cantidad: 5 });
  assert.strictEqual(inventario.obtenerStock(2), 15);
});

// Criterio de aceptación de INC-001
test("una entrada con cantidad negativa se rechaza", () => {
  assert.throws(() => inventario.registrarEntrada({ productoId: 2, cantidad: -5 }));
});
