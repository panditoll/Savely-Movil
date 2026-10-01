/**
 * IMPLEMENTACIÓN ANTERIOR: Inicio anterior: redirige al catálogo mediante Redirect.
 * El grupo (stack) no añade un segmento a la URL; sus rutas pueden coincidir con app/products.
 * Se conserva para estudiar su código. La implementación actual usa Product y CatalogProvider.
 */
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/products" />;
}