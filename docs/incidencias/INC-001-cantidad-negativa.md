# INC-001: Inventario acepta cantidades negativas en entradas

- **Tipo:** bug
- **Módulo afectado:** inventario
- **Severidad:** media
- **Síntoma:** registrar una entrada con cantidad -5 aumenta el stock en lugar de rechazar la operación.
- **Pasos para reproducir:** llamar `registrarEntrada({ productoId: 1, cantidad: -5 })` y revisar el stock.
- **Criterio de aceptación:** una entrada con cantidad menor o igual a cero lanza error y no modifica el stock.
