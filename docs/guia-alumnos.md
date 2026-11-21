# Guía para alumnos

## Reglas del proyecto

1. Nunca hacer push directo a `main`. Cada cambio va en una rama y en un pull request.
2. Cada pull request requiere revisión de otro equipo, con al menos una pregunta de diseño.
3. Cada decisión importante se registra como ADR en `docs/adr/` (usa la plantilla `0000-plantilla.md`).
4. Si usas IA para escribir código o decidir algo, regístralo en la descripción del PR: qué pediste, qué aceptaste y qué cambiaste.
5. Toda incidencia técnica se registra en `docs/incidencias/` antes de corregirla.

## Flujo de trabajo

1. Toma una incidencia o historia de usuario.
2. Crea una rama: `git checkout -b tipo/descripcion-corta`.
3. Escribe primero la prueba que falla y después el código.
4. Corre `npm test` en `backend/`.
5. Abre un pull request con la bitácora de decisiones.

## Qué se evalúa además de las pruebas

- Calidad de las decisiones y alternativas descartadas.
- Defensa oral de tu cambio.
- Impacto de tu cambio en otros módulos.
