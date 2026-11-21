import { useCallback, useState } from "react";
import { api } from "../api.js";
import { montoMx } from "../ui.js";
import { useDatos } from "../useDatos.js";

const formVacio = { sku: "", nombre: "", tipo: "producto", precio: "", stock: "" };

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState(formVacio);
  const [mensaje, setMensaje] = useState("");

  // La búsqueda viaja en la URL tal como la escribe el usuario
  const cargar = useCallback(() => api("GET", `/productos?q=${busqueda}`), [busqueda]);
  const { datos: productos, error, recargar } = useDatos(cargar);

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function guardar(e) {
    e.preventDefault();
    try {
      await api("POST", "/productos", form);
      setForm(formVacio);
      setMensaje("");
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  return (
    <>
      <h2>Catálogo</h2>
      <input
        placeholder="Buscar por nombre o SKU"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {error && <p className="mensaje">{error}</p>}
      {!productos ? (
        <p>Cargando…</p>
      ) : (
        <table>
          <thead>
            <tr><th>SKU</th><th>Nombre</th><th>Tipo</th><th>Precio</th></tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.nombre}</td>
                <td>{p.tipo}</td>
                <td>{montoMx(p.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3>Nuevo producto</h3>
      <form onSubmit={guardar}>
        <input placeholder="SKU" value={form.sku} onChange={cambiar("sku")} required />
        <input placeholder="Nombre" value={form.nombre} onChange={cambiar("nombre")} required />
        <select value={form.tipo} onChange={cambiar("tipo")}>
          <option value="producto">Producto</option>
          <option value="licencia">Licencia</option>
          <option value="hardware">Hardware</option>
          <option value="servicio">Servicio</option>
        </select>
        <input type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={cambiar("precio")} required />
        <input type="number" placeholder="Stock inicial" value={form.stock} onChange={cambiar("stock")} />
        <button>Guardar</button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </>
  );
}
