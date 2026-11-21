import { useCallback } from "react";
import { api } from "../api.js";
import { montoMx } from "../ui.js";
import { useDatos } from "../useDatos.js";

export default function Facturas() {
  const cargar = useCallback(() => api("GET", "/facturas"), []);
  const { datos: facturas, error } = useDatos(cargar);

  if (error) return <p className="mensaje">{error}</p>;
  if (!facturas) return <p>Cargando…</p>;

  return (
    <>
      <h2>Facturas</h2>
      <table>
        <thead>
          <tr><th>Folio</th><th>Venta</th><th>Cliente</th><th>Subtotal</th><th>IVA</th><th>Total</th></tr>
        </thead>
        <tbody>
          {facturas.length === 0 && (
            <tr><td colSpan="6">Sin facturas todavía</td></tr>
          )}
          {facturas.map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.ventaId}</td>
              <td>{f.cliente}</td>
              <td>{montoMx(f.subtotal)}</td>
              <td>{montoMx(f.iva)}</td>
              <td>{montoMx(f.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
