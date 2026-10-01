/**
 * RUTA DINÁMICA: /products/1, /products/2, etc. Reutiliza el mismo detalle.
 * Los corchetes representan un parámetro; la exportación estática necesita conocer sus valores.
 */
import { productos } from "@/store/products.store";
export { default } from "@/components/ProductDetail";
// Genera rutas para los 18 IDs de la semilla al exportar la web.
// Para productos creados después se utiliza la ruta fija /products/detail?id=ID.
export function generateStaticParams() {
  return productos.map((p) => ({ id: String(p.id) }));
}
