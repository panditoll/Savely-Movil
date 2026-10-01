/**
 * PANTALLA OFERTAS: reutiliza LocalOffers, también mostrado en Inicio.
 * Cada instancia tiene sus propios filtros temporales, pero comparte catálogo y lista.
 */
import { ScrollView, View } from "react-native";
import Header from "@/components/Header";
import LocalOffers from "@/components/LocalOffers";
export default function OffersScreen() {
  // Compone el encabezado y las ofertas dentro de un contenedor desplazable.
  return (
    <ScrollView contentContainerClassName="pb-6">
      <View className="mx-auto w-full max-w-2xl p-4">
        <Header titulo="Ofertas" />
        <LocalOffers />
      </View>
    </ScrollView>
  );
}
