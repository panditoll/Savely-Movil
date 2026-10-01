/**
 * CÁLCULOS Y BÚSQUEDA: funciones reutilizables que trabajan con datos, sin JSX ni almacenamiento.
 * Se comparan precios ficticios para una unidad de cada producto y se devuelven resultados derivados.
 */
import type {
  Categoria,
  Precios,
  Product,
  Supermercado,
} from "../models/Product";

// Redondea para mostrar pesos y usa separadores chilenos: 1490 se presenta como $1.490.
export function formatearPesos(valor: number): string {
  return "$" + Math.round(valor).toLocaleString("es-CL");
}

// Compara las dos tiendas. Un empate se representa con null y ahorro cero.
export function compararPrecios(precios: Precios) {
  const mejorSupermercado: Supermercado | null =
    precios.lider === precios.unimarc
      ? null
      : precios.lider < precios.unimarc
        ? "Líder"
        : "Unimarc";

  return {
    mejorSupermercado,
    precioMenor: Math.min(precios.lider, precios.unimarc),
    // Diferencia absoluta: siempre positiva o cero, independientemente de la tienda ganadora.
    ahorro: Math.abs(precios.lider - precios.unimarc),
  };
}

// reduce acumula dos totales separados. El valor inicial permite sumar también un catálogo vacío.
export function sumarPrecios(productos: readonly Product[]): Precios {
  return productos.reduce(
    (total, producto) => ({
      lider: total.lider + producto.precios.lider,
      unimarc: total.unimarc + producto.precios.unimarc,
    }),
    { lider: 0, unimarc: 0 },
  );
}

// filter extrae la categoría; luego suma y compara la compra completa en cada tienda.
export function resumirCategoria(
  productos: readonly Product[],
  categoria: Categoria,
) {
  const productosCategoria = productos.filter(
    (producto) => producto.categoria === categoria,
  );
  const totales = sumarPrecios(productosCategoria);
  return {
    categoria,
    productos: productosCategoria,
    totales,
    ...compararPrecios(totales),
  };
}

// Promedio aritmético de los ahorros por categoría, no promedio de precios individuales.
export function calcularAhorroPromedio(
  productos: readonly Product[],
  categorias: readonly Categoria[],
) {
  if (categorias.length === 0) return 0;
  return (
    categorias.reduce(
      (suma, categoria) => suma + resumirCategoria(productos, categoria).ahorro,
      0,
    ) / categorias.length
  );
}

// El límite también se aplica al actualizar el estado, aunque el botón esté deshabilitado.
// Una selección repetida se quita; una nueva solo entra si hay menos de dos IDs.
// La regla también se aplica aquí aunque la interfaz deshabilite el botón.
export function alternarSeleccion(
  ids: readonly number[],
  id: number,
): number[] {
  if (ids.includes(id))
    return ids.filter((seleccionado) => seleccionado !== id);
  return ids.length < 2 ? [...ids, id] : [...ids];
}

// Compara repartir la compra entre ambas tiendas frente a la tienda con menor total.
// Compara repartir productos al menor precio con comprar todo en la tienda de menor total.
// Tiene pruebas, pero no está conectado al banner actual: ese banner usa ahorroOfertas.
export function calcularAhorroCompra(productos: readonly Product[]) {
  const totales = sumarPrecios(productos);
  const totalUnaTienda = Math.min(totales.lider, totales.unimarc);
  const totalMejoresPrecios = productos.reduce(
    (suma, producto) => suma + compararPrecios(producto.precios).precioMenor,
    0,
  );
  return {
    totales,
    totalUnaTienda,
    totalMejoresPrecios,
    ahorro: totalUnaTienda - totalMejoresPrecios,
  };
}

// Combina búsqueda por nombre y categoría. Todas omite la restricción de categoría.
export function filtrarProductos(
  productos: readonly Product[],
  busqueda: string,
  categoria: Categoria | "Todas",
) {
  // NFD separa letras y acentos; la expresión regular elimina los acentos.
  // Después pasa a minúsculas y recorta espacios: PLATANOS encuentra Plátanos.
  const normalizar = (texto: string) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  const termino = normalizar(busqueda);
  return productos.filter(
    (producto) =>
      (categoria === "Todas" || producto.categoria === categoria) &&
      normalizar(producto.nombre).includes(termino),
  );
}

// Normaliza gramos a kg y mililitros a L con factor 1000; kg, L y ud mantienen factor 1.
// Ejemplo: 500 ml a $1000 equivalen a $2000/L. La validación impide contenido cero.
export function precioPorUnidad(producto: Product) {
  const factor = producto.unidad === "g" || producto.unidad === "ml" ? 1000 : 1;
  const unidad =
    producto.unidad === "g"
      ? "kg"
      : producto.unidad === "ml"
        ? "L"
        : producto.unidad;
  return {
    unidad,
    lider: (producto.precios.lider * factor) / producto.contenido,
    unimarc: (producto.precios.unimarc * factor) / producto.contenido,
  };
}

// Construye el texto de cantidad, unidad y presentación utilizando el formato local.
export function describirContenido(producto: Product) {
  return `${producto.contenido.toLocaleString("es-CL")} ${producto.unidad} · ${producto.tamano}`;
}
