/**
 * DISTINTIVO DE TIENDA: recibe un Supermercado y reutiliza el mismo diseño en tablas y tarjetas.
 */
import { Text, View } from "react-native";

import type { Supermercado } from "@/models/Product";

export default function StoreBadge({
  supermercado,
}: {
  supermercado: Supermercado;
}) {
  // Un ternario elige azul para Líder y rojo para Unimarc; las clases completas permiten detectar estilos.
  return (
    <View
      className={`self-start rounded-lg px-2 py-1 ${supermercado === "Líder" ? "bg-blue-600" : "bg-red-600"}`}
    >
      <Text className="text-xs font-work-medium text-white">
        {supermercado}
      </Text>
    </View>
  );
}
