/**
 * ICONOS POR CATEGORÍA: tabla de correspondencia entre una categoría, un icono y un fondo.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";

import type { Categoria } from "@/models/Product";

// as const conserva los nombres literales que Ionicons acepta.
const estilos = {
  Alimentos: { icono: "nutrition", fondo: "bg-emerald-400" },
  Bebidas: { icono: "water", fondo: "bg-blue-400" },
  Limpieza: { icono: "sparkles", fondo: "bg-teal-400" },
  Higiene: { icono: "leaf", fondo: "bg-violet-400" },
  Hogar: { icono: "home", fondo: "bg-orange-400" },
} as const;

export default function CategoryIcon({ categoria }: { categoria: Categoria }) {
  // La prop Categoria restringe las claves a las opciones presentes en la tabla.
  const estilo = estilos[categoria];
  // Combina utilidades fijas con el fondo de la categoría seleccionada.
  return (
    <View
      className={`h-9 w-9 items-center justify-center rounded-full ${estilo.fondo}`}
    >
      <Ionicons name={estilo.icono} size={20} color="white" />
    </View>
  );
}
