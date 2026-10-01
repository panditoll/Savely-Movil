/**
 * IMPLEMENTACIÓN ANTERIOR: Detalle anterior con Producto, precios en arreglo y funciones de store ya no exportadas.
 * El grupo (stack) no añade un segmento a la URL; sus rutas pueden coincidir con app/products.
 * Se conserva para estudiar su código. La implementación actual usa Product y CatalogProvider.
 */
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

// Importamos el modelo y las funciones de la store
import { Producto, SupermercadoPrecio } from "../../../models/Producto";
import {
  eliminarProducto,
  obtenerProductoPorId,
} from "../../../store/products.store";

export default function ProductDetailScreen() {
  // Obtenemos el parámetro 'id' enviado desde la navegación por la URL
  const { id } = useLocalSearchParams<{ id: string }>();

  // Estado local para guardar el producto encontrado
  const [producto, setProducto] = useState<Producto | undefined>();

  // Recargamos la información del producto cada vez que la pantalla toma foco (por si venimos de editar)
  // En la versión anterior se recargaban datos al enfocar la pantalla.
  // useCallback conserva la función según sus dependencias; el catálogo actual utiliza Context.
  useFocusEffect(
    useCallback(() => {
      cargarProducto();
    }, [id])
  );

  // Función asíncrona para buscar el producto por su ID
  const cargarProducto = async () => {
    if (!id) return;
    const encontrado = await obtenerProductoPorId(Number(id));
    setProducto(encontrado);
  };

  // Confirmación y ejecución de la eliminación
  const confirmarEliminacion = () => {
    Alert.alert(
      "Eliminar Producto",
      `¿Estás seguro de que deseas eliminar "${producto?.titulo}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if (producto) {
              await eliminarProducto(producto.id);
              Alert.alert("Éxito", "Producto eliminado correctamente.");
              router.back(); // Volvemos a la lista principal
            }
          },
        },
      ]
    );
  };

  // Si aún no se encuentra el producto o está cargando, mostramos un mensaje alternativo
  if (!producto) {
    return (
      <View style={styles.container}>
        <Text>Producto no encontrado</Text>
      </View>
    );
  }

  // Ordenamos la lista de precios de MENOR a MAYOR precio
  const preciosOrdenados = [...(producto.precios || [])].sort(
    (a, b) => a.precio - b.precio
  );

  // El primer elemento de la lista ordenada siempre será el precio más económico
  const precioMasBajo = preciosOrdenados[0]?.precio;

  return (
    <ScrollView style={styles.container}>
      {/* Imagen principal del producto */}
      <Image
        source={{ uri: producto.rutaImagen }}
        style={styles.imagen}
      />

      {/* Título y descripción */}
      <Text style={styles.titulo}>{producto.titulo}</Text>
      <Text style={styles.detalle}>{producto.detalle}</Text>

      {/* Sección de la comparativa de precios */}
      <Text style={styles.seccionTitulo}>Comparativa de Precios</Text>

      {/* Si el producto no tiene precios registrados */}
      {preciosOrdenados.length === 0 ? (
        <Text style={styles.sinPrecios}>
          No hay precios disponibles para este producto.
        </Text>
      ) : (
        // Iteramos sobre cada precio ordenado
        preciosOrdenados.map((item: SupermercadoPrecio) => {
          // Comprobamos si este supermercado ofrece el precio más barato
          const esElMasBarato = item.precio === precioMasBajo;

          return (
            <View
              key={item.id}
              style={[
                styles.tarjetaPrecio,
                // Aplicamos estilo especial verde si es el precio más económico
                esElMasBarato && styles.tarjetaMasBarata,
              ]}
            >
              <View style={styles.headerSuper}>
                <Text style={styles.nombreSuper}>
                  {item.nombreSupermercado}
                </Text>

                {/* Etiqueta visual para indicar la mejor opción */}
                {esElMasBarato && (
                  <View style={styles.badgeBarato}>
                    <Text style={styles.textoBadge}>Mejor Precio 🟢</Text>
                  </View>
                )}
              </View>

              {/* Muestreo del precio formateado a pesos chilenos ($ 1.050) */}
              <Text
                style={[
                  styles.montoPrecio,
                  esElMasBarato && styles.montoMasBarato,
                ]}
              >
                ${item.precio.toLocaleString("es-CL")}
              </Text>
            </View>
          );
        })
      )}

      {/* ID de referencia */}
      <Text style={styles.id}>ID del producto: {producto.id}</Text>

      {/* Botón para navegar a la pantalla de edición */}
      <TouchableOpacity
        style={styles.botonEditar}
        onPress={() =>
          router.push({
            pathname: "/products/edit",
            params: { id: producto.id.toString() },
          })
        }
      >
        <Text style={styles.textoBoton}>Editar Producto</Text>
      </TouchableOpacity>

      {/* Botón para regresar a la pantalla anterior */}
      <TouchableOpacity
        style={styles.botonVolver}
        onPress={() => router.back()}
      >
        <Text style={styles.textoBoton}>Volver</Text>
      </TouchableOpacity>

      {/* Botón para eliminar el producto */}
      <TouchableOpacity
        style={styles.botonEliminar}
        onPress={confirmarEliminacion}
      >
        <Text style={styles.textoBotonEliminar}>Eliminar Producto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos de React Native expresados como objetos. Esta versión anterior no usa NativeWind aquí.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
  },
  imagen: {
    width: "100%",
    height: 280,
    borderRadius: 15,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detalle: {
    fontSize: 17,
    color: "#555",
    marginBottom: 15,
  },
  seccionTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginTop: 10,
    marginBottom: 15,
  },
  sinPrecios: {
    fontSize: 15,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 15,
  },
  tarjetaPrecio: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  tarjetaMasBarata: {
    backgroundColor: "#F0FDF4",
    borderColor: "#16A34A",
  },
  headerSuper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nombreSuper: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  badgeBarato: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  textoBadge: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  montoPrecio: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
  },
  montoMasBarato: {
    color: "#15803D",
  },
  id: {
    fontSize: 14,
    color: "#777",
    marginVertical: 15,
  },
  botonEditar: {
    backgroundColor: "#0284C7", // Azul para la acción de edición
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  botonVolver: {
    backgroundColor: "#2E7D32", // Verde para navegación principal
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  botonEliminar: {
    backgroundColor: "#DC2626", // Rojo para acción destructiva
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  textoBotonEliminar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});