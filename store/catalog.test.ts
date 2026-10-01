/**
 * PRUEBAS DE LÓGICA: node:test organiza casos y assert compara resultados esperados.
 * Verifica CRUD inmutable, validaciones, lectura del JSON, precio por unidad y filtros de ofertas.
 * No monta pantallas ni prueba directamente AsyncStorage; package.json no define un script test.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { productos } from "./products.store";
import {
  eliminarProducto,
  guardarProducto,
  leerCatalogo,
  validarProducto,
  type CatalogState,
} from "./catalog";
import { filtrarOfertas, ahorroOfertas } from "./offers";
import { precioPorUnidad, resumirCategoria } from "./product-comparison";

// Estado de partida del test: catálogo semilla, lista de dos IDs y próximo ID 19.
const inicial: CatalogState = { productos, lista: [1, 2], siguienteId: 19, versionImagenes: 1 };
test("CRUD: crea, actualiza totales, elimina y limpia la lista sin mutar el catálogo", () => {
  const creado = guardarProducto(inicial, {
    ...productos[0],
    nombre: "Leche nueva",
  });
  assert.equal(creado.productos.length, 19);
  assert.equal(creado.productos.at(-1)?.id, 19);
  assert.equal(inicial.productos.length, 18);
  const editado = guardarProducto(
    creado,
    { ...productos[0], precios: { lider: 100, unimarc: 200 } },
    1,
  );
  assert.equal(editado.productos.length, 19);
  assert.equal(
    resumirCategoria(editado.productos, "Alimentos").totales.lider,
    9640,
  );
  const borrado = eliminarProducto(editado, 1);
  assert.equal(
    borrado.productos.some((p) => p.id === 1),
    false,
  );
  assert.deepEqual(borrado.lista, [2]);
  assert.throws(() => guardarProducto(borrado, productos[0], 1));
  assert.equal(guardarProducto(borrado, productos[0]).productos.at(-1)?.id, 20);
});

test("imágenes: migra la manzana antigua sin perder catálogo, precios ni lista", () => {
  const antiguo = { productos: productos.map((p) => ({ ...p, imagen: "manzana" })), lista: [1, 2], siguienteId: 19 };
  const migrado = leerCatalogo(JSON.stringify(antiguo));
  assert.deepEqual(migrado.productos.map((p) => p.imagen), productos.map((p) => p.imagen));
  assert.deepEqual(migrado.lista, antiguo.lista);
  assert.equal(migrado.siguienteId, 19);
  assert.deepEqual(migrado.productos.map(({ imagen, ...p }) => p), antiguo.productos.map(({ imagen, ...p }) => p));
  assert.equal(migrado.versionImagenes, 1);
});

test("imágenes: conserva una elección manual al editar y recargar", () => {
  const editado = guardarProducto(inicial, { ...productos[0], imagen: "manzana" }, 1);
  assert.equal(leerCatalogo(JSON.stringify(editado)).productos[0].imagen, "manzana");
  assert.throws(() => leerCatalogo(JSON.stringify({ ...inicial, productos: [{ ...productos[0], imagen: "no-existe" }] })));
});

test("imágenes: crear sin selección sugiere la imagen por nombre", () => {
  const { imagen, ...input } = productos[0];
  assert.equal(guardarProducto(inicial, input).productos.at(-1)?.imagen, "leche");
});
test("validaciones: campos vacíos, precios negativos o decimales y contenido inválido", () => {
  assert.equal(validarProducto(productos[0]), null);
  for (const cambio of [
    { nombre: " " },
    { descripcion: "" },
    { tamano: "" },
    { contenido: 0 },
    { contenido: Infinity },
    { precios: { lider: 1.5, unimarc: 100 } },
    { precios: { lider: -1, unimarc: 100 } },
  ])
    assert.ok(validarProducto({ ...productos[0], ...cambio }));
});
test("almacenamiento: conserva todos los campos y rechaza datos corruptos", () => {
  assert.deepEqual(leerCatalogo(JSON.stringify(inicial)), inicial);
  assert.throws(() => leerCatalogo("no es json"));
  assert.throws(() =>
    leerCatalogo(JSON.stringify({ ...inicial, lista: [999] })),
  );
  assert.throws(() =>
    leerCatalogo(
      JSON.stringify({ ...inicial, productos: [productos[0], productos[0]] }),
    ),
  );
  assert.throws(() =>
    leerCatalogo(JSON.stringify({ ...inicial, siguienteId: 1 })),
  );
});
test("precio unitario: convierte gramos y mililitros y mantiene kilos, litros y unidades", () => {
  assert.deepEqual(
    precioPorUnidad({
      ...productos[0],
      contenido: 500,
      unidad: "ml",
      precios: { lider: 1000, unimarc: 1500 },
    }),
    { unidad: "L", lider: 2000, unimarc: 3000 },
  );
  assert.deepEqual(
    precioPorUnidad({
      ...productos[0],
      contenido: 250,
      unidad: "g",
      precios: { lider: 1000, unimarc: 1500 },
    }),
    { unidad: "kg", lider: 4000, unimarc: 6000 },
  );
  assert.equal(precioPorUnidad(productos[1]).lider, 1490);
  assert.equal(precioPorUnidad(productos[7]).lider, 3290 / 12);
});
test("ofertas: periodo, radio y lista se combinan y cambian el ahorro", () => {
  const filtros = { radio: 2, periodo: "hoy" as const, soloLista: false };
  assert.equal(filtrarOfertas(productos, [], filtros).length, 12);
  assert.equal(
    filtrarOfertas(productos, [], { ...filtros, periodo: "semana" }).length,
    18,
  );
  const cercanos = filtrarOfertas(productos, [], { ...filtros, radio: 0.5 });
  assert.ok(cercanos.every((p) => p.precios.lider < p.precios.unimarc));
  assert.equal(
    filtrarOfertas(productos, [], { ...filtros, soloLista: true }).length,
    0,
  );
  const lista = filtrarOfertas(productos, [1, 2, 3], {
    ...filtros,
    soloLista: true,
  });
  assert.deepEqual(
    lista.map((p) => p.id),
    [1, 2],
  );
  assert.equal(ahorroOfertas(lista), 300);
  assert.equal(ahorroOfertas([]), 0);
  assert.equal(
    filtrarOfertas([{ ...productos[0], oferta: "ninguna" }], [], filtros)
      .length,
    0,
  );
});
