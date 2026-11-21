const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const organizacion = require("./modulos/organizacion/organizacion");
const proyectos = require("./modulos/proyectos/proyectos");
const tickets = require("./modulos/tickets/tickets");
const reportes = require("./modulos/reportes/reportes");

const RAIZ_FRONTEND = path.join(__dirname, "..", "..", "frontend", "dist");
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

const rutas = [
  { metodo: "GET", patron: /^\/api\/resumen$/, manejar: () => reportes.resumen() },
  { metodo: "GET", patron: /^\/api\/areas$/, manejar: () => organizacion.listarAreas() },
  { metodo: "GET", patron: /^\/api\/personas$/, manejar: () => organizacion.listarPersonas() },
  { metodo: "POST", patron: /^\/api\/personas$/, manejar: (_m, _url, cuerpo) => organizacion.crearPersona(cuerpo) },
  { metodo: "GET", patron: /^\/api\/clientes$/, manejar: () => organizacion.listarClientes() },
  { metodo: "POST", patron: /^\/api\/clientes$/, manejar: (_m, _url, cuerpo) => organizacion.crearCliente(cuerpo) },
  { metodo: "GET", patron: /^\/api\/proyectos$/, manejar: (_m, url) => proyectos.listarProyectos({ estado: url.searchParams.get("estado") ?? undefined }) },
  { metodo: "POST", patron: /^\/api\/proyectos$/, manejar: (_m, _url, cuerpo) => proyectos.crearProyecto(cuerpo) },
  { metodo: "GET", patron: /^\/api\/proyectos\/(\d+)$/, manejar: (m) => proyectos.obtenerProyecto(Number(m[1])) },
  { metodo: "POST", patron: /^\/api\/proyectos\/(\d+)\/estado$/, manejar: (m, _url, cuerpo) => proyectos.cambiarEstado(Number(m[1]), cuerpo.estado) },
  { metodo: "POST", patron: /^\/api\/proyectos\/(\d+)\/avances$/, manejar: (m, _url, cuerpo) => proyectos.registrarAvance(Number(m[1]), cuerpo) },
  { metodo: "POST", patron: /^\/api\/proyectos\/(\d+)\/entregables$/, manejar: (m, _url, cuerpo) => proyectos.agregarEntregable(Number(m[1]), cuerpo) },
  { metodo: "POST", patron: /^\/api\/proyectos\/(\d+)\/entregables\/(\d+)\/estado$/, manejar: (m, _url, cuerpo) => proyectos.cambiarEstadoEntregable(Number(m[1]), Number(m[2]), cuerpo.estado) },
  { metodo: "POST", patron: /^\/api\/proyectos\/(\d+)\/documentos$/, manejar: (m, _url, cuerpo) => proyectos.agregarDocumento(Number(m[1]), cuerpo) },
  { metodo: "GET", patron: /^\/api\/tickets$/, manejar: (_m, url) => tickets.listarTickets({ area: url.searchParams.get("area") ?? undefined, estado: url.searchParams.get("estado") ?? undefined }) },
  { metodo: "POST", patron: /^\/api\/tickets$/, manejar: (_m, _url, cuerpo) => tickets.crearTicket(cuerpo) },
  { metodo: "GET", patron: /^\/api\/tickets\/resumen$/, manejar: () => tickets.resumenPorArea() },
  { metodo: "POST", patron: /^\/api\/tickets\/(\d+)\/estado$/, manejar: (m, _url, cuerpo) => tickets.cambiarEstado(Number(m[1]), cuerpo.estado, cuerpo.comentario) },
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
      return res.end("No encontrado. Falta compilar el frontend: ejecuta npm run build en frontend");
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
