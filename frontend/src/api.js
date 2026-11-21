// Cliente de la API del backend
export async function api(metodo, ruta, cuerpo) {
  const respuesta = await fetch(`/api${ruta}`, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(datos.error);
  return datos;
}
