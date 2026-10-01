/**
 * RUTA FIJA DEL DETALLE: /products/detail?id=ID reutiliza ProductDetail.
 * Una página estática puede leer un ID nuevo desde la URL y buscarlo en el catálogo local.
 * Ese producto solo existe en el dispositivo u origen web donde se guardó.
 */
// La ruta fija permite abrir productos locales nuevos incluso en una exportación estática.
export { default } from "@/components/ProductDetail";
