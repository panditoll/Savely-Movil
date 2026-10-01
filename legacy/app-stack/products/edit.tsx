/**
 * IMPLEMENTACIÓN ANTERIOR: Edición anterior con useEffect y cuatro tiendas; usa funciones de almacenamiento ya no exportadas.
 * El grupo (stack) no añade un segmento a la URL; sus rutas pueden coincidir con app/products.
 * Se conserva para estudiar su código. La implementación actual usa Product y CatalogProvider.
 */
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";

import { SupermercadoPrecio } from "../../../models/Producto";
import {
    guardarProductos,
    obtenerProductoPorId,
    obtenerProductos,
} from "../../../store/products.store";

export default function EditProductScreen() {
  // Obtenemos el ID del producto que se va a editar
  const { id } = useLocalSearchParams<{ id: string }>();

  // Estados locales del formulario
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [rutaImagen, setRutaImagen] = useState("");

  const [precioLider, setPrecioLider] = useState("");
  const [precioJumbo, setPrecioJumbo] = useState("");
  const [precioTottus, setPrecioTottus] = useState("");
  const [precioUnimarc, setPrecioUnimarc] = useState("");

  // Cargar la información actual del producto al montar el componente
  useEffect(() => {
    cargarDatosProducto();
  }, [id]);

  const cargarDatosProducto = async () => {
    if (!id) return;
    const producto = await obtenerProductoPorId(Number(id));

    if (producto) {
      setTitulo(producto.titulo);
      setDetalle(producto.detalle);
      setRutaImagen(producto.rutaImagen);

      // Precargar los precios existentes en los campos correspondientes
      const pLider = producto.precios?.find((p) => p.nombreSupermercado === "Lider");
      const pJumbo = producto.precios?.find((p) => p.nombreSupermercado === "Jumbo");
      const pTottus = producto.precios?.find((p) => p.nombreSupermercado === "Tottus");
      const pUnimarc = producto.precios?.find((p) => p.nombreSupermercado === "Unimarc");

      if (pLider) setPrecioLider(pLider.precio.toString());
      if (pJumbo) setPrecioJumbo(pJumbo.precio.toString());
      if (pTottus) setPrecioTottus(pTottus.precio.toString());
      if (pUnimarc) setPrecioUnimarc(pUnimarc.precio.toString());
    }
  };

  // Manejador para guardar los cambios editados
  const handleActualizar = async () => {
    if (!titulo.trim() || !detalle.trim()) {
      Alert.alert("Campos requeridos", "Por favor ingresa al menos el título y detalle.");
      return;
    }

    // Construimos la lista actualizada de precios
    const precios: SupermercadoPrecio[] = [];

    if (precioLider) {
      precios.push({
        id: `p_lider_${Date.now()}`,
        nombreSupermercado: "Lider",
        precio: Number(precioLider),
      });
    }

    if (precioJumbo) {
      precios.push({
        id: `p_jumbo_${Date.now()}`,
        nombreSupermercado: "Jumbo",
        precio: Number(precioJumbo),
      });
    }

    if (precioTottus) {
      precios.push({
        id: `p_tottus_${Date.now()}`,
        nombreSupermercado: "Tottus",
        precio: Number(precioTottus),
      });
    }

    if (precioUnimarc) {
      precios.push({
        id: `p_unimarc_${Date.now()}`,
        nombreSupermercado: "Unimarc",
        precio: Number(precioUnimarc),
      });
    }

    // Actualizamos la lista global en la store
    const todosLosProductos = await obtenerProductos();
    const productosActualizados = todosLosProductos.map((prod) => {
      if (prod.id === Number(id)) {
        return {
          ...prod,
          titulo,
          detalle,
          rutaImagen:
            rutaImagen.trim() ||
            "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
          precios,
        };
      }
      return prod;
    });

    await guardarProductos(productosActualizados);

    Alert.alert("Éxito", "Producto actualizado correctamente.");
    router.back();
  };

  // JSX de la implementación anterior; sus comentarios existentes describen campos y acciones.
  // No asumir que esta pantalla funciona con el store actual: sus importaciones requieren migración.
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tituloHeader}>Editar Producto</Text>

      <Text style={styles.label}>Nombre del Producto *</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Descripción / Detalle *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={detalle}
        onChangeText={setDetalle}
        multiline
      />

      <Text style={styles.label}>URL de la Imagen</Text>
      <TextInput
        style={styles.input}
        value={rutaImagen}
        onChangeText={setRutaImagen}
      />

      <Text style={styles.subtitulo}>Precios por Supermercado (CLP)</Text>

      <Text style={styles.label}>Precio Lider</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precioLider}
        onChangeText={setPrecioLider}
      />

      <Text style={styles.label}>Precio Jumbo</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precioJumbo}
        onChangeText={setPrecioJumbo}
      />

      <Text style={styles.label}>Precio Tottus</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precioTottus}
        onChangeText={setPrecioTottus}
      />

      <Text style={styles.label}>Precio Unimarc</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={precioUnimarc}
        onChangeText={setPrecioUnimarc}
      />

      <TouchableOpacity style={styles.botonGuardar} onPress={handleActualizar}>
        <Text style={styles.textoBoton}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonCancelar}
        onPress={() => router.back()}
      >
        <Text style={styles.textoCancelar}>Cancelar</Text>
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
  tituloHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 15,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 14,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  botonGuardar: {
    backgroundColor: "#2E7D32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  botonCancelar: {
    padding: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  textoCancelar: {
    color: "#64748B",
    fontWeight: "bold",
    fontSize: 15,
  },
});