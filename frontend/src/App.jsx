import { useEffect, useState } from "react";
import Resumen from "./vistas/Resumen.jsx";
import Catalogo from "./vistas/Catalogo.jsx";
import Inventario from "./vistas/Inventario.jsx";
import Compras from "./vistas/Compras.jsx";
import Ventas from "./vistas/Ventas.jsx";
import Facturas from "./vistas/Facturas.jsx";
import Tickets from "./vistas/Tickets.jsx";

const vistas = {
  resumen: { nombre: "Resumen", componente: Resumen },
  catalogo: { nombre: "Catálogo", componente: Catalogo },
  inventario: { nombre: "Inventario", componente: Inventario },
  compras: { nombre: "Compras", componente: Compras },
  ventas: { nombre: "Ventas", componente: Ventas },
  facturas: { nombre: "Facturas", componente: Facturas },
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
        <h1>IS&amp;BI ERP</h1>
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
