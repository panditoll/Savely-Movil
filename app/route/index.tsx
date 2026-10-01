/**
 * PANTALLA RUTA: sección pendiente que muestra En proceso.
 * No calcula recorridos ni consulta mapas o ubicación.
 */
import InProgressScreen from "@/components/InProgressScreen";

export default function RouteScreen() {
  // Reutiliza el componente de pantalla pendiente con el título de esta sección.
  return <InProgressScreen titulo="Ruta" />;
}
