import { useCallback, useState } from "react";
import { api } from "../api.js";
import { useDatos } from "../useDatos.js";

export default function Inventario() {
  const cargar = useCallback(() => api("GET", "/productos"), []);
  const { datos: productos, error, recargar } = useDatos(cargar);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (error) return <p className="mensaje">{error}</p>;
  if (!productos) return <p>Cargando…</p>;

  async function registrar(e) {
    e.preventDefault();
    try {
      await api("POST", "/inventario/entrada", {
        productoId: Number(productoId),
        cantidad: Number(cantidad),
      });
      setCantidad("");
      setMensaje("");
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  return (
    <>
      <h2>Inventario</h2>
      <table>
        <thead>
          <tr><th>SKU</th><th>Nombre</th><th>Existencias</th></tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.nombre}</td>
              <td>{p.stock ?? "No aplica"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Registrar entrada</h3>
      <form onSubmit={registrar}>
        <select value={productoId} onChange={(e) => setProductoId(e.target.value)} required>
          <option value="">Elige un producto</option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <input type="number" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
        <button>Registrar</button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </>
  );
}
