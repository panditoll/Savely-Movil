/**
 * TARJETA DE PRODUCTO: resumen compacto utilizado por las ofertas locales.
 */
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import ProductImage from "@/components/ProductImage";
import StoreBadge from "@/components/StoreBadge";
import type { Product } from "@/models/Product";
import { compararPrecios, formatearPesos } from "@/store/product-comparison";

export default function ProductCard({ producto }: { producto: Product }) {
  // Deriva tienda ganadora, menor precio y diferencia a partir de la prop producto.
  const { mejorSupermercado, precioMenor, ahorro } = compararPrecios(
    producto.precios,
  );
  // Link con asChild hace navegable el Pressable hacia el detalle fijo con su ID.
  // El ternario muestra la tienda de menor precio o un empate; la tarjeta no modifica el catálogo.
  return (
    <Link
      href={{ pathname: "/products/detail", params: { id: producto.id } }}
      asChild
    >
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`Ver detalle de ${producto.nombre}`}
        className="flex-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm active:bg-teal-50"
      >
        {mejorSupermercado ? (
          <StoreBadge supermercado={mejorSupermercado} />
        ) : (
          <Text className="text-xs text-teal-700">Mismo precio</Text>
        )}
        <View className="mt-2">
          <ProductImage producto={producto} />
        </View>
        <Text className="mt-2 text-xs font-work-medium text-slate-800">
          {producto.nombre}
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          {producto.categoria}
        </Text>
        <View className="flex-1" />
        <Text className="mt-2 text-lg font-work-medium text-teal-700">
          {formatearPesos(precioMenor)}
        </Text>
        <Text className="mt-1 text-xs text-teal-700">
          Ahorras {formatearPesos(ahorro)}
        </Text>
        <Text className="mt-2 text-xs font-work-medium text-slate-500">
          Ver detalle ›
        </Text>
      </Pressable>
    </Link>
  );
}
