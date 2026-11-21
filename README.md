# IS&BI ERP

ERP de práctica de la consultoría IS&BI, construido desde cero por el grupo.
El producto es un sistema para una consultoría de software: catálogo de servicios,
proyectos, horas, licencias, compras, ventas y facturación.

## Estructura

- `backend/`: API y lógica de negocio en JavaScript (Node.js). Sin dependencias en el primer ciclo.
- `frontend/`: interfaz web (React + Vite, por definir).
- `docs/`: guía para alumnos, decisiones de arquitectura (ADR) e incidencias.

## Cómo correr las pruebas

```bash
cd backend
npm test
```

Ver `docs/guia-alumnos.md` antes de tocar código.

## Cómo correr el ERP

```bash
cd backend
npm start
```

Luego abre http://localhost:3000 en el navegador.
