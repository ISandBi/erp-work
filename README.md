# IS&BI

Plataforma interna de la consultoría de software IS&BI. Funciona como la organización misma:
personas, clientes, proyectos, avances, entregables, documentos y reportes de incidencias de TI.

## Estructura

- `backend/`: API en JavaScript (Node.js), sin dependencias externas. Memoria en lugar de base de datos.
- `frontend/`: interfaz en React con Vite (JSX, sin TypeScript). Ver `frontend/README.md`.
- `docs/`: guía para alumnos, decisiones de arquitectura (ADR) e incidencias.

## Módulos

- **Resumen:** proyectos activos, avance promedio, proyectos en riesgo y tickets abiertos.
- **Proyectos:** alta de proyectos, avances, entregables y enlaces a documentos o repositorios.
- **Organización:** personas por área y clientes.
- **Tickets TI:** incidencias dirigidas a QA, Testing, UI/UX y Desarrollo.

## Cómo correr las pruebas

```bash
cd backend
npm test
```

## Cómo correr la plataforma

```bash
cd frontend
npm install
npm run build
cd ../backend
npm start
```

Luego abre http://localhost:3000. Ver `docs/guia-alumnos.md` antes de tocar código.
