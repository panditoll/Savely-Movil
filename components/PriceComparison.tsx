/**
 * PRESENTACIÓN DE PRECIOS: el mismo componente recibe un producto o totales de varios.
 * La prop total cambia las etiquetas; el cálculo sigue comparando los dos valores recibidos.
 */
import { Text, View } from "react-native";

import type { Precios } from "@/models/Product";
import { compararPrecios, formatearPesos } from "@/store/product-comparison";

export default function PriceComparison({
  precios,
  total = false,
}: {
  precios: Precios;
  total?: boolean;
}) {
  // Compara los precios mediante una función pura; un empate devuelve null y ahorro cero.
  const { mejorSupermercado, ahorro } = compararPrecios(precios);

  // Muestra ambos precios y su diferencia. Para totales esto supone comprar todo en una misma tienda.
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap justify-between gap-2">
        <Text className="text-base text-slate-600">
          Líder{total ? " total" : ""}
        </Text>
        <Text className="text-base font-work-medium text-slate-800">
          {formatearPesos(precios.lider)}
        </Text>
      </View>
      <View className="flex-row flex-wrap justify-between gap-2">
        <Text className="text-base text-slate-600">
          Unimarc{total ? " total" : ""}
        </Text>
        <Text className="text-base font-work-medium text-slate-800">
          {formatearPesos(precios.unimarc)}
        </Text>
      </View>
      <View className="rounded-2xl bg-teal-50 p-3">
        <Text className="text-sm font-work-medium text-teal-800">
          {mejorSupermercado
            ? "Mejor precio: " + mejorSupermercado
            : "Mismo precio en ambos supermercados"}
        </Text>
        <Text className="mt-1 text-lg font-work-medium text-teal-700">
          Ahorras {formatearPesos(ahorro)}
        </Text>
      </View>
    </View>
  );
}
