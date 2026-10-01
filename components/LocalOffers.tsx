/**
 * OFERTAS LOCALES REUTILIZABLES: conecta filtros, catálogo y lista con cálculos y presentación.
 * No consulta GPS ni precios externos; radio y periodo operan sobre datos simulados.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useCatalog } from "@/store/CatalogProvider";
import {
  ahorroOfertas,
  filtrarOfertas,
  supermercados,
  type OfferFilters,
} from "@/store/offers";
import { compararPrecios } from "@/store/product-comparison";
import SavingsBanner from "./SavingsBanner";
import ProductCard from "./ProductCard";
import StoreBadge from "./StoreBadge";

export default function LocalOffers() {
  const { productos, lista } = useCatalog();
  // Estado inicial: radio de 2 km, ofertas de hoy y todos los productos.
  const [filtros, setFiltros] = useState<OfferFilters>({
    radio: 2,
    periodo: "hoy",
    soloLista: false,
  });
  // Controla qué selector está abierto: radio, periodo o ninguno.
  const [opciones, setOpciones] = useState<"radio" | "periodo" | null>(null);
  // Deriva ofertas del catálogo y filtros; ahorroOfertas recalcula el importe del banner.
  const visibles = filtrarOfertas(productos, lista, filtros);
  // Los botones cambian filtros creando objetos nuevos mediante spread.
  // El banner recibe cifras por props; los productos se agrupan según su tienda de menor precio.
  // Las condiciones muestran opciones abiertas y mensajes cuando una tienda o el resultado están vacíos.
  return (
    <View>
      <View className="mb-3 flex-row gap-1">
        <Filter
          label={`Dentro de ${String(filtros.radio).replace(".", ",")} km`}
          icon="location-outline"
          selected={opciones === "radio"}
          onPress={() => setOpciones(opciones === "radio" ? null : "radio")}
        />
        <Filter
          label={filtros.periodo === "hoy" ? "Hoy" : "Esta semana"}
          icon="calendar-outline"
          selected={opciones === "periodo"}
          onPress={() => setOpciones(opciones === "periodo" ? null : "periodo")}
        />
        <Filter
          label="Solo de mi lista"
          icon={filtros.soloLista ? "checkbox-outline" : "square-outline"}
          selected={filtros.soloLista}
          onPress={() => setFiltros((v) => ({ ...v, soloLista: !v.soloLista }))}
        />
      </View>
      {opciones && (
        <View className="mb-3 flex-row flex-wrap gap-2 rounded-xl bg-white p-3">
          {opciones === "radio"
            ? [0.5, 2, 5].map((r) => (
                <Pressable
                  key={r}
                  accessibilityRole="button"
                  onPress={() => {
                    setFiltros((v) => ({ ...v, radio: r }));
                    setOpciones(null);
                  }}
                  className="min-h-11 justify-center rounded-xl bg-teal-50 px-3"
                >
                  <Text className="text-teal-800">
                    {String(r).replace(".", ",")} km
                  </Text>
                </Pressable>
              ))
            : (["hoy", "semana"] as const).map((p) => (
                <Pressable
                  key={p}
                  accessibilityRole="button"
                  onPress={() => {
                    setFiltros((v) => ({ ...v, periodo: p }));
                    setOpciones(null);
                  }}
                  className="min-h-11 justify-center rounded-xl bg-teal-50 px-3"
                >
                  <Text className="text-teal-800">
                    {p === "hoy" ? "Hoy" : "Esta semana"}
                  </Text>
                </Pressable>
              ))}
        </View>
      )}
      <SavingsBanner
        ahorro={ahorroOfertas(visibles)}
        cantidad={visibles.length}
        periodo={filtros.periodo}
      />
      <Text
        className="mb-3 mt-5 text-lg font-work-medium text-slate-800"
        accessibilityRole="header"
      >
        Supermercados cercanos
      </Text>
      <Text className="mb-3 text-xs leading-5 text-slate-500">
        Distancias y ofertas de demostración. No usamos tu ubicación.
      </Text>
      <View className="gap-4">
        {supermercados
          .filter((s) => s.distancia <= filtros.radio)
          .map((tienda) => {
            const ofertas = visibles.filter(
              (p) =>
                compararPrecios(p.precios).mejorSupermercado === tienda.nombre,
            );
            return (
              <View
                key={tienda.nombre}
                className="rounded-2xl border border-slate-100 bg-white p-3"
              >
                <View className="mb-3 flex-row items-center justify-between">
                  <StoreBadge supermercado={tienda.nombre} />
                  <Text className="text-xs text-slate-500">
                    {String(tienda.distancia).replace(".", ",")} km ·{" "}
                    {ofertas.length}{" "}
                    {ofertas.length === 1 ? "oferta" : "ofertas"}
                  </Text>
                </View>
                {ofertas.length ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-3 pb-2"
                  >
                    {ofertas.map((p) => (
                      <View key={p.id} style={{ width: 150 }}>
                        <ProductCard producto={p} />
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Text className="py-3 text-sm text-slate-500">
                    Sin ofertas con estos filtros.
                  </Text>
                )}
              </View>
            );
          })}
      </View>
      {!visibles.length && (
        <View className="mt-3 rounded-xl bg-teal-50 p-4">
          <Text className="text-slate-700">
            No hay ofertas que coincidan. Cambia los filtros o añade productos a
            tu lista.
          </Text>
          <Link href="/cart" className="mt-3 py-2 text-teal-700">
            Ver mi lista
          </Link>
        </View>
      )}
    </View>
  );
}
// Componente auxiliar de botón: recibe etiqueta, icono, selección y callback del padre.
// El callback comunica la pulsación; aria-pressed y accessibilityState describen su estado.
function Filter({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      aria-pressed={selected}
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`min-h-11 flex-1 flex-row items-center justify-center gap-1 rounded-xl border px-1 py-2 ${selected ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-white"}`}
    >
      <Ionicons name={icon} size={14} color="#0e7490" />
      <Text className="flex-shrink text-center text-xs font-work-medium text-slate-700">
        {label}
      </Text>
    </Pressable>
  );
}
