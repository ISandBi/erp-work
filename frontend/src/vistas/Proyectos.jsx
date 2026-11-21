import { useCallback, useState } from "react";
import { api } from "../api.js";
import { montoMx } from "../ui.js";
import { useDatos } from "../useDatos.js";

const ESTADOS_PROYECTO = ["planeacion", "en_curso", "en_pausa", "entregado", "cancelado"];
const ESTADOS_ENTREGABLE = ["pendiente", "en_proceso", "entregado"];

const formVacio = {
  nombre: "",
  clienteId: "",
  responsableId: "",
  equipo: [],
  inicio: "",
  fechaCompromiso: "",
  presupuesto: "",
};

export default function Proyectos() {
  const cargar = useCallback(
    () =>
      Promise.all([api("GET", "/proyectos"), api("GET", "/personas"), api("GET", "/clientes")]).then(
        ([proyectos, personas, clientes]) => ({ proyectos, personas, clientes })
      ),
    []
  );
  const { datos, error, recargar } = useDatos(cargar);
  const [seleccionadoId, setSeleccionadoId] = useState(null);
  const [form, setForm] = useState(formVacio);
  const [avance, setAvance] = useState({ porcentaje: "", nota: "", autorId: "" });
  const [entregable, setEntregable] = useState({ nombre: "", fechaLimite: "" });
  const [documento, setDocumento] = useState({ nombre: "", url: "" });
  const [mensaje, setMensaje] = useState("");

  if (error) return <p className="mensaje">{error}</p>;
  if (!datos) return <p>Cargando…</p>;
  const { proyectos, personas, clientes } = datos;
  const proyecto = proyectos.find((p) => p.id === seleccionadoId);

  // Ejecuta una acción contra la API, muestra el error si falla y recarga los datos
  async function accion(fn, alterminar) {
    try {
      await fn();
      setMensaje("");
      alterminar?.();
      recargar();
    } catch (err) {
      setMensaje(err.message);
    }
  }

  function alternarEquipo(id) {
    setForm({
      ...form,
      equipo: form.equipo.includes(id) ? form.equipo.filter((x) => x !== id) : [...form.equipo, id],
    });
  }

  return (
    <>
      <h2>Proyectos</h2>
      <table>
        <thead>
          <tr><th>Proyecto</th><th>Cliente</th><th>Responsable</th><th>Estado</th><th>Avance</th><th>Salud</th><th></th></tr>
        </thead>
        <tbody>
          {proyectos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{clientes.find((c) => c.id === p.clienteId)?.nombre}</td>
              <td>{personas.find((x) => x.id === p.responsableId)?.nombre}</td>
              <td>{p.estado}</td>
              <td>{p.avance}%</td>
              <td>{p.salud}</td>
              <td><button onClick={() => setSeleccionadoId(p.id)}>Ver</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {proyecto && (
        <section className="detalle">
          <h3>{proyecto.nombre}</h3>
          <p>
            Estado:{" "}
            <select
              value={proyecto.estado}
              onChange={(e) =>
                accion(() => api("POST", `/proyectos/${proyecto.id}/estado`, { estado: e.target.value }))
              }
            >
              {ESTADOS_PROYECTO.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </p>
          <p>
            Presupuesto: {montoMx(proyecto.presupuesto)} · Fecha compromiso:{" "}
            {proyecto.fechaCompromiso ?? "sin fecha"}
          </p>

          <h4>Avances</h4>
          <ul>
            {proyecto.avances.map((a) => (
              <li key={a.id}>
                {a.fecha.slice(0, 10)} · {a.porcentaje}% · {a.nota}
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              accion(
                () =>
                  api("POST", `/proyectos/${proyecto.id}/avances`, {
                    porcentaje: Number(avance.porcentaje),
                    nota: avance.nota,
                    autorId: Number(avance.autorId),
                  }),
                () => setAvance({ porcentaje: "", nota: "", autorId: "" })
              );
            }}
          >
            <input type="number" placeholder="Avance %" value={avance.porcentaje} onChange={(e) => setAvance({ ...avance, porcentaje: e.target.value })} required />
            <input placeholder="Nota del avance" value={avance.nota} onChange={(e) => setAvance({ ...avance, nota: e.target.value })} />
            <select value={avance.autorId} onChange={(e) => setAvance({ ...avance, autorId: e.target.value })} required>
              <option value="">Quién reporta</option>
              {personas.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <button>Registrar avance</button>
          </form>

          <h4>Entregables</h4>
          <table>
            <thead>
              <tr><th>Entregable</th><th>Fecha límite</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {proyecto.entregables.map((en) => (
                <tr key={en.id}>
                  <td>{en.nombre}</td>
                  <td>{en.fechaLimite ?? "sin fecha"}</td>
                  <td>
                    <select
                      value={en.estado}
                      onChange={(e) =>
                        accion(() =>
                          api("POST", `/proyectos/${proyecto.id}/entregables/${en.id}/estado`, { estado: e.target.value })
                        )
                      }
                    >
                      {ESTADOS_ENTREGABLE.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              accion(
                () => api("POST", `/proyectos/${proyecto.id}/entregables`, entregable),
                () => setEntregable({ nombre: "", fechaLimite: "" })
              );
            }}
          >
            <input placeholder="Nombre del entregable" value={entregable.nombre} onChange={(e) => setEntregable({ ...entregable, nombre: e.target.value })} required />
            <input type="date" value={entregable.fechaLimite} onChange={(e) => setEntregable({ ...entregable, fechaLimite: e.target.value })} />
            <button>Agregar entregable</button>
          </form>

          <h4>Documentos</h4>
          <ul>
            {proyecto.documentos.map((d) => (
              <li key={d.id}>
                <a href={d.url} target="_blank" rel="noreferrer">{d.nombre}</a>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              accion(
                () => api("POST", `/proyectos/${proyecto.id}/documentos`, documento),
                () => setDocumento({ nombre: "", url: "" })
              );
            }}
          >
            <input placeholder="Nombre del documento" value={documento.nombre} onChange={(e) => setDocumento({ ...documento, nombre: e.target.value })} required />
            <input placeholder="Enlace (repositorio, documento o carpeta)" value={documento.url} onChange={(e) => setDocumento({ ...documento, url: e.target.value })} required style={{ minWidth: 320 }} />
            <button>Agregar enlace</button>
          </form>
        </section>
      )}

      <h3>Nuevo proyecto</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          accion(
            () =>
              api("POST", "/proyectos", {
                nombre: form.nombre,
                clienteId: Number(form.clienteId),
                responsableId: Number(form.responsableId),
                equipo: form.equipo,
                inicio: form.inicio || undefined,
                fechaCompromiso: form.fechaCompromiso || undefined,
                presupuesto: Number(form.presupuesto) || 0,
              }),
            () => setForm(formVacio)
          );
        }}
      >
        <input placeholder="Nombre del proyecto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
        <select value={form.clienteId} onChange={(e) => setForm({ ...form, clienteId: e.target.value })} required>
          <option value="">Cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <select value={form.responsableId} onChange={(e) => setForm({ ...form, responsableId: e.target.value })} required>
          <option value="">Responsable</option>
          {personas.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <input type="date" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} />
        <input type="date" value={form.fechaCompromiso} onChange={(e) => setForm({ ...form, fechaCompromiso: e.target.value })} />
        <input type="number" placeholder="Presupuesto" value={form.presupuesto} onChange={(e) => setForm({ ...form, presupuesto: e.target.value })} />
        <div style={{ width: "100%" }}>
          Equipo:{" "}
          {personas.map((p) => (
            <label key={p.id} style={{ marginRight: 12 }}>
              <input type="checkbox" checked={form.equipo.includes(p.id)} onChange={() => alternarEquipo(p.id)} /> {p.nombre}
            </label>
          ))}
        </div>
        <button>Crear proyecto</button>
      </form>
      <p className="mensaje">{mensaje}</p>
    </>
  );
}
