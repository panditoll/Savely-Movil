/**
 * RESUMEN POR CATEGORÍAS: compara comprar una unidad de cada producto en una tienda.
 * También presenta el promedio aritmético de las diferencias de las cinco categorías.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import CategoryIcon from "@/components/CategoryIcon";
import SavingsCard from "@/components/SavingsCard";
import StoreBadge from "@/components/StoreBadge";
import type { Supermercado } from "@/models/Product";
import { useCatalog } from "@/store/CatalogProvider";
import { categorias } from "@/store/products.store";
import {
  calcularAhorroPromedio,
  formatearPesos,
  resumirCategoria,
} from "@/store/product-comparison";

export default function CategoryComparison() {
  // Consume el catálogo actual: las modificaciones se reflejan en categorías y promedio.
  const { productos } = useCatalog();
  // SavingsCard recibe el promedio por props. map genera un enlace por categoría.
  // resumirCategoria calcula totales y ordena visualmente la tienda con menor total.
  // Un empate se etiqueta como tal; el orden visual no representa una ventaja en ese caso.
  return (
    <View>
      <SavingsCard
        titulo="Ahorro promedio por categoría"
        ahorro={calcularAhorroPromedio(productos, categorias)}
        descripcion="Promedio de las diferencias entre comprar cada categoría en Líder o Unimarc."
      />
      <View className="mb-3 mt-5 flex-row px-3">
        <Text className="w-1/3 text-xs text-slate-500">Categoría</Text>
        <Text className="w-1/3 text-xs text-slate-500">Mejor opción</Text>
        <Text className="w-1/3 text-xs text-slate-500">2da opción</Text>
      </View>
      <View className="gap-3">
        {categorias.map((categoria) => {
          const resumen = resumirCategoria(productos, categoria);
          const orden: Supermercado[] =
            resumen.mejorSupermercado === "Unimarc"
              ? ["Unimarc", "Líder"]
              : ["Líder", "Unimarc"];
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
                className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm active:bg-teal-50"
              >
                <View className="flex-row items-center">
                  <View className="w-1/3 gap-2 pr-2">
                    <CategoryIcon categoria={categoria} />
                    <Text className="text-sm font-work-medium text-slate-800">
                      {categoria}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      {resumen.productos.length} productos
                    </Text>
                  </View>
                  {orden.map((tienda, indice) => (
                    <View
                      key={tienda}
                      className={`w-1/3 gap-2 px-2 ${indice === 1 ? "border-l border-slate-100" : ""}`}
                    >
                      <StoreBadge supermercado={tienda} />
                      <Text className="text-sm font-work-medium text-slate-800">
                        {formatearPesos(
                          tienda === "Líder"
                            ? resumen.totales.lider
                            : resumen.totales.unimarc,
                        )}
                      </Text>
                      <Text
                        className={`text-xs ${indice === 0 ? "text-teal-700" : "text-slate-500"}`}
                      >
                        {indice === 0
                          ? resumen.mejorSupermercado
                            ? "Menor total"
                            : "Empate"
                          : "Total categoría"}
                      </Text>
                    </View>
                  ))}
                </View>
                <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 pt-2">
                  <Text className="text-xs font-work-medium text-teal-700">
                    Ahorras {formatearPesos(resumen.ahorro)} en esta categoría
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#64748b" />
                </View>
              </Pressable>
            </Link>
          );
        })}
      </View>
      <View className="mt-4 flex-row items-start gap-2 rounded-2xl bg-teal-50 p-4">
        <Ionicons name="information-circle-outline" size={22} color="#0f766e" />
        <Text className="flex-1 text-xs leading-5 text-slate-600">
          Sumamos una unidad de cada producto por tienda. El ahorro promedio es
          la suma de las diferencias de las {categorias.length} categorías
          dividida entre {categorias.length}. Precios ficticios.
        </Text>
      </View>
    </View>
  );
}
