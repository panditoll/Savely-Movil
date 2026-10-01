/**
 * Imágenes locales transparentes: no dependen de URLs ni de conexión al abrir la app.
 */
import { useEffect, useState } from "react";
import { Image, View, type ImageSourcePropType } from "react-native";

import type { ImagenProducto, Product } from "@/models/Product";

// require estático permite a Metro localizar e incluir el archivo al empaquetar.
const imagenes: Record<ImagenProducto, ImageSourcePropType> = {
  leche: require("../assets/images/productos/leche.png"),
  manzana: require("../assets/images/productos/manzana.png"),
  platano: require("../assets/images/productos/platano.png"),
  arroz: require("../assets/images/productos/arroz.png"),
  detergente: require("../assets/images/productos/detergente.png"),
  bebida: require("../assets/images/productos/bebida.png"),
  fideos: require("../assets/images/productos/fideos.png"),
  huevos: require("../assets/images/productos/huevos.png"),
  agua: require("../assets/images/productos/agua.png"),
  jugo: require("../assets/images/productos/jugo.png"),
  lavalozas: require("../assets/images/productos/lavalozas.png"),
  limpiador: require("../assets/images/productos/limpiador.png"),
  champu: require("../assets/images/productos/champu.png"),
  jabon: require("../assets/images/productos/jabon.png"),
  "pasta-dental": require("../assets/images/productos/pasta-dental.png"),
  "papel-absorbente": require("../assets/images/productos/papel-absorbente.png"),
  "bolsas-basura": require("../assets/images/productos/bolsas-basura.png"),
  esponjas: require("../assets/images/productos/esponjas.png"),
};

export default function ProductImage({
  producto,
  grande = false,
  mini = false,
}: {
  producto: Pick<Product, "imagen" | "nombre">;
  grande?: boolean;
  mini?: boolean;
}) {
  const [fallo, setFallo] = useState(false);
  useEffect(() => setFallo(false), [producto.imagen]);
  // Props grande y mini cambian el tamaño; contain mantiene la proporción de la imagen.
  // El respaldo local evita una imagen rota si falla la carga de un recurso.
  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-xl ${mini ? "h-12 p-1" : grande ? "h-56 p-3" : "h-24 p-2"}`}
    >
      <Image
        source={fallo ? imagenes.manzana : (imagenes[producto.imagen] ?? imagenes.manzana)}
        accessibilityLabel={`Imagen de ${producto.nombre || "producto"}`}
        resizeMode="contain"
        onError={() => setFallo(true)}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
