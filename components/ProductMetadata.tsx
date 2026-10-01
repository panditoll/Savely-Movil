/**
 * METADATOS: muestra categoría, contenido, presentación, descripción y precio por unidad.
 */
import { Text, View } from "react-native";
import type { Product } from "@/models/Product";
import {
  describirContenido,
  precioPorUnidad,
  formatearPesos,
} from "@/store/product-comparison";

export default function ProductMetadata({ producto }: { producto: Product }) {
  // Reutiliza el cálculo puro; gramos se expresan por kg y mililitros por L.
  const normalizado = precioPorUnidad(producto);
  // El formateo redondea para mostrar pesos; el cálculo conserva su precisión numérica.
  return (
    <View className="mb-3 gap-1">
      <Text className="text-sm text-slate-600">
        {producto.categoria} · {describirContenido(producto)}
      </Text>
      <Text className="text-sm text-slate-600">{producto.descripcion}</Text>
      <Text className="text-xs leading-5 text-teal-700">
        Por {normalizado.unidad}: Líder {formatearPesos(normalizado.lider)} ·
        Unimarc {formatearPesos(normalizado.unimarc)}
      </Text>
      <Text className="text-xs text-slate-500">
        Precio unitario redondeado. Compara productos equivalentes.
      </Text>
    </View>
  );
}
