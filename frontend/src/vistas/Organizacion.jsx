import { useCallback, useState } from "react";
import { api } from "../api.js";
import { useDatos } from "../useDatos.js";

export default function Organizacion() {
  const cargar = useCallback(
    () =>
      Promise.all([api("GET", "/personas"), api("GET", "/clientes"), api("GET", "/areas")]).then(
        ([personas, clientes, areas]) => ({ personas, clientes, areas })
      ),
    []
  );
  const { datos, error, recargar } = useDatos(cargar);
  const [persona, setPersona] = useState({ nombre: "", rol: "", area: "" });
  const [cliente, setCliente] = useState({ nombre: "", contacto: "" });
  const [mensaje, setMensaje] = useState("");

  if (error) return <p className="mensaje">{error}</p>;
  if (!datos) return <p>Cargando…</p>;
  const { personas, clientes, areas } = datos;

  async function guardar(ruta, cuerpo, reiniciar) {
    try {
      await api("POST", ruta, cuerpo);
      reiniciar();
      setMensaje("");
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  return (
    <>
      <h2>Organización</h2>

      <h3>Personas</h3>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Rol</th><th>Área</th></tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.rol}</td>
              <td>{p.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardar("/personas", persona, () => setPersona({ nombre: "", rol: "", area: "" }));
        }}
      >
        <input placeholder="Nombre" value={persona.nombre} onChange={(e) => setPersona({ ...persona, nombre: e.target.value })} required />
        <input placeholder="Rol" value={persona.rol} onChange={(e) => setPersona({ ...persona, rol: e.target.value })} />
        <select value={persona.area} onChange={(e) => setPersona({ ...persona, area: e.target.value })} required>
          <option value="">Elige área</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button>Agregar persona</button>
      </form>

      <h3>Clientes</h3>
      <table>
        <thead>
          <tr><th>Nombre</th><th>Contacto</th></tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.contacto}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardar("/clientes", cliente, () => setCliente({ nombre: "", contacto: "" }));
        }}
      >
        <input placeholder="Nombre del cliente" value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} required />
        <input placeholder="Contacto" value={cliente.contacto} onChange={(e) => setCliente({ ...cliente, contacto: e.target.value })} />
        <button>Agregar cliente</button>
      </form>

      <p className="mensaje">{mensaje}</p>
    </>
  );
}
