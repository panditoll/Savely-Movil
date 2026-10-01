/**
 * TARJETA DE AHORRO REUTILIZABLE: recibe título, importe, descripción y estadísticas opcionales.
 */
import { Image, Text, View } from "react-native";

import { formatearPesos } from "@/store/product-comparison";

// El signo ? permite omitir estadísticas; los demás datos son obligatorios.
interface Props {
  titulo: string;
  ahorro: number;
  descripcion: string;
  estadisticas?: { valor: number; etiqueta: string }[];
}

export default function SavingsCard({
  titulo,
  ahorro,
  descripcion,
  estadisticas,
}: Props) {
  // Formatea el importe en pesos. Si existen estadísticas, map genera una columna por etiqueta.
  // La tarjeta muestra datos del padre; no consulta ni modifica el catálogo.
  return (
    <View className="overflow-hidden rounded-3xl bg-cyan-700 p-4 shadow-sm">
      <Text className="text-base font-work-medium text-white">{titulo}</Text>
      <View className="mt-2 flex-row items-center gap-2">
        <View className="flex-1">
          <Text className="text-4xl font-work-medium text-white">
            {formatearPesos(ahorro)}
          </Text>
          <Text className="mt-2 text-sm leading-5 text-cyan-50">
            {descripcion}
          </Text>
        </View>
        <Image
          source={require("../assets/images/savely-logo.png")}
          accessibilityLabel="Savely, tu compra más simple"
          resizeMode="contain"
          style={{ width: "34%", height: 112 }}
        />
      </View>
      {estadisticas && (
        <View className="mt-4 flex-row rounded-2xl bg-white py-3">
          {estadisticas.map((item) => (
            <View key={item.etiqueta} className="flex-1 items-center px-1">
              <Text className="text-lg font-work-medium text-slate-800">
                {item.valor}
              </Text>
              <Text className="text-xs text-slate-500">{item.etiqueta}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
