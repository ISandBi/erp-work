import { useCallback } from "react";
import { api } from "../api.js";
import { useDatos } from "../useDatos.js";

export default function Resumen() {
  const cargar = useCallback(() => api("GET", "/resumen"), []);
  const { datos: r, error } = useDatos(cargar);

  if (error) return <p className="mensaje">{error}</p>;
  if (!r) return <p>Cargando…</p>;

  return (
    <>
      <h2>Resumen de la organización</h2>
      <section className="tarjetas">
        <div className="tarjeta"><span>Proyectos registrados</span><strong>{r.proyectosTotal}</strong></div>
        <div className="tarjeta"><span>Proyectos activos</span><strong>{r.proyectosActivos}</strong></div>
        <div className="tarjeta"><span>Avance promedio</span><strong>{r.avancePromedio}%</strong></div>
        <div className="tarjeta"><span>Tickets abiertos</span><strong>{r.ticketsAbiertos}</strong></div>
      </section>
      <h3>Proyectos en riesgo</h3>
      <p>{r.enRiesgo.length ? r.enRiesgo.join(", ") : "Ninguno por ahora"}</p>
    </>
  );
}
