/**
 * TABLA DE PRECIOS: presenta productos, precios por tienda y valores normalizados por unidad.
 * Puede reutilizarse con selección interactiva o sin ella según la prop onSeleccionar.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import ProductImage from "@/components/ProductImage";
import StoreBadge from "@/components/StoreBadge";
import type { Product } from "@/models/Product";
import {
  compararPrecios,
  formatearPesos,
  describirContenido,
  precioPorUnidad,
} from "@/store/product-comparison";

// La selección y el callback son opcionales; el listado de productos siempre es necesario.
interface Props {
  productos: Product[];
  seleccionados?: number[];
  onSeleccionar?: (id: number) => void;
}

export default function ProductPriceTable({
  productos,
  seleccionados = [],
  onSeleccionar,
}: Props) {
  // Hook de dimensiones: adapta la disposición cuando la ventana tiene menos de 380 de ancho.
  const compacto = useWindowDimensions().width < 380;
  // map genera filas identificadas por ID. Se destaca el menor precio sin alterar los datos.
  // Si existe onSeleccionar se dibuja un control de selección; los roles accesibles describen su estado.
  return (
    <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <View className="flex-row border-b border-slate-200 bg-slate-50">
        <View className="w-[44%] justify-center p-3">
          <Text className="text-sm font-work-medium text-slate-800">
            Producto
          </Text>
        </View>
        <View className="w-[28%] items-center justify-center border-l border-slate-200 py-4">
          <StoreBadge supermercado="Líder" />
        </View>
        <View className="w-[28%] items-center justify-center border-l border-slate-200 py-4">
          <StoreBadge supermercado="Unimarc" />
        </View>
      </View>
      {productos.map((producto) => {
        // Cálculos derivados de cada fila: comparación y precio por kg, L o unidad.
        const comparacion = compararPrecios(producto.precios);
        const normalizado = precioPorUnidad(producto);
        const seleccionado = seleccionados.includes(producto.id);
        // Si ya hay dos seleccionados, bloquea nuevos; permite quitar los seleccionados.
        // La función de selección del padre aplica también este límite.
        const deshabilitado = seleccionados.length >= 2 && !seleccionado;
        return (
          <View key={producto.id} className="border-b border-slate-100">
            <View className="flex-row">
              <Link
                href={{
                  pathname: "/products/detail",
                  params: { id: producto.id },
                }}
                asChild
              >
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={`Ver detalle de ${producto.nombre}`}
                  className={`w-[44%] gap-2 px-2 py-4 active:bg-slate-50 ${compacto ? "items-start" : "flex-row items-center"}`}
                >
                  <View className="w-10">
                    <ProductImage producto={producto} mini />
                  </View>
                  <View className={compacto ? "w-full" : "flex-1"}>
                    <Text className="text-xs font-work-medium text-slate-800">
                      {producto.nombre}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-500">
                      {describirContenido(producto)}
                    </Text>
                  </View>
                </Pressable>
              </Link>
              {(
                [
                  { clave: "lider", nombre: "Líder" },
                  { clave: "unimarc", nombre: "Unimarc" },
                ] as const
              ).map((tienda) => {
                const mejor = comparacion.mejorSupermercado === tienda.nombre;
                return (
                  <View
                    key={tienda.clave}
                    className={`w-[28%] items-center justify-center border-l border-slate-100 px-1 py-4 ${mejor ? "bg-teal-50" : "bg-white"}`}
                  >
                    <Text
                      className={`text-sm font-work-medium ${mejor ? "text-teal-700" : "text-slate-800"}`}
                    >
                      {formatearPesos(producto.precios[tienda.clave])}
                    </Text>
                    <Text className="mt-1 text-center text-xs text-slate-500">
                      {formatearPesos(normalizado[tienda.clave])}/
                      {normalizado.unidad}
                    </Text>
                    {mejor && (
                      <Text className="mt-1 text-xs text-teal-700">
                        Menor precio
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
            <View className="flex-row items-center gap-2 bg-slate-50 px-3 py-2">
              <View className="flex-1">
                <Text className="text-xs text-slate-600">
                  {comparacion.mejorSupermercado
                    ? "Mejor: " + comparacion.mejorSupermercado
                    : "Mismo precio"}
                </Text>
                <Text className="mt-1 text-xs font-work-medium text-teal-700">
                  Ahorras {formatearPesos(comparacion.ahorro)}
                </Text>
              </View>
              {onSeleccionar && (
                <Pressable
                  onPress={() => onSeleccionar(producto.id)}
                  disabled={deshabilitado}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`Seleccionar ${producto.nombre}`}
                  accessibilityState={{
                    checked: seleccionado,
                    disabled: deshabilitado,
                  }}
                  aria-checked={seleccionado}
                  className={`min-h-11 min-w-11 items-center justify-center rounded-xl border px-3 ${seleccionado ? "border-teal-700 bg-teal-700" : "border-teal-200 bg-white"} ${deshabilitado ? "opacity-40" : ""}`}
                >
                  <Ionicons
                    name={seleccionado ? "checkmark" : "add"}
                    size={22}
                    color={seleccionado ? "white" : "#0f766e"}
                  />
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
