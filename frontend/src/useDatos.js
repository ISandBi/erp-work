import { useCallback, useEffect, useState } from "react";

// Carga datos con la función `cargar` y permite recargarlos después de un cambio
export function useDatos(cargar) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");

  const recargar = useCallback(() => {
    return cargar()
      .then((resultado) => {
        setDatos(resultado);
        setError("");
      })
      .catch((err) => setError(err.message));
  }, [cargar]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { datos, error, recargar };
}
