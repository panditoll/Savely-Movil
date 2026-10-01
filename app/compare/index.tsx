/**
 * PANTALLA COMPARAR: búsqueda por nombre, filtro por categoría y selección de hasta dos productos.
 * La selección y los filtros son estado temporal; el catálogo proviene del contexto.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { useCatalog } from "@/store/CatalogProvider";

import Header from "@/components/Header";
import ProductComparison from "@/components/ProductComparison";
import ProductPriceTable from "@/components/ProductPriceTable";
import type { Categoria } from "@/models/Product";
import {
  alternarSeleccion,
  compararPrecios,
  filtrarProductos,
  sumarPrecios,
} from "@/store/product-comparison";
import { categorias } from "@/store/products.store";

export default function CompareScreen() {
  const { productos } = useCatalog();
  // Parámetro opcional que permite entrar desde el detalle con un producto preseleccionado.
  const { productoId } = useLocalSearchParams<{
    productoId?: string | string[];
  }>();
  // Comprueba que el parámetro sea un string y corresponda a un producto existente.
  const id =
    typeof productoId === "string"
      ? productos.find((p) => String(p.id) === productoId)?.id
      : undefined;
  // Cambiar esta key remonta el componente para reiniciar su estado según el producto inicial.
  return <ComparisonContent key={id ?? "sin-producto"} productoInicial={id} />;
}

// Componente con estado local separado de la lectura del parámetro de ruta.
function ComparisonContent({ productoInicial }: { productoInicial?: number }) {
  const { productos } = useCatalog();
  // Campos controlados: el texto, categoría y IDs seleccionados viven en useState.
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "Todas">("Todas");
  const [idsSeleccionados, setSeleccionados] = useState<number[]>(
    productoInicial ? [productoInicial] : [],
  );
  // Ignora IDs de productos eliminados para no mostrar selecciones obsoletas.
  const seleccionados = idsSeleccionados.filter((id) =>
    productos.some((p) => p.id === id),
  );
  // Resultados derivados: se calculan a partir del catálogo, búsqueda y categoría sin duplicar estado.
  const filtrados = filtrarProductos(productos, busqueda, categoria);
  // Compara el total de todos los resultados filtrados; la comparación elegida aparece aparte.
  const mejor = compararPrecios(sumarPrecios(filtrados)).mejorSupermercado;
  // Actualización funcional: recibe los IDs anteriores, limpia borrados y aplica el límite de dos.
  function seleccionar(id: number) {
    setSeleccionados((actuales) =>
      alternarSeleccion(
        actuales.filter((item) => productos.some((p) => p.id === item)),
        id,
      ),
    );
  }

  // TextInput conecta value y onChangeText. Los filtros cambian el estado con onPress.
  // ProductComparison muestra los seleccionados y ProductPriceTable ofrece botones para elegirlos.
  // Los ternarios y && muestran mensajes, selección y estados vacíos según los resultados.
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="pb-6"
    >
      <View className="mx-auto w-full max-w-2xl px-4 pt-4">
        <Header titulo="Comparar productos" />
        <Link href="/products" className="mb-4 py-2 text-teal-700">
          Gestionar catálogo ›
        </Link>
        <View className="mb-4 flex-row items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-sm">
          <Ionicons name="search-outline" size={22} color="#64748b" />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            accessibilityLabel="Buscar productos"
            placeholder="Buscar un producto"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            className="min-h-14 flex-1 px-3 text-base text-slate-800"
          />
          {busqueda.length > 0 && (
            <Pressable
              onPress={() => setBusqueda("")}
              accessibilityRole="button"
              accessibilityLabel="Limpiar búsqueda"
              className="min-h-11 min-w-11 items-center justify-center"
            >
              <Ionicons name="close-circle" size={22} color="#94a3b8" />
            </Pressable>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 pb-3"
          className="mb-2"
        >
          {(["Todas", ...categorias] as const).map((opcion) => (
            <Pressable
              key={opcion}
              onPress={() => setCategoria(opcion)}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar ${opcion}`}
              accessibilityState={{ selected: categoria === opcion }}
              aria-pressed={categoria === opcion}
              className={`min-h-11 justify-center rounded-full border px-4 py-3 ${categoria === opcion ? "border-teal-700 bg-teal-700" : "border-slate-200 bg-white"}`}
            >
              <Text
                className={`text-sm font-work-medium ${categoria === opcion ? "text-white" : "text-slate-500"}`}
              >
                {opcion}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Link href="/compare/categories" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Mejor por categoría"
            className="mb-4 flex-row items-center justify-between rounded-2xl border border-teal-100 bg-teal-50 p-4"
          >
            <View className="flex-1">
              <Text className="text-sm font-work-medium text-teal-800">
                Mejor por categoría
              </Text>
              <Text className="mt-1 text-xs text-slate-500">
                Descubre dónde conviene comprar.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#0f766e" />
          </Pressable>
        </Link>
        {filtrados.length > 0 && (
          <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-teal-100 bg-white p-4">
            <Ionicons name="ribbon-outline" size={28} color="#0f766e" />
            <Text className="flex-1 text-sm leading-5 text-slate-700">
              {mejor
                ? mejor + " tiene el menor total"
                : "Ambos supermercados tienen el mismo total"}{" "}
              en estos {filtrados.length} productos.
            </Text>
          </View>
        )}
        <Text
          accessibilityLiveRegion="polite"
          className="mb-3 text-xs leading-5 text-slate-500"
        >
          {filtrados.length}{" "}
          {filtrados.length === 1 ? "resultado" : "resultados"} ·{" "}
          {seleccionados.length}/2 seleccionados.{" "}
          {seleccionados.length === 2
            ? "Quita uno para elegir otro."
            : "Usa + para comparar."}
        </Text>
        {seleccionados.length > 0 && (
          <View className="mb-4">
            <ProductComparison
              seleccionados={seleccionados}
              onSeleccionar={seleccionar}
            />
          </View>
        )}
        {filtrados.length > 0 ? (
          <ProductPriceTable
            productos={filtrados}
            seleccionados={seleccionados}
            onSeleccionar={seleccionar}
          />
        ) : (
          <View className="rounded-2xl border border-slate-100 bg-white p-6">
            <Text className="text-center text-base font-work-medium text-slate-800">
              No encontramos productos
            </Text>
            <Text className="mt-2 text-center text-sm text-slate-500">
              Prueba otro nombre o cambia la categoría.
            </Text>
          </View>
        )}
        <Text className="mt-4 text-center text-xs leading-5 text-slate-500">
          Precios ficticios en CLP · Una unidad de cada producto.
        </Text>
      </View>
    </ScrollView>
  );
}
