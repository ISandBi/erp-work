import { useCallback } from "react";
import { api } from "../api.js";
import { montoMx } from "../ui.js";
import { useDatos } from "../useDatos.js";

export default function Resumen() {
  const cargar = useCallback(() => api("GET", "/resumen"), []);
  const { datos: r, error } = useDatos(cargar);

  if (error) return <p className="mensaje">{error}</p>;
  if (!r) return <p>Cargando…</p>;

  return (
    <>
      <h2>Resumen</h2>
      <section className="tarjetas">
        <div className="tarjeta"><span>Ventas acumuladas</span><strong>{montoMx(r.ventasTotal)}</strong></div>
        <div className="tarjeta"><span>Número de ventas</span><strong>{r.ventasNumero}</strong></div>
        <div className="tarjeta"><span>Facturas emitidas</span><strong>{r.facturas}</strong></div>
        <div className="tarjeta"><span>Órdenes pendientes</span><strong>{r.ordenesPendientes}</strong></div>
      </section>
      <h3>Stock bajo</h3>
      <p>{r.stockBajo.length ? r.stockBajo.join(", ") : "Sin alertas"}</p>
    </>
  );
}
