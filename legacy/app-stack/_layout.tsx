/**
 * IMPLEMENTACIÓN ANTERIOR: Layout de navegación anterior. Declara Perfil y Ajustes, cuyas pantallas no están presentes.
 * El grupo (stack) no añade un segmento a la URL; sus rutas pueden coincidir con app/products.
 * Se conserva para estudiar su código. La implementación actual usa Product y CatalogProvider.
 */
import { Stack } from 'expo-router';
const StackLayout = () => {
  // JSX de la implementación anterior; sus comentarios existentes describen campos y acciones.
  // No asumir que esta pantalla funciona con el store actual: sus importaciones requieren migración.
  return (
    <Stack
      screenOptions={{
        // headerShown: false,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      <Stack.Screen
        name="home/index"
        options={{
          title: 'Inicio',
        }}
      />
      <Stack.Screen
        name="products/index"
        options={{
          title: 'Productos',
        }}
      />

      <Stack.Screen
        name="profile/index"
        options={{
          title: 'Perfil',
        }}
      />
      <Stack.Screen
        name="settings/index"
        options={{
          title: 'Ajustes Pantalla',
        }}
      />

      <Stack.Screen
        name="products/[id]"
        options={{
          title: 'Detalles Pro',
        }}
      />

    </Stack>
  );
};
export default StackLayout;
