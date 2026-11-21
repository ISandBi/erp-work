# INC-001: El avance de un proyecto acepta porcentajes fuera de rango

- **Tipo:** bug
- **Módulo afectado:** proyectos
- **Severidad:** media
- **Síntoma:** registrar un avance de 150% se guarda y el proyecto muestra un avance mayor al total.
- **Pasos para reproducir:** llamar `registrarAvance(1, { porcentaje: 150, autorId: 2 })` y revisar el avance del proyecto.
- **Criterio de aceptación:** un avance menor a 0 o mayor a 100 se rechaza y no se guarda.
