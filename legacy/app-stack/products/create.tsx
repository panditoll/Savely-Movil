/**
 * IMPLEMENTACIÓN ANTERIOR: Alta anterior con cuatro precios y URL de imagen; llama agregarProducto, que ya no se exporta.
 * El grupo (stack) no añade un segmento a la URL; sus rutas pueden coincidir con app/products.
 * Se conserva para estudiar su código. La implementación actual usa Product y CatalogProvider.
 */
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";

// Importamos la función de guardado y los tipos
import { SupermercadoPrecio } from "../../../models/Producto";
import { agregarProducto } from "../../../store/products.store";

export default function CreateProductScreen() {
  // Estados locales para los campos del formulario
  const [titulo, setTitulo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [rutaImagen, setRutaImagen] = useState("");

  // Estados para ingresar precios por supermercado
  const [precioLider, setPrecioLider] = useState("");
  const [precioJumbo, setPrecioJumbo] = useState("");
  const [precioTottus, setPrecioTottus] = useState("");
  const [precioUnimarc, setPrecioUnimarc] = useState("");

  // Manejo del evento guardar
  const handleGuardar = async () => {
    // Validamos que al menos el título y detalle estén completos
    if (!titulo.trim() || !detalle.trim()) {
      Alert.alert("Campos requeridos", "Por favor ingresa al menos el título y detalle.");
      return;
    }

    // Armamos el arreglo de precios ingresados
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

    // Guardamos el producto
    await agregarProducto({
      titulo,
      detalle,
      // Si no coloca URL, asignamos una imagen por defecto
      rutaImagen:
        rutaImagen.trim() ||
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
      precios,
    });

    Alert.alert("Éxito", "Producto agregado correctamente.");
    router.back(); // Volvemos a la pantalla anterior (Lista)
  };

  // JSX de la implementación anterior; sus comentarios existentes describen campos y acciones.
  // No asumir que esta pantalla funciona con el store actual: sus importaciones requieren migración.
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tituloHeader}>Agregar Nuevo Producto</Text>

      {/* Campo: Nombre del producto */}
      <Text style={styles.label}>Nombre del Producto *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Aceite Vegetal 1L"
        value={titulo}
        onChangeText={setTitulo}
      />

      {/* Campo: Detalle */}
      <Text style={styles.label}>Descripción / Detalle *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ej: Formato de 1 Litro, libre de colesterol"
        value={detalle}
        onChangeText={setDetalle}
        multiline
      />

      {/* Campo: URL de Imagen */}
      <Text style={styles.label}>URL de la Imagen (Opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="https://ejemplo.com/imagen.jpg"
        value={rutaImagen}
        onChangeText={setRutaImagen}
      />

      {/* Subsección: Precios por Supermercado */}
      <Text style={styles.subtitulo}>Precios por Supermercado (CLP)</Text>

      <Text style={styles.label}>Precio Lider</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 1990"
        keyboardType="numeric"
        value={precioLider}
        onChangeText={setPrecioLider}
      />

      <Text style={styles.label}>Precio Jumbo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 2100"
        keyboardType="numeric"
        value={precioJumbo}
        onChangeText={setPrecioJumbo}
      />

      <Text style={styles.label}>Precio Tottus</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 1890"
        keyboardType="numeric"
        value={precioTottus}
        onChangeText={setPrecioTottus}
      />

      <Text style={styles.label}>Precio Unimarc</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 2050"
        keyboardType="numeric"
        value={precioUnimarc}
        onChangeText={setPrecioUnimarc}
      />

      {/* Botón para guardar */}
      <TouchableOpacity style={styles.botonGuardar} onPress={handleGuardar}>
        <Text style={styles.textoBoton}>Guardar Producto</Text>
      </TouchableOpacity>

      {/* Botón Cancelar */}
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