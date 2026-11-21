import { useEffect, useState } from "react";
import Resumen from "./vistas/Resumen.jsx";
import Proyectos from "./vistas/Proyectos.jsx";
import Organizacion from "./vistas/Organizacion.jsx";
import Tickets from "./vistas/Tickets.jsx";

const vistas = {
  resumen: { nombre: "Resumen", componente: Resumen },
  proyectos: { nombre: "Proyectos", componente: Proyectos },
  organizacion: { nombre: "Organización", componente: Organizacion },
  tickets: { nombre: "Tickets TI", componente: Tickets },
};

function leerRuta() {
  return location.hash.replace("#/", "") || "resumen";
}

export default function App() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    const alCambiar = () => setRuta(leerRuta());
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);

  const Vista = (vistas[ruta] ?? vistas.resumen).componente;

  return (
    <>
      <header>
        <h1>IS&amp;BI</h1>
        <nav>
          {Object.entries(vistas).map(([clave, { nombre }]) => (
            <a key={clave} href={`#/${clave}`} className={clave === ruta ? "activa" : ""}>
              {nombre}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <Vista />
      </main>
    </>
  );
}
