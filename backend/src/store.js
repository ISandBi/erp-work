// Almacén en memoria. Todo se pierde al reiniciar el servidor.

function crearEstadoInicial() {
  return {
    productos: [
      { id: 1, sku: "SRV-HORA", nombre: "Consultoría por hora", tipo: "servicio", precio: 800, stock: null },
      { id: 2, sku: "LIC-DEV", nombre: "Licencia Dev Suite anual", tipo: "licencia", precio: 1500, stock: 10 },
      { id: 3, sku: "HW-TEST", nombre: "Servidor de pruebas", tipo: "hardware", precio: 25000, stock: 3 },
      { id: 4, sku: "LIC-QA", nombre: "Suite de QA", tipo: "licencia", precio: 900, stock: 0 },
    ],
    ordenesCompra: [],
    ventas: [],
    facturas: [],
    tickets: [],
    secuencias: { producto: 4, orden: 0, venta: 0, factura: 0, ticket: 0 },
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
