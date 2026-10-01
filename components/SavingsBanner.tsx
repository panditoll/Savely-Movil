/**
 * BANNER DE OFERTAS: presenta ahorro, cantidad y periodo recibidos desde LocalOffers.
 * No calcula el ahorro: separa la presentación de la lógica de ofertas.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { formatearPesos } from "@/store/product-comparison";

export default function SavingsBanner({
  ahorro,
  cantidad,
  periodo,
}: {
  ahorro: number;
  cantidad: number;
  periodo: "hoy" | "semana";
}) {
  // Estado local que abre o cierra la explicación del importe.
  const [info, setInfo] = useState(false);
  // El botón cambia info con una actualización funcional. El bloque opcional explica la fórmula.
  // La suma representa diferencias entre tiendas para productos visibles, no descuentos históricos.
  // La imagen es local y el importe adapta su tamaño para caber en el espacio disponible.
  return (
    <View className="overflow-hidden rounded-2xl bg-cyan-700 p-4">
      <View className="flex-row items-center gap-1">
        <Text className="flex-shrink text-sm font-work-medium text-white">
          Ahorro potencial {periodo === "hoy" ? "hoy" : "esta semana"}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cómo se calcula el ahorro"
          accessibilityState={{ expanded: info }}
          onPress={() => setInfo((v) => !v)}
          className="min-h-11 min-w-11 items-center justify-center"
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#cffafe"
          />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            className="text-4xl font-work-black text-white"
          >
            {formatearPesos(ahorro)}
          </Text>
          <Text className="mt-2 text-sm leading-5 text-cyan-50">
            En {cantidad} {cantidad === 1 ? "producto" : "productos"} en oferta
          </Text>
        </View>
        <Image
          source={require("../assets/images/savely-logo.png")}
          accessibilityLabel="Bolsa de compras y moneda de ahorro de Savely"
          resizeMode="contain"
          style={{ width: "32%", height: 100 }}
        />
      </View>
      {info && (
        <Text className="mt-3 text-xs leading-5 text-white">
          Sumamos la diferencia entre Líder y Unimarc para una unidad de cada
          producto visible, eligiendo su menor precio. La distancia filtra la
          tienda más barata. Es una comparación entre tiendas, no un descuento
          histórico. Datos y disponibilidad simulados.
        </Text>
      )}
    </View>
  );
}
