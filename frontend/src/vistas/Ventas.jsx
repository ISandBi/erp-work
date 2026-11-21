import { useCallback, useState } from "react";
import { api } from "../api.js";
import { montoMx } from "../ui.js";
import { useDatos } from "../useDatos.js";

const lineaVacia = { productoId: "", cantidad: "" };

export default function Ventas() {
  const cargar = useCallback(
    () =>
      Promise.all([api("GET", "/ventas"), api("GET", "/productos")]).then(([ventas, productos]) => ({
        ventas,
        productos,
      })),
    []
  );
  const { datos, error, recargar } = useDatos(cargar);
  const [cliente, setCliente] = useState("");
  const [descuentoPct, setDescuentoPct] = useState(0);
  const [lineas, setLineas] = useState([lineaVacia]);
  const [mensaje, setMensaje] = useState("");

  if (error) return <p className="mensaje">{error}</p>;
  if (!datos) return <p>Cargando…</p>;
  const { ventas, productos } = datos;

  // Total estimado en pantalla, calculado con el precio de lista de cada línea
  const precios = new Map(productos.map((p) => [String(p.id), p.precio]));
  const estimado = lineas.reduce(
    (acc, l) => acc + (precios.get(l.productoId) ?? 0) * (Number(l.cantidad) || 0),
    0
  );

  const cambiarLinea = (i, campo, valor) =>
    setLineas(lineas.map((l, j) => (j === i ? { ...l, [campo]: valor } : l)));

  async function registrar(e) {
    e.preventDefault();
    try {
      await api("POST", "/ventas", {
        cliente,
        descuentoPct: Number(descuentoPct),
        lineas: lineas.map((l) => ({ productoId: Number(l.productoId), cantidad: Number(l.cantidad) })),
      });
      setCliente("");
      setDescuentoPct(0);
      setLineas([lineaVacia]);
      setMensaje("");
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  async function facturar(id) {
    try {
      await api("POST", `/ventas/${id}/facturar`);
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  return (
    <>
      <h2>Ventas</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Cliente</th><th>Subtotal</th><th>Descuento</th><th>Total</th><th>Facturada</th><th></th></tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.cliente}</td>
              <td>{montoMx(v.subtotal)}</td>
              <td>{montoMx(v.descuento)}</td>
              <td>{montoMx(v.total)}</td>
              <td>{v.facturada ? "Sí" : "No"}</td>
              <td>{!v.facturada && <button onClick={() => facturar(v.id)}>Facturar</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Nueva venta</h3>
      <form onSubmit={registrar}>
        <input placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} required />
        <input type="number" min="0" max="100" placeholder="Descuento %" value={descuentoPct} onChange={(e) => setDescuentoPct(e.target.value)} />
        {lineas.map((l, i) => (
          <div key={i} className="linea">
            <select value={l.productoId} onChange={(e) => cambiarLinea(i, "productoId", e.target.value)}>
              <option value="">Elige producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <input type="number" min="1" placeholder="Cantidad" value={l.cantidad} onChange={(e) => cambiarLinea(i, "cantidad", e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={() => setLineas([...lineas, lineaVacia])}>Agregar línea</button>
        <p style={{ width: "100%" }}>Total estimado: <strong>{montoMx(estimado)}</strong></p>
        <button>Registrar venta</button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </>
  );
}
