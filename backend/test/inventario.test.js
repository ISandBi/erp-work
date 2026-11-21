const test = require("node:test");
const assert = require("node:assert");
const inventario = require("../src/modulos/inventario/inventario");

test.beforeEach(() => inventario.reiniciarStock());

test("registrar una entrada válida aumenta el stock", () => {
  inventario.registrarEntrada({ productoId: 1, cantidad: 5 });
  assert.strictEqual(inventario.obtenerStock(1), 5);
});

// Prueba de aceptación de INC-001 (falla a propósito hasta corregir el bug)
test("una entrada con cantidad negativa se rechaza", () => {
  assert.throws(() => inventario.registrarEntrada({ productoId: 1, cantidad: -5 }));
});
