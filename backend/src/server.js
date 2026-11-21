const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const catalogo = require("./modulos/catalogo/catalogo");
const inventario = require("./modulos/inventario/inventario");
const compras = require("./modulos/compras/compras");
const ventas = require("./modulos/ventas/ventas");
const facturacion = require("./modulos/facturacion/facturacion");
const reportes = require("./modulos/reportes/reportes");
const { obtenerEstado } = require("./store");

const RAIZ_FRONTEND = path.join(__dirname, "..", "..", "frontend");
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

const rutas = [
  { metodo: "GET", patron: /^\/api\/resumen$/, manejar: () => reportes.resumen() },
  { metodo: "GET", patron: /^\/api\/productos$/, manejar: (_m, url) => catalogo.listarProductos(url.searchParams.get("q")) },
  { metodo: "POST", patron: /^\/api\/productos$/, manejar: (_m, _url, cuerpo) => catalogo.crearProducto(cuerpo) },
  { metodo: "GET", patron: /^\/api\/inventario\/(\d+)$/, manejar: (m) => ({ productoId: Number(m[1]), stock: inventario.obtenerStock(Number(m[1])) }) },
  { metodo: "POST", patron: /^\/api\/inventario\/entrada$/, manejar: (_m, _url, cuerpo) => inventario.registrarEntrada(cuerpo) },
  { metodo: "GET", patron: /^\/api\/compras$/, manejar: () => obtenerEstado().ordenesCompra },
  { metodo: "POST", patron: /^\/api\/compras$/, manejar: (_m, _url, cuerpo) => compras.crearOrden(cuerpo) },
  { metodo: "POST", patron: /^\/api\/compras\/(\d+)\/recibir$/, manejar: (m) => compras.recibirOrden(Number(m[1])) },
  { metodo: "GET", patron: /^\/api\/ventas$/, manejar: () => obtenerEstado().ventas },
  { metodo: "POST", patron: /^\/api\/ventas$/, manejar: (_m, _url, cuerpo) => ventas.crearVenta(cuerpo) },
  { metodo: "POST", patron: /^\/api\/ventas\/(\d+)\/facturar$/, manejar: (m) => facturacion.facturarVenta(Number(m[1])) },
  { metodo: "GET", patron: /^\/api\/facturas$/, manejar: () => facturacion.listarFacturas() },
];

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let datos = "";
    req.on("data", (trozo) => (datos += trozo));
    req.on("end", () => {
      try {
        resolve(datos ? JSON.parse(datos) : {});
      } catch {
        reject(new Error("El cuerpo de la petición no es JSON válido"));
      }
    });
  });
}

function enviar(res, status, cuerpo) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(cuerpo));
}

async function atenderApi(req, res, url) {
  let cuerpo;
  try {
    cuerpo = req.method === "POST" ? await leerCuerpo(req) : {};
  } catch (err) {
    return enviar(res, 400, { error: err.message });
  }
  for (const ruta of rutas) {
    const m = url.pathname.match(ruta.patron);
    if (ruta.metodo === req.method && m) {
      try {
        return enviar(res, 200, ruta.manejar(m, url, cuerpo));
      } catch (err) {
        // El detalle del error ayuda a depurar mientras se desarrolla
        return enviar(res, 400, { error: err.message, detalle: err.stack });
      }
    }
  }
  enviar(res, 404, { error: "Ruta no encontrada" });
}

function servirEstatico(url, res) {
  const ruta = url.pathname === "/" ? "/index.html" : url.pathname;
  // Se une la ruta pedida con la carpeta del frontend y se entrega el archivo
  const archivo = path.join(RAIZ_FRONTEND, ruta);
  fs.readFile(archivo, (err, contenido) => {
    if (err) {
      res.writeHead(404);
      return res.end("No encontrado");
    }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(archivo)] ?? "application/octet-stream" });
    res.end(contenido);
  });
}

const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname.startsWith("/api/")) return atenderApi(req, res, url);
  servirEstatico(url, res);
});

if (require.main === module) {
  const puerto = process.env.PORT ?? 3000;
  servidor.listen(puerto, () => console.log(`ERP disponible en http://localhost:${puerto}`));
}

module.exports = { servidor };
