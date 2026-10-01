/**
 * LÓGICA DEL CATÁLOGO: funciones sin interfaz ni acceso directo a AsyncStorage.
 * Validan y transforman datos creando nuevos objetos; el provider se encarga de persistirlos.
 */
import type { Product, ProductInput } from "../models/Product";
import { categorias } from "./products.store";
import { elegirImagen, esImagenProducto } from "./product-images";

// as const conserva los valores literales de las unidades permitidas.
export const unidades = ["g", "kg", "ml", "L", "ud"] as const;
export const ofertas = ["hoy", "semana", "ninguna"] as const;
// Estado persistido: catálogo, IDs de la lista y contador del próximo ID.
export interface CatalogState {
  productos: Product[];
  lista: number[];
  siguienteId: number;
  // Migra la antigua manzana compartida una sola vez sin perder productos ni lista.
  versionImagenes?: 1;
}

// Devuelve el primer mensaje de error o null si todo es válido.
// Esta comprobación se usa en el formulario, el guardado y la lectura del JSON.
export function validarProducto(p: ProductInput): string | null {
  if (p.imagen !== undefined && !esImagenProducto(p.imagen))
    return "Selecciona una imagen válida del catálogo.";
  // trim detecta texto vacío aunque contenga espacios. También se limita la longitud.
  if (!p.nombre.trim() || p.nombre.length > 100)
    return "Escribe un nombre de hasta 100 caracteres.";
  if (!categorias.includes(p.categoria))
    return "Selecciona una categoría válida.";
  if (!p.descripcion.trim() || p.descripcion.length > 1000)
    return "Escribe los detalles (máximo 1000 caracteres).";
  if (!p.tamano.trim() || p.tamano.length > 80)
    return "Escribe el tamaño o presentación (máximo 80 caracteres).";
  // Rechaza NaN, Infinity y contenidos fuera del rango permitido.
  if (!Number.isFinite(p.contenido) || p.contenido <= 0 || p.contenido > 100000)
    return "El contenido debe ser mayor que cero y no superar 100.000.";
  if (!unidades.includes(p.unidad)) return "Selecciona una unidad válida.";
  if (!ofertas.includes(p.oferta))
    return "Selecciona la disponibilidad de la oferta.";
  // Los precios deben ser enteros seguros, positivos y dentro del límite; un teclado numérico no basta.
  if (
    ![p.precios.lider, p.precios.unimarc].every(
      (v) => Number.isSafeInteger(v) && v > 0 && v <= 100000000,
    )
  )
    return "Los precios deben ser pesos enteros, entre $1 y $100.000.000.";
  return null;
}

// Sin id crea un producto; con id actualiza uno existente.
// Valida otra vez para que la regla no dependa únicamente de la pantalla del formulario.
export function guardarProducto(
  state: CatalogState,
  input: ProductInput,
  id?: number,
): CatalogState {
  const error = validarProducto(input);
  if (error) throw new Error(error);
  if (id !== undefined && !state.productos.some((p) => p.id === id))
    throw new Error("Este producto ya no existe.");
  // Recorta espacios y asigna la imagen elegida o una sugerencia por nombre y categoría.
  const producto: Product = {
    ...input,
    nombre: input.nombre.trim(),
    descripcion: input.descripcion.trim(),
    tamano: input.tamano.trim(),
    id: id ?? state.siguienteId,
    imagen: input.imagen ?? elegirImagen(input.nombre, input.categoria),
  };
  return {
    ...state,
    versionImagenes: 1,
    // Inmutabilidad: spread agrega un producto y map reemplaza el editado sin mutar el arreglo previo.
    productos:
      id === undefined
        ? [...state.productos, producto]
        : state.productos.map((p) => (p.id === id ? producto : p)),
    siguienteId: id === undefined ? state.siguienteId + 1 : state.siguienteId,
  };
}

// filter elimina el producto y su referencia en la lista; evita IDs que apunten a productos borrados.
export function eliminarProducto(
  state: CatalogState,
  id: number,
): CatalogState {
  return {
    ...state,
    productos: state.productos.filter((p) => p.id !== id),
    lista: state.lista.filter((item) => item !== id),
  };
}

// JSON.parse puede fallar. El valor se trata como unknown hasta revisar su estructura.
export function leerCatalogo(texto: string): CatalogState {
  const data: unknown = JSON.parse(texto);
  if (!data || typeof data !== "object") throw new Error("Catálogo no válido.");
  // Esta aserción permite acceder a campos, pero NO prueba que sean válidos: las comprobaciones siguen abajo.
  const s = data as CatalogState;
  if (
    !Array.isArray(s.productos) ||
    !Array.isArray(s.lista) ||
    !Number.isSafeInteger(s.siguienteId)
  )
    throw new Error("Catálogo no válido.");
  // Valida cada producto recuperado, incluidos su ID, textos, imagen y precios.
  for (const p of s.productos) {
    if (
      !p ||
      typeof p.nombre !== "string" ||
      typeof p.descripcion !== "string" ||
      typeof p.tamano !== "string" ||
      !p.precios ||
      !esImagenProducto(p.imagen) ||
      !Number.isSafeInteger(p.id) ||
      p.id < 1 ||
      validarProducto(p)
    )
      throw new Error("Producto guardado no válido.");
  }
  if (
    // Set detecta IDs repetidos; siguienteId debe superar todos los IDs existentes.
    new Set(s.productos.map((p) => p.id)).size !== s.productos.length ||
    s.siguienteId <= Math.max(0, ...s.productos.map((p) => p.id))
  )
    throw new Error("IDs de catálogo no válidos.");
  if (
    // Cada ID de la lista debe existir en el catálogo; también se rechazan duplicados.
    !s.lista.every(
      (id) => Number.isSafeInteger(id) && s.productos.some((p) => p.id === id),
    ) ||
    new Set(s.lista).size !== s.lista.length
  )
    throw new Error("Lista no válida.");
  if (s.versionImagenes !== undefined && s.versionImagenes !== 1)
    throw new Error("Versión de imágenes no válida.");
  // Los catálogos previos usaban manzana para todos; solo se transforma ese campo.
  if (s.versionImagenes !== 1) {
    return {
      ...s,
      versionImagenes: 1,
      productos: s.productos.map((p) => ({
        ...p,
        imagen: p.imagen === "manzana" ? elegirImagen(p.nombre, p.categoria) : p.imagen,
      })),
    };
  }
  return s;
}
