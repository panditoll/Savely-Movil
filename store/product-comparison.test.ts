/**
 * PRUEBAS DE CÁLCULOS: comprueba datos iniciales, empates, totales, promedio, selección y búsqueda.
 * Los valores esperados son ejemplos útiles para explicar las fórmulas en una evaluación oral.
 * El nombre antiguo de un test menciona Inicio, pero calcularAhorroCompra no alimenta el banner actual.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { categorias, productos } from "./products.store";
import {
  alternarSeleccion,
  calcularAhorroCompra,
  calcularAhorroPromedio,
  compararPrecios,
  formatearPesos,
  filtrarProductos,
  resumirCategoria,
  sumarPrecios,
} from "./product-comparison";

test("catálogo: 18 IDs únicos, cantidades por categoría y dos precios válidos", () => {
  assert.equal(productos.length, 18);
  assert.equal(new Set(productos.map((p) => p.id)).size, 18);
  assert.deepEqual(
    categorias.map((c) => productos.filter((p) => p.categoria === c).length),
    [6, 3, 3, 3, 3],
  );
  assert.ok(
    productos.every(
      (p) =>
        Number.isInteger(p.precios.lider) &&
        p.precios.lider > 0 &&
        Number.isInteger(p.precios.unimarc) &&
        p.precios.unimarc > 0,
    ),
  );
  assert.ok(productos.some((p) => p.precios.lider < p.precios.unimarc));
  assert.ok(productos.some((p) => p.precios.unimarc < p.precios.lider));
});

test("precio menor, ahorro y empate", () => {
  assert.deepEqual(compararPrecios({ lider: 1490, unimarc: 1690 }), {
    mejorSupermercado: "Líder",
    precioMenor: 1490,
    ahorro: 200,
  });
  assert.deepEqual(compararPrecios({ lider: 1690, unimarc: 1490 }), {
    mejorSupermercado: "Unimarc",
    precioMenor: 1490,
    ahorro: 200,
  });
  assert.deepEqual(compararPrecios({ lider: 1490, unimarc: 1490 }), {
    mejorSupermercado: null,
    precioMenor: 1490,
    ahorro: 0,
  });
  assert.equal(formatearPesos(1490), "$1.490");
});

test("total conjunto elige una tienda, no suma los ahorros individuales", () => {
  const seleccion = productos.filter((p) => [2, 5].includes(p.id));
  assert.deepEqual(sumarPrecios(seleccion), { lider: 5780, unimarc: 5680 });
  assert.equal(
    compararPrecios(sumarPrecios(seleccion)).mejorSupermercado,
    "Unimarc",
  );
  assert.equal(compararPrecios(sumarPrecios(seleccion)).ahorro, 100);
  const empate = productos.filter((p) => [1, 3].includes(p.id));
  assert.equal(compararPrecios(sumarPrecios(empate)).mejorSupermercado, null);
  assert.deepEqual(sumarPrecios([]), { lider: 0, unimarc: 0 });
});

test("totales de cada categoría y promedio aritmético de las cinco", () => {
  assert.deepEqual(
    categorias.map((c) => resumirCategoria(productos, c).totales),
    [
      { lider: 9540, unimarc: 9840 },
      { lider: 3870, unimarc: 3970 },
      { lider: 7770, unimarc: 7470 },
      { lider: 6670, unimarc: 7070 },
      { lider: 4870, unimarc: 4770 },
    ],
  );
  assert.deepEqual(
    categorias.map((c) => resumirCategoria(productos, c).ahorro),
    [300, 100, 300, 400, 100],
  );
  assert.equal(calcularAhorroPromedio(productos, categorias), 240);
  assert.equal(calcularAhorroPromedio(productos, []), 0);
});

test("selección: límite de dos, quitar y reemplazar, sin mutar el estado anterior", () => {
  const inicial: number[] = [];
  const uno = alternarSeleccion(inicial, 1);
  const dos = alternarSeleccion(uno, 2);
  assert.deepEqual(inicial, []);
  assert.deepEqual(uno, [1]);
  assert.deepEqual(dos, [1, 2]);
  assert.deepEqual(alternarSeleccion(dos, 3), [1, 2]);
  const quitado = alternarSeleccion(dos, 1);
  assert.deepEqual(quitado, [2]);
  assert.deepEqual(alternarSeleccion(quitado, 3), [2, 3]);
  assert.deepEqual(alternarSeleccion([2], 2), []);
});

test("ahorro de Inicio compara los mejores precios con la tienda de menor total", () => {
  assert.deepEqual(calcularAhorroCompra(productos), {
    totales: { lider: 32720, unimarc: 33120 },
    totalUnaTienda: 32720,
    totalMejoresPrecios: 31220,
    ahorro: 1500,
  });
  assert.equal(calcularAhorroCompra([]).ahorro, 0);
  assert.equal(calcularAhorroCompra([productos[0]]).ahorro, 0);
});

test("buscador y categoría se combinan, sin distinguir tildes o mayúsculas", () => {
  assert.deepEqual(
    filtrarProductos(productos, "  PLATANOS ", "Alimentos").map((p) => p.id),
    [3],
  );
  assert.deepEqual(
    filtrarProductos(productos, "jugo", "Bebidas").map((p) => p.id),
    [10],
  );
  assert.deepEqual(filtrarProductos(productos, "arroz", "Hogar"), []);
  assert.deepEqual(filtrarProductos(productos, "inexistente", "Todas"), []);
  assert.equal(filtrarProductos(productos, "", "Todas").length, 18);
  assert.equal(filtrarProductos(productos, "", "Higiene").length, 3);
});
