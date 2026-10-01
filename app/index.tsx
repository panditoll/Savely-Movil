/**
 * PANTALLA INICIO: ruta /. Combina encabezado, ofertas y resúmenes por categoría.
 * La pantalla deriva sus valores del catálogo compartido para reflejar altas, ediciones y eliminaciones.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import CategoryIcon from "@/components/CategoryIcon";
import Header from "@/components/Header";
import LocalOffers from "@/components/LocalOffers";
import { useCatalog } from "@/store/CatalogProvider";
import { formatearPesos, resumirCategoria } from "@/store/product-comparison";
import { categorias } from "@/store/products.store";

export default function HomeScreen() {
  // Lee el catálogo actual del contexto, no directamente la semilla de products.store.
  const { productos } = useCatalog();

  // ScrollView permite desplazamiento; max-w-2xl limita el ancho en web.
  // LocalOffers reúne filtros y banner. Las categorías usan map y key para generar enlaces únicos.
  // resumirCategoria calcula el ahorro de comprar la categoría completa en una tienda.
  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-6">
      <View className="mx-auto w-full max-w-2xl px-4 pt-4">
        <Header />
        <LocalOffers />
        <Link
          href="/products"
          className="mt-4 rounded-xl bg-teal-50 p-4 text-center text-teal-800"
        >
          Gestionar productos
        </Link>
        <View className="mb-3 mt-5 flex-row items-center justify-between gap-2">
          <Text
            accessibilityRole="header"
            className="flex-1 text-lg font-work-medium text-slate-800"
          >
            Mejor por categoría
          </Text>
          <Link href="/compare/categories" asChild>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Ver todas las categorías"
              className="min-h-11 justify-center"
            >
              <Text className="text-xs font-work-medium text-teal-700">
                Ver todas ›
              </Text>
            </Pressable>
          </Link>
        </View>
        <View className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
          {categorias.map((categoria) => {
            const categoriaResumen = resumirCategoria(productos, categoria);
            return (
              <Link
                key={categoria}
                href={{
                  pathname: "/compare/categories/[categoria]",
                  params: { categoria: categoria.toLowerCase() },
                }}
                asChild
              >
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={`Ver categoría ${categoria}`}
                  className="min-h-16 flex-row items-center gap-3 border-b border-slate-100 px-3 py-3 active:bg-teal-50"
                >
                  <CategoryIcon categoria={categoria} />
                  <Text className="flex-1 text-sm font-work-medium text-slate-800">
                    {categoria}
                  </Text>
                  <Text className="text-xs text-teal-700">
                    Ahorras {formatearPesos(categoriaResumen.ahorro)}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#64748b" />
                </Pressable>
              </Link>
            );
          })}
        </View>
        <Text className="mt-4 text-center text-xs leading-5 text-slate-500">
          Precios ficticios · Una unidad de cada producto · Valores en CLP
        </Text>
      </View>
    </ScrollView>
  );
}
