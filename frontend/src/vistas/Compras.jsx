import { useCallback, useState } from "react";
import { api } from "../api.js";
import { useDatos } from "../useDatos.js";

const lineaVacia = { productoId: "", cantidad: "", costoUnitario: "" };

export default function Compras() {
  const cargar = useCallback(
    () =>
      Promise.all([api("GET", "/compras"), api("GET", "/productos")]).then(([ordenes, productos]) => ({
        ordenes,
        productos,
      })),
    []
  );
  const { datos, error, recargar } = useDatos(cargar);
  const [proveedor, setProveedor] = useState("");
  const [lineas, setLineas] = useState([lineaVacia]);
  const [mensaje, setMensaje] = useState("");

  if (error) return <p className="mensaje">{error}</p>;
  if (!datos) return <p>Cargando…</p>;
  const { ordenes, productos } = datos;

  const cambiarLinea = (i, campo, valor) =>
    setLineas(lineas.map((l, j) => (j === i ? { ...l, [campo]: valor } : l)));

  async function crear(e) {
    e.preventDefault();
    try {
      await api("POST", "/compras", {
        proveedor,
        lineas: lineas.map((l) => ({
          productoId: Number(l.productoId),
          cantidad: Number(l.cantidad),
          costoUnitario: Number(l.costoUnitario),
        })),
      });
      setProveedor("");
      setLineas([lineaVacia]);
      setMensaje("");
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  async function recibir(id) {
    try {
      await api("POST", `/compras/${id}/recibir`);
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  return (
    <>
      <h2>Órdenes de compra</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Proveedor</th><th>Líneas</th><th>Estado</th><th></th></tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.proveedor}</td>
              <td>{o.lineas.length}</td>
              <td>{o.estado}</td>
              <td>
                {o.estado === "pendiente" && <button onClick={() => recibir(o.id)}>Recibir</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Nueva orden</h3>
      <form onSubmit={crear}>
        <input placeholder="Proveedor" value={proveedor} onChange={(e) => setProveedor(e.target.value)} required />
        {lineas.map((l, i) => (
          <div key={i} className="linea">
            <select value={l.productoId} onChange={(e) => cambiarLinea(i, "productoId", e.target.value)}>
              <option value="">Elige producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <input type="number" placeholder="Cantidad" value={l.cantidad} onChange={(e) => cambiarLinea(i, "cantidad", e.target.value)} />
            <input type="number" step="0.01" placeholder="Costo unitario" value={l.costoUnitario} onChange={(e) => cambiarLinea(i, "costoUnitario", e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={() => setLineas([...lineas, lineaVacia])}>Agregar línea</button>
        <button>Crear orden</button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </>
  );
}
