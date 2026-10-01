/**
 * COMPARACIÓN SELECCIONADA: recibe IDs y un callback; consulta sus productos en el contexto.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

import PriceComparison from "@/components/PriceComparison";
import { useCatalog } from "@/store/CatalogProvider";
import ProductMetadata from "@/components/ProductMetadata";
import { sumarPrecios } from "@/store/product-comparison";

export default function ProductComparison({
  seleccionados,
  onSeleccionar,
}: {
  seleccionados: number[];
  onSeleccionar: (id: number) => void;
}) {
  const { productos } = useCatalog();
  // filter cruza selección y catálogo actual para mostrar siempre los datos vigentes.
  const elegidos = productos.filter((producto) =>
    seleccionados.includes(producto.id),
  );
  // Sin productos no necesita dibujar contenido; return null omite este bloque.
  if (elegidos.length === 0) return null;
  // Cada botón comunica el ID al padre mediante onSeleccionar.
  // Con dos productos, sumarPrecios calcula la compra conjunta por tienda.
  // No suma los ahorros individuales: compara comprar ambos en Líder frente a ambos en Unimarc.
  return (
    <View className="gap-3">
      <Text
        accessibilityRole="header"
        className="text-lg font-work-medium text-slate-800"
      >
        Tu comparación
      </Text>
      {elegidos.map((producto) => (
        <View
          key={producto.id}
          className="rounded-2xl border border-teal-100 bg-white p-4"
        >
          <View className="mb-3 flex-row items-center gap-2">
            <Text className="flex-1 text-base font-work-medium text-slate-800">
              {producto.nombre}
            </Text>
            <Pressable
              onPress={() => onSeleccionar(producto.id)}
              accessibilityRole="button"
              accessibilityLabel={`Quitar ${producto.nombre}`}
              className="min-h-11 min-w-11 items-center justify-center rounded-full bg-slate-50"
            >
              <Ionicons name="close" size={20} color="#64748b" />
            </Pressable>
          </View>
          <ProductMetadata producto={producto} />
          <PriceComparison precios={producto.precios} />
        </View>
      ))}
      {elegidos.length === 2 && (
        <View className="rounded-2xl border border-teal-200 bg-white p-4">
          <Text
            accessibilityRole="header"
            className="mb-2 text-lg font-work-medium text-slate-800"
          >
            Total de los 2 productos
          </Text>
          <Text className="mb-3 text-xs text-slate-500">
            Comprando ambos en un solo supermercado.
          </Text>
          <PriceComparison precios={sumarPrecios(elegidos)} total />
        </View>
      )}
    </View>
  );
}
