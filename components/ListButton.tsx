/**
 * BOTÓN DE LISTA: utiliza el contexto para añadir o quitar un ID del carrito persistido.
 */
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCatalog } from "@/store/CatalogProvider";

export default function ListButton({ id }: { id: number }) {
  const { lista, alternarLista } = useCatalog();
  // Estado local para mostrar Guardando y deshabilitar este botón durante la escritura.
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState("");
  // await espera alternarLista; catch presenta el fallo y finally permite volver a pulsar.
  async function alternar() {
    setOcupado(true);
    setError("");
    try {
      await alternarLista(id);
    } catch {
      setError("No se pudo guardar. Inténtalo de nuevo.");
    } finally {
      setOcupado(false);
    }
  }
  // El texto se deriva de lista.includes(id): muestra añadir, quitar o guardando.
  // Los errores se renderizan como alertas accesibles.
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        disabled={ocupado}
        onPress={() => void alternar()}
        className="mt-3 min-h-12 items-center justify-center rounded-xl bg-teal-50 p-3"
      >
        <Text className="text-teal-800">
          {ocupado
            ? "Guardando…"
            : lista.includes(id)
              ? "Quitar de mi lista"
              : "Añadir a mi lista"}
        </Text>
      </Pressable>
      {!!error && (
        <Text accessibilityRole="alert" className="mt-2 text-red-700">
          {error}
        </Text>
      )}
    </View>
  );
}
