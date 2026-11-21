import { useCallback, useState } from "react";
import { api } from "../api.js";
import { useDatos } from "../useDatos.js";

const ESTADOS = ["abierto", "en_proceso", "resuelto", "cerrado"];
const PRIORIDADES = ["baja", "media", "alta", "critica"];
const TIPOS = ["bug", "mejora", "tarea"];

const formVacio = {
  titulo: "",
  descripcion: "",
  tipo: "bug",
  prioridad: "media",
  area: "QA",
  reportadoPor: "",
};

export default function Tickets() {
  const [filtroArea, setFiltroArea] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [form, setForm] = useState(formVacio);
  const [mensaje, setMensaje] = useState("");

  const cargar = useCallback(() => {
    const params = new URLSearchParams();
    if (filtroArea) params.set("area", filtroArea);
    if (filtroEstado) params.set("estado", filtroEstado);
    return Promise.all([
      api("GET", `/tickets?${params.toString()}`),
      api("GET", "/tickets/resumen"),
    ]).then(([tickets, resumen]) => ({ tickets, resumen }));
  }, [filtroArea, filtroEstado]);

  const { datos, error, recargar } = useDatos(cargar);

  if (error) return <p className="mensaje">{error}</p>;
  if (!datos) return <p>Cargando…</p>;
  const { tickets, resumen } = datos;

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function reportar(e) {
    e.preventDefault();
    try {
      await api("POST", "/tickets", form);
      setForm(formVacio);
      setMensaje("");
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  async function cambiarEstado(id, estado) {
    try {
      await api("POST", `/tickets/${id}/estado`, { estado, comentario: "Cambio desde el tablero" });
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  return (
    <>
      <h2>Tickets de TI</h2>

      <section className="tarjetas">
        {resumen.map((r) => (
          <div key={r.area} className="tarjeta">
            <span>{r.area}</span>
            <strong>{r.abiertos} abiertos</strong>
          </div>
        ))}
      </section>

      <div className="filtros">
        <select value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
          <option value="">Todas las áreas</option>
          {resumen.map((r) => (
            <option key={r.area} value={r.area}>{r.area}</option>
          ))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th><th>Título</th><th>Tipo</th><th>Prioridad</th><th>Área</th><th>Reportado por</th><th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>
                {t.titulo}
                <details>
                  <summary>Detalle e historial</summary>
                  <p>{t.descripcion || "Sin descripción"}</p>
                  <ul>
                    {t.historial.map((h, i) => (
                      <li key={i}>{new Date(h.fecha).toLocaleString("es-MX")} · {h.estado} · {h.comentario}</li>
                    ))}
                  </ul>
                </details>
              </td>
              <td>{t.tipo}</td>
              <td>{t.prioridad}</td>
              <td>{t.area}</td>
              <td>{t.reportadoPor}</td>
              <td>
                <select value={t.estado} onChange={(e) => cambiarEstado(t.id, e.target.value)}>
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Reportar incidencia</h3>
      <form onSubmit={reportar}>
        <input placeholder="Título" value={form.titulo} onChange={cambiar("titulo")} required />
        <textarea placeholder="Descripción y pasos para reproducir" value={form.descripcion} onChange={cambiar("descripcion")} rows={3} style={{ width: "100%" }} />
        <select value={form.area} onChange={cambiar("area")}>
          {resumen.map((r) => (
            <option key={r.area} value={r.area}>{r.area}</option>
          ))}
        </select>
        <select value={form.tipo} onChange={cambiar("tipo")}>
          {TIPOS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={form.prioridad} onChange={cambiar("prioridad")}>
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input placeholder="Reportado por" value={form.reportadoPor} onChange={cambiar("reportadoPor")} />
        <button>Reportar</button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </>
  );
}
