/**
 * PANTALLA PENDIENTE REUTILIZABLE: presenta un título y el mensaje En proceso.
 */
import { Text, View } from "react-native";

export default function InProgressScreen({ titulo }: { titulo: string }) {
  // La sección Ruta usa este componente; no incluye mapas ni cálculo de recorridos.
  return (
    <View className="mx-auto w-full max-w-3xl flex-1 px-5 pt-6">
      <Text
        accessibilityRole="header"
        className="text-3xl font-work-medium text-slate-800"
      >
        {titulo}
      </Text>
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-work-medium text-slate-500">
          En proceso
        </Text>
      </View>
    </View>
  );
}
