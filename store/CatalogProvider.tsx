/**
 * ESTADO COMPARTIDO Y PERSISTENCIA: Context comparte productos y lista entre pantallas.
 * AsyncStorage conserva ese estado por dispositivo u origen web; no hay sincronización con un servidor.
 * useCatalog es el hook personalizado que permite consumir este contexto.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Text, View, Pressable } from "react-native";
import type { ProductInput } from "@/models/Product";
import { productos } from "./products.store";
import {
  guardarProducto,
  eliminarProducto,
  leerCatalogo,
  type CatalogState,
} from "./catalog";

// Clave versionada del almacenamiento local. AsyncStorage guarda texto, por eso se utiliza JSON.
const clave = "savely.catalog.v1";
// Semilla para el primer inicio. La lista empieza vacía y el ID siguiente supera el máximo inicial.
const inicial: CatalogState = {
  versionImagenes: 1,
  productos,
  lista: [],
  siguienteId: Math.max(0, ...productos.map((p) => p.id)) + 1,
};
// Amplía los datos con operaciones asíncronas: guardar, eliminar y alternarLista.
interface CatalogContext extends CatalogState {
  guardar: (input: ProductInput, id?: number) => Promise<number>;
  eliminar: (id: number) => Promise<void>;
  alternarLista: (id: number) => Promise<void>;
}
// null indica ausencia de provider. useCatalog comprueba esta situación antes de devolver los datos.
const Context = createContext<CatalogContext | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  // useState conserva los datos que afectan la interfaz; setEstado vuelve a renderizar los consumidores.
  const [estado, setEstado] = useState(inicial);
  const [listo, setListo] = useState(false);
  const [error, setError] = useState("");
  // useRef conserva el estado más reciente y la cola entre renders sin provocar renders por sí solo.
  const actual = useRef(inicial);
  const cola = useRef<Promise<unknown>>(Promise.resolve());

  // Lee y valida el catálogo local; si no hay datos usa la semilla.
  // Una lectura fallida muestra error y permite reintentar sin sobrescribir los datos guardados.
  async function cargar() {
    setError("");
    try {
      const texto = await AsyncStorage.getItem(clave);
      actual.current = texto ? leerCatalogo(texto) : inicial;
      setEstado(actual.current);
      setListo(true);
    } catch {
      setError(
        "No pudimos leer tus datos locales. No se ha reemplazado el catálogo guardado.",
      );
    }
  }
  // Carga al montar el provider. El arreglo vacío expresa que no depende de estados o props cambiantes.
  useEffect(() => {
    void cargar();
  }, []);

  // Serializa escrituras: una operación solo se publica cuando queda guardada.
  // Cada tarea se encadena a la anterior y transforma la última versión del catálogo.
  function modificar(transformar: (s: CatalogState) => CatalogState) {
    const tarea = cola.current.then(async () => {
      const siguiente = transformar(actual.current);
      // Primero persiste. Solo después publica el nuevo estado: una escritura fallida no aparece como exitosa.
      await AsyncStorage.setItem(clave, JSON.stringify(siguiente));
      actual.current = siguiente;
      setEstado(siguiente);
      return siguiente;
    });
    // Recupera la cola tras un fallo para permitir nuevas operaciones; la tarea original conserva su rechazo.
    cola.current = tarea.catch(() => undefined);
    return tarea;
  }
  // Renderizado condicional: la aplicación espera la carga antes de mostrar pantallas que usan el catálogo.
  if (!listo)
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 p-6">
        <Text className="text-center text-slate-700">
          {error || "Cargando Savely…"}
        </Text>
        {!!error && (
          <Pressable
            accessibilityRole="button"
            onPress={() => void cargar()}
            className="mt-4 rounded-xl bg-teal-700 p-4"
          >
            <Text className="text-white">Reintentar</Text>
          </Pressable>
        )}
      </View>
    );
  // El provider entrega estado y acciones a todos sus descendientes mediante value.
  // children representa las pantallas y la navegación envueltas por CatalogProvider.
  return (
    <Context.Provider
      value={{
        ...estado,
        // Delega al CRUD puro y devuelve el ID para abrir el detalle después del guardado.
        guardar: async (input, id) => {
          const s = await modificar((prev) => guardarProducto(prev, input, id));
          return id ?? s.siguienteId - 1;
        },
        eliminar: async (id) => {
          await modificar((prev) => eliminarProducto(prev, id));
        },
        // Guarda solamente IDs. Si ya existe lo quita; si falta y el producto existe lo añade.
        alternarLista: async (id) => {
          await modificar((prev) => ({
            ...prev,
            lista: prev.lista.includes(id)
              ? prev.lista.filter((v) => v !== id)
              : prev.productos.some((p) => p.id === id)
                ? [...prev.lista, id]
                : prev.lista,
          }));
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
// Hook personalizado: centraliza useContext y falla de forma explícita si falta CatalogProvider.
export function useCatalog() {
  const context = useContext(Context);
  if (!context) throw new Error("Falta CatalogProvider.");
  return context;
}
