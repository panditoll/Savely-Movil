/** Claves de imágenes locales: se validan antes de leer o guardar productos. */
import type { Categoria, ImagenProducto } from "../models/Product";

export const opcionesImagen: { clave: ImagenProducto; nombre: string }[] = [
  { clave: "leche", nombre: "Leche" }, { clave: "manzana", nombre: "Manzanas" },
  { clave: "platano", nombre: "Plátanos" }, { clave: "arroz", nombre: "Arroz" },
  { clave: "detergente", nombre: "Detergente" }, { clave: "bebida", nombre: "Bebida" },
  { clave: "fideos", nombre: "Fideos" }, { clave: "huevos", nombre: "Huevos" },
  { clave: "agua", nombre: "Agua" }, { clave: "jugo", nombre: "Jugo" },
  { clave: "lavalozas", nombre: "Lavalozas" }, { clave: "limpiador", nombre: "Limpiador" },
  { clave: "champu", nombre: "Champú" }, { clave: "jabon", nombre: "Jabón" },
  { clave: "pasta-dental", nombre: "Pasta dental" },
  { clave: "papel-absorbente", nombre: "Papel absorbente" },
  { clave: "bolsas-basura", nombre: "Bolsas de basura" }, { clave: "esponjas", nombre: "Esponjas" },
];

export function esImagenProducto(valor: unknown): valor is ImagenProducto {
  return opcionesImagen.some((opcion) => opcion.clave === valor);
}

// Normaliza tildes para reconocer tanto Champú como champu, por ejemplo.
export function elegirImagen(nombre: string, categoria: Categoria): ImagenProducto {
  const normalizado = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const coincidencias: [string, ImagenProducto][] = [
    ["pasta dental", "pasta-dental"], ["papel", "papel-absorbente"],
    ["basura", "bolsas-basura"], ["leche", "leche"], ["manzana", "manzana"],
    ["platano", "platano"], ["banana", "platano"], ["arroz", "arroz"],
    ["detergente", "detergente"], ["bebida", "bebida"], ["fideos", "fideos"],
    ["espagueti", "fideos"], ["huevo", "huevos"], ["agua", "agua"],
    ["jugo", "jugo"], ["lavalozas", "lavalozas"], ["limpiador", "limpiador"],
    ["champu", "champu"], ["shampoo", "champu"], ["jabon", "jabon"], ["esponja", "esponjas"],
  ];
  const porCategoria: Record<Categoria, ImagenProducto> = {
    Alimentos: "manzana", Bebidas: "agua", Limpieza: "limpiador", Higiene: "jabon", Hogar: "papel-absorbente",
  };
  return coincidencias.find(([termino]) => normalizado.includes(termino))?.[1] ?? porCategoria[categoria];
}
