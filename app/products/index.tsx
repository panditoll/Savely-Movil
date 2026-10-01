/**
 * PANTALLA CATÁLOGO: ruta /products. Permite buscar, abrir detalles y acceder a crear productos.
 */
import { useState } from "react";
import { Link } from "expo-router";
import { ScrollView, Text, TextInput, View } from "react-native";
import Header from "@/components/Header";
import ProductMetadata from "@/components/ProductMetadata";
import ProductImage from "@/components/ProductImage";
import PriceComparison from "@/components/PriceComparison";
import ListButton from "@/components/ListButton";
import { useCatalog } from "@/store/CatalogProvider";
import { filtrarProductos } from "@/store/product-comparison";

export default function ProductsScreen() {
  const { productos } = useCatalog();
  // Estado local del buscador; onChangeText lo actualiza y provoca el nuevo render.
  const [busqueda, setBusqueda] = useState("");
  // Reutiliza el mismo filtro de Comparar, con categoría Todas.
  const visibles = filtrarProductos(productos, busqueda, "Todas");
  // map dibuja los productos y key usa el ID estable. Los componentes reutilizan imagen y precios.
  // La ruta fija de detalle recibe el ID como parámetro; ListButton modifica la lista compartida.
  // Si no hay coincidencias, se muestra el mensaje de lista vacía.
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="pb-6"
    >
      <View className="mx-auto w-full max-w-2xl p-4">
        <Header titulo="Catálogo de productos" volverA="/" />
        <Link
          href="/products/form"
          className="mb-4 rounded-xl bg-teal-700 p-4 text-center font-work-medium text-white"
        >
          Crear producto
        </Link>
        <TextInput
          accessibilityLabel="Buscar en catálogo"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChangeText={setBusqueda}
          className="mb-4 min-h-12 rounded-xl border border-slate-200 bg-white px-3 text-base text-slate-800"
        />
        <Text className="mb-3 text-sm text-slate-500">
          {visibles.length} productos · Datos locales
        </Text>
        <View className="gap-4">
          {visibles.map((p) => (
            <View
              key={p.id}
              className="rounded-2xl border border-slate-100 bg-white p-4"
            >
              <View className="mb-3 flex-row items-center gap-3">
                <View className="w-14">
                  <ProductImage producto={p} mini />
                </View>
                <Text className="flex-1 text-lg font-work-medium text-slate-800">
                  {p.nombre}
                </Text>
              </View>
              <ProductMetadata producto={p} />
              <PriceComparison precios={p.precios} />
              <Link
                href={{ pathname: "/products/detail", params: { id: p.id } }}
                className="mt-3 py-3 text-center text-teal-700"
              >
                Ver detalle de {p.nombre}
              </Link>
              <ListButton id={p.id} />
            </View>
          ))}
        </View>
        {!visibles.length && (
          <Text className="rounded-xl bg-white p-5 text-center text-slate-600">
            No hay productos que coincidan. Puedes crear uno nuevo.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
