/**
 * NAVEGACIÓN INFERIOR PERSONALIZADA: cinco enlaces para Inicio, Comparar, Ofertas, Carrito y Ruta.
 * Se dibuja fuera del Stack en el layout raíz para mantenerse disponible entre pantallas.
 */
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Datos de cada enlace e iconos activo/inactivo. as const conserva los literales de rutas e iconos.
const secciones = [
  { nombre: "Inicio", ruta: "/", icono: "home-outline", activo: "home" },
  {
    nombre: "Comparar",
    ruta: "/compare",
    icono: "scale-outline",
    activo: "scale",
  },
  {
    nombre: "Ofertas",
    ruta: "/offers",
    icono: "pricetag-outline",
    activo: "pricetag",
  },
  { nombre: "Carrito", ruta: "/cart", icono: "cart-outline", activo: "cart" },
  { nombre: "Ruta", ruta: "/route", icono: "map-outline", activo: "map" },
] as const;

export default function BottomNavigation() {
  // Consulta la ruta actual para resaltar la sección correspondiente.
  const pathname = usePathname();
  // Obtiene el espacio inferior reservado por el dispositivo para evitar solapamientos.
  const insets = useSafeAreaInsets();

  // map genera enlaces. replace sustituye la entrada actual en el historial al cambiar de sección.
  // asChild entrega el comportamiento del enlace al Pressable. Los estados accesibles anuncian selección.
  // Los detalles de categorías pertenecen a Comparar y los productos se agrupan visualmente con Inicio.
  return (
    <View
      className="rounded-t-3xl border-t border-slate-100 bg-white"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="mx-auto w-full max-w-2xl flex-row px-2 py-2">
        {secciones.map((seccion) => {
          const activo =
            pathname === seccion.ruta ||
            (seccion.ruta === "/compare" && pathname.startsWith("/compare/")) ||
            (seccion.ruta === "/" &&
              (pathname === "/products" || pathname.startsWith("/products/")));

          return (
            <Link key={seccion.ruta} href={seccion.ruta} replace asChild>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={seccion.nombre}
                accessibilityState={{ selected: activo }}
                className="min-h-14 flex-1 items-center justify-center rounded-2xl py-2 active:bg-teal-50"
              >
                <Ionicons
                  name={activo ? seccion.activo : seccion.icono}
                  size={23}
                  color={activo ? "#0f766e" : "#64748b"}
                />
                <Text
                  className={`mt-1 text-xs font-work-medium ${activo ? "text-teal-700" : "text-slate-500"}`}
                >
                  {seccion.nombre}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
