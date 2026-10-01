/**
 * ARRANQUE Y NAVEGACIÓN GLOBAL: Expo Router monta este layout alrededor de las pantallas.
 * Carga fuentes, controla el splash, comparte el catálogo y mantiene la barra inferior.
 */
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { CatalogProvider } from "@/store/CatalogProvider";

import BottomNavigation from "@/components/BottomNavigation";
import "../global.css";

// Conserva la pantalla de inicio mientras se preparan las fuentes.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carga las fuentes locales con los mismos nombres usados en tailwind.config.js.
  const [fontsLoaded, error] = useFonts({
    "WorkSans-Black": require("../assets/fonts/WorkSans-Black.ttf"),
    "WorkSans-Light": require("../assets/fonts/WorkSans-Light.ttf"),
    "WorkSans-Medium": require("../assets/fonts/WorkSans-Medium.ttf"),
  });

  // Oculta el splash al terminar la carga o fallar; el arreglo contiene los valores que se observan.
  useEffect(() => {
    if (fontsLoaded || error) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // No dibuja la aplicación mientras las fuentes siguen pendientes y no existe un error.
  if (!fontsLoaded && !error) return null;

  // CatalogProvider envuelve las pantallas y la barra para que compartan catálogo y lista.
  // SafeAreaView evita solapar el contenido con áreas del dispositivo; la barra maneja el borde inferior.
  // Stack organiza el historial; BottomNavigation es un componente propio basado en enlaces.
  return (
    <CatalogProvider>
      <SafeAreaView
        edges={["top", "left", "right"]}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
      >
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: { backgroundColor: "#f8fafc" },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="products/[id]"
            options={{ animation: "slide_from_right" }}
          />
        </Stack>
        <BottomNavigation />
      </SafeAreaView>
    </CatalogProvider>
  );
}
