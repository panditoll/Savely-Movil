/**
 * IMPLEMENTACIÓN ANTERIOR: Listado anterior con FlatList, búsqueda y cuatro tiendas; llama obtenerProductos, que ya no se exporta.
 * El grupo (stack) no añade un segmento a la URL; sus rutas pueden coincidir con app/products.
 * Se conserva para estudiar su código. La implementación actual usa Product y CatalogProvider.
 */
import { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { Producto } from "../../../models/Producto";
import { obtenerProductos } from "../../../store/products.store";

// Opciones disponibles para el filtro por supermercado
type SuperFiltro = "Todos" | "Lider" | "Jumbo" | "Tottus" | "Unimarc";

export default function ProductsScreen() {
  // Lista de productos cargada desde la store
  const [productos, setProductos] = useState<Producto[]>([]);
  // Estado para la búsqueda por texto
  const [busqueda, setBusqueda] = useState<string>("");
  // Estado para el filtro por supermercado activo
  const [superSeleccionado, setSuperSeleccionado] = useState<SuperFiltro>("Todos");

  // Recarga los datos cuando la pantalla toma foco
  // En la versión anterior se recargaban datos al enfocar la pantalla.
  // useCallback conserva la función según sus dependencias; el catálogo actual utiliza Context.
  useFocusEffect(
    useCallback(() => {
      cargarProductos();
    }, [])
  );

  // Obtiene los productos desde el almacenamiento
  const cargarProductos = async () => {
    const datos = await obtenerProductos();
    setProductos(datos);
  };

  // Navega al detalle del producto
  const verDetalle = (id: number) => {
    router.push({
      pathname: "/products/[id]",
      params: { id: id.toString() },
    });
  };

  // Navega al formulario para agregar producto
  const irACrear = () => {
    router.push("/products/create");
  };

  // Aplicamos doble filtro: por coincidencia de texto Y por supermercado
  const productosFiltrados = productos.filter((producto) => {
    const coincideTexto = producto.titulo
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideSuper =
      superSeleccionado === "Todos" ||
      producto.precios?.some((p) => p.nombreSupermercado === superSeleccionado);

    return coincideTexto && coincideSuper;
  });

  // Lista de opciones para renderizar los botones de filtro
  const supermercados: SuperFiltro[] = ["Todos", "Lider", "Jumbo", "Tottus", "Unimarc"];

  return (
    <View style={styles.container}>
      <Text style={styles.tituloPrincipal}>Mis productos</Text>

      {/* Buscador de texto */}
      <TextInput
        style={styles.buscador}
        placeholder="Buscar producto..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Barra deslizable horizontal de filtros por supermercado */}
      <View style={styles.wrapperFiltros}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.contenidoFiltros}
        >
          {supermercados.map((superNombre) => {
            const estaActivo = superSeleccionado === superNombre;
            return (
              <TouchableOpacity
                key={superNombre}
                style={[
                  styles.chipFiltro,
                  estaActivo && styles.chipFiltroActivo,
                ]}
                onPress={() => setSuperSeleccionado(superNombre)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.textoChip,
                    estaActivo && styles.textoChipActivo,
                  ]}
                >
                  {superNombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Botón para ir a crear producto */}
      <TouchableOpacity style={styles.botonCrear} onPress={irACrear}>
        <Text style={styles.textoBotonCrear}>+ Agregar Producto</Text>
      </TouchableOpacity>

      {/* Lista de productos filtrados */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vacioContainer}>
            <Text style={styles.textoVacio}>
              No se encontraron productos disponibles.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          let precioAMostrar: number | null = null;

          if (superSeleccionado !== "Todos") {
            const precioSuper = item.precios?.find(
              (p) => p.nombreSupermercado === superSeleccionado
            );
            precioAMostrar = precioSuper ? precioSuper.precio : null;
          } else {
            const precios = item.precios || [];
            precioAMostrar =
              precios.length > 0
                ? Math.min(...precios.map((p) => p.precio))
                : null;
          }

          return (
            <View style={styles.tarjeta}>
              <Image
                source={{ uri: item.rutaImagen }}
                style={styles.imagen}
              />

              <Text style={styles.titulo}>{item.titulo}</Text>

              <Text style={styles.detalle} numberOfLines={2}>
                {item.detalle}
              </Text>

              {precioAMostrar !== null ? (
                <Text style={styles.precioMinimo}>
                  {superSeleccionado !== "Todos"
                    ? `Precio en ${superSeleccionado}: $${precioAMostrar.toLocaleString("es-CL")}`
                    : `Desde: $${precioAMostrar.toLocaleString("es-CL")}`}
                </Text>
              ) : (
                <Text style={styles.sinPrecio}>Sin precio registrado</Text>
              )}

              <TouchableOpacity
                style={styles.boton}
                onPress={() => verDetalle(item.id)}
              >
                <Text style={styles.textoBoton}>Ver detalle</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

// Estilos de React Native expresados como objetos. Esta versión anterior no usa NativeWind aquí.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 20,
  },
  tituloPrincipal: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
  },
  buscador: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 12,
  },
  // --- ESTILOS CORREGIDOS PARA LOS FILTROS ---
  wrapperFiltros: {
    height: 44, // Mantiene la barra con altura constante
    marginBottom: 15,
  },
  contenidoFiltros: {
    alignItems: "center", // Centra verticalmente los botones dentro del ScrollView
    paddingRight: 10,
  },
  chipFiltro: {
    backgroundColor: "#E2E8F0",
    height: 36, // Altura fija idéntica para todos los chips
    paddingHorizontal: 18,
    borderRadius: 18, // Píldora perfecta al ser exactamente la mitad del height
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  chipFiltroActivo: {
    backgroundColor: "#2E7D32",
  },
  textoChip: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  textoChipActivo: {
    color: "#FFFFFF",
  },
  // ---------------------------------------------
  botonCrear: {
    backgroundColor: "#15803D",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  textoBotonCrear: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  tarjeta: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    padding: 15,
  },
  imagen: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  detalle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
  },
  precioMinimo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 15,
  },
  sinPrecio: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 15,
  },
  boton: {
    backgroundColor: "#2E7D32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  vacioContainer: {
    padding: 20,
    alignItems: "center",
  },
  textoVacio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});