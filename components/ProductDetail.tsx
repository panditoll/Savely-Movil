/**
 * DETALLE Y ACCIONES: busca un producto por el ID de la URL en el catálogo compartido.
 * Reutiliza imagen, metadatos, precios y botón de lista; permite editar, eliminar y comparar.
 */
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import ProductMetadata from "@/components/ProductMetadata";
import ListButton from "@/components/ListButton";
import { useCatalog } from "@/store/CatalogProvider";
import { Pressable, ScrollView, Text, View } from "react-native";

import ProductImage from "@/components/ProductImage";
import Header from "@/components/Header";
import PriceComparison from "@/components/PriceComparison";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { productos, eliminar } = useCatalog();
  // find devuelve el producto o undefined; el JSX maneja ambas situaciones.
  const producto = productos.find((p) => String(p.id) === id);
  // La confirmación de borrado, el estado de operación y el error son estado local de la pantalla.
  const [confirmar, setConfirmar] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  // Espera la eliminación persistida; catalog.ts también quita el ID de la lista.
  // Solo después vuelve al catálogo; si falla muestra error y finally libera el estado ocupado.
  async function borrar() {
    if (!producto) return;
    setOcupado(true);
    setError("");
    try {
      await eliminar(producto.id);
      router.replace("/products");
    } catch {
      setError("No se pudo eliminar. Inténtalo nuevamente.");
    } finally {
      setOcupado(false);
    }
  }

  // Vuelve por historial o utiliza Inicio como respaldo para una apertura directa.
  function volver() {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }

  // El ternario muestra el detalle o Producto no encontrado. confirmar controla la confirmación visible.
  // Editar usa /products/form?id=ID y Comparar envía productoId para iniciar la selección.
  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-6">
      <View className="mx-auto w-full max-w-xl px-5 pt-6">
        <Header />
        {producto ? (
          <View className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <ProductImage producto={producto} grande />
            <Text
              accessibilityRole="header"
              className="mt-6 text-3xl font-work-medium text-slate-800"
            >
              {producto.nombre}
            </Text>
            <View className="mt-5">
              <PriceComparison precios={producto.precios} />
            </View>
            <View className="mt-4">
              <ProductMetadata producto={producto} />
            </View>
            <ListButton id={producto.id} />
            <Link
              href={{ pathname: "/products/form", params: { id: producto.id } }}
              className="mt-4 py-3 text-center text-teal-700"
            >
              Editar producto
            </Link>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmar(true)}
              className="min-h-12 items-center justify-center rounded-xl border border-red-100 p-3"
            >
              <Text className="text-red-700">Eliminar producto</Text>
            </Pressable>
            {confirmar && (
              <View className="mt-3 rounded-xl bg-red-50 p-4">
                <Text className="text-slate-800">
                  ¿Eliminar {producto.nombre}? También se quitará de tu lista.
                  Esta acción no se puede deshacer.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={ocupado}
                  onPress={() => void borrar()}
                  className="mt-3 min-h-12 items-center justify-center rounded-xl bg-red-700 p-3"
                >
                  <Text className="text-white">
                    {ocupado ? "Eliminando…" : "Confirmar eliminación"}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={ocupado}
                  onPress={() => setConfirmar(false)}
                  className="min-h-12 items-center justify-center p-3"
                >
                  <Text className="text-slate-700">Cancelar</Text>
                </Pressable>
                {!!error && (
                  <Text accessibilityRole="alert" className="text-red-700">
                    {error}
                  </Text>
                )}
              </View>
            )}
            <Link
              href={{
                pathname: "/compare",
                params: { productoId: producto.id },
              }}
              asChild
            >
              <Pressable
                accessibilityRole="link"
                className="mt-5 min-h-12 items-center justify-center rounded-2xl bg-teal-700 p-4 active:bg-teal-800"
              >
                <Text className="text-base font-work-medium text-white">
                  Comparar precios
                </Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          <Text
            accessibilityRole="header"
            className="py-12 text-center text-xl font-work-medium text-slate-800"
          >
            Producto no encontrado
          </Text>
        )}
        <Pressable
          onPress={volver}
          accessibilityRole="button"
          className="mt-5 min-h-12 items-center justify-center rounded-2xl bg-teal-700 p-4 active:bg-teal-800"
        >
          <Text className="text-base font-work-medium text-white">Volver</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
