# Guía de configuración y código comentado de Savely

Esta guía complementa los comentarios en el código para preparar la evaluación oral. Los JSON se conservan válidos: package.json, app.json y package-lock.json no admiten comentarios. tsconfig.json se documenta aquí también. Las imágenes, fuentes y declaraciones generadas de NativeWind no se editan.

## 1. Configuración del proyecto

### package.json: dependencias, entrada y comandos

| Campo | Explicación |
|---|---|
| name | Nombre del paquete: practica. La marca de la interfaz es Savely. |
| main | expo-router/entry inicia Expo Router y las rutas de app/. |
| version | Versión del paquete: 1.0.0. |
| private | Impide publicar accidentalmente este paquete mediante npm. |
| scripts | Comandos ejecutables con npm run NOMBRE. |
| dependencies | Librerías de la aplicación; estar instalado no demuestra que un paquete se use directamente en una pantalla. |
| devDependencies | Herramientas de desarrollo, tipos y construcción de estilos. |

| Script | Comando | Propósito |
|---|---|---|
| start | expo start | Iniciar el servidor de desarrollo. |
| android | expo start --android | Intentar abrir Android en un entorno compatible. |
| ios | expo start --ios | Intentar abrir iOS; el simulador requiere macOS. |
| web | expo start --web | Abrir la versión web en desarrollo. |
| lint | expo lint | Revisar código con ESLint. |
| reset-project | node ./scripts/reset-project.js | Referencia un archivo que no está presente en esta copia. |

Los comandos de inicio no publican una aplicación. npm install instala dependencias; npm ci utiliza el lockfile y requiere coherencia con package.json. No hay un script test definido aunque existen archivos de pruebas.

Las versiones declaradas son Expo ~54.0.36, React 19.1.0 y React Native 0.81.5. Sin prefijo, una versión es exacta; ~ permite parches y ^ permite actualizaciones compatibles según versionado semántico. package-lock.json registra las versiones resueltas y sus dependencias transitivas: es un archivo generado, no código para comentar línea por línea.

### Paquetes de la aplicación

| Paquete | Responsabilidad |
|---|---|
| react | Componentes, estado, contexto y hooks. |
| react-native | Componentes de interfaz y APIs nativas. |
| react-dom | Renderizado de React en web. |
| react-native-web | Representación web de componentes React Native. |
| expo | Herramientas y base de integración de Expo. |
| expo-router | Rutas por archivos, parámetros, enlaces y layouts. |
| @react-navigation/native | Infraestructura de navegación. |
| @react-navigation/bottom-tabs | Herramientas de pestañas; la barra actual es propia y usa enlaces. |
| @react-navigation/elements | Elementos auxiliares de navegación. |
| @expo/vector-icons | Iconos; las pantallas utilizan Ionicons. |
| @react-native-async-storage/async-storage | Almacenamiento local asíncrono; guarda catálogo y lista como JSON. No es almacenamiento cifrado de secretos. |
| nativewind | Clases de Tailwind en React Native. |
| expo-font | Carga de fuentes con useFonts. |
| expo-splash-screen | Pantalla inicial y control de cuándo ocultarla. |
| expo-status-bar | Apariencia de la barra de estado. |
| react-native-safe-area-context | Áreas seguras y espacio reservado por el dispositivo. |
| react-native-screens | Integración de pantallas nativas en la navegación. |
| react-native-gesture-handler | Soporte de gestos. |
| react-native-reanimated | Infraestructura de animaciones. |
| react-native-worklets | Infraestructura para ejecutar worklets. |
| expo-constants | Información de aplicación y entorno. |
| expo-image | Componente especializado de imágenes; ProductImage utiliza Image de React Native. |
| expo-linking | Integración de enlaces y URLs. |
| expo-haptics | Respuestas táctiles; instalarlo no activa vibraciones por sí solo. |
| expo-symbols | Símbolos del sistema en plataformas compatibles. |
| expo-system-ui | Integración con la interfaz del sistema. |
| expo-web-browser | Apertura del navegador y flujos web. |

### Herramientas de desarrollo

| Paquete | Responsabilidad |
|---|---|
| typescript | Comprobación de tipos. |
| @types/react | Declaraciones de tipos de React. |
| babel-preset-expo | Transformaciones compatibles con Expo. |
| eslint | Analizador de reglas de código. |
| eslint-config-expo | Reglas de Expo. |
| tailwindcss | Generación de utilidades de estilos. |
| prettier-plugin-tailwindcss | Ordena clases si se configura y utiliza Prettier; no formatea automáticamente por estar instalado. |

### app.json: propiedades de Expo

| Campo | Explicación |
|---|---|
| expo | Agrupa las propiedades de la aplicación. |
| name y slug | Nombre e identificador configurados como practica. |
| version | Versión de aplicación: 1.0.0. |
| orientation | portrait: orientación vertical en plataformas nativas. |
| icon | Icono general mediante un recurso local. |
| scheme | practica: esquema de enlaces para abrir la aplicación. |
| userInterfaceStyle | automatic: apariencia según el sistema. No implica un tema oscuro completo: la UI usa muchos colores claros explícitos. |
| newArchEnabled | Activa la nueva arquitectura de React Native. |
| ios.supportsTablet | Declara soporte para tabletas iOS. |
| android.adaptiveIcon | Icono adaptable con capas y variante monocromática. |
| adaptiveIcon.backgroundColor | Fondo #E6F4FE. |
| adaptiveIcon.foregroundImage | Imagen de primer plano. |
| adaptiveIcon.backgroundImage | Imagen de fondo. |
| adaptiveIcon.monochromeImage | Imagen para iconos temáticos compatibles. |
| android.edgeToEdgeEnabled | Configura contenido hasta los bordes; las áreas seguras siguen siendo importantes. |
| android.predictiveBackGestureEnabled | Desactiva el gesto predictivo de retroceso configurado aquí. |
| web.bundler | metro: empaquetador de web. |
| web.output | static: exportación estática; no configura un backend de catálogo. |
| web.favicon | Icono de la pestaña del navegador. |
| plugins | Integraciones de configuración de Expo Router y splash screen. |
| expo-splash-screen.image | Imagen local de la pantalla inicial. |
| imageWidth y resizeMode | Ancho 200 y ajuste contain. |
| backgroundColor y dark.backgroundColor | Fondos blanco y negro de la pantalla inicial. |
| experiments.typedRoutes | Habilita soporte de tipos para las rutas. |
| experiments.reactCompiler | Habilita integración del compilador de React para optimizaciones cuando corresponda. |

### tsconfig.json y archivos relacionados

- extends: expo/tsconfig.base hereda la configuración de Expo.
- compilerOptions.strict: true activa comprobaciones estrictas de tipos.
- paths relaciona @/* con ./*: @/components/Header apunta a components/Header.
- include incorpora .ts, .tsx y declaraciones del entorno.
- .expo/types/**/*.ts contiene tipos generados, incluidas rutas cuando corresponda.
- expo-env.d.ts contiene declaraciones generadas de Expo.
- nativewind-env.d.ts referencia nativewind/types para propiedades como className. El propio archivo indica que no debe editarse.

.ts contiene TypeScript; .tsx admite JSX; .d.ts declara tipos. TypeScript no valida automáticamente el JSON leído en ejecución; leerCatalogo sí lo comprueba.

### Otros archivos de configuración

- babel.config.js: transforma código con presets de Expo y NativeWind.
- metro.config.js: empaqueta módulos y recursos, y conecta NativeWind con global.css.
- tailwind.config.js: define archivos a explorar, colores y familias tipográficas.
- global.css: directivas base, components y utilities de Tailwind.
- eslint.config.js: reglas de Expo y exclusión de la salida dist.
- .gitignore: excluye dependencias, archivos generados, compilaciones, temporales, archivos locales de entorno y carpetas nativas generadas. No deja de versionar automáticamente archivos ya registrados.
- .vscode/extensions.json: recomienda la extensión de Expo para VS Code.
- .vscode/settings.json: configura acciones explícitas al guardar para corregir código y organizar importaciones y miembros cuando el editor las soporta.
- AGENTS.md y CLAUDE.md: instrucciones para asistentes; no ejecutan la aplicación. CLAUDE.md remite a AGENTS.md.
- assets/: recursos binarios. WorkSans-Bold existe, pero el layout carga Black, Light y Medium. Los productos usan 18 imágenes PNG con transparencia real en assets/images/productos; la manzana original se conserva. ProductImage muestra cada imagen con el mismo encuadre y ProductForm permite elegirla o usar la sugerida por el nombre.

## 2. React: ejemplos que debes estudiar

| Concepto | Ejemplo | Explicación |
|---|---|---|
| Componentes y props | Header, SavingsCard | Funciones que reciben datos y devuelven interfaz reutilizable. |
| JSX | Archivos .tsx | Estructura de interfaz; las llaves insertan expresiones. |
| Estado local | ProductForm, LocalOffers | useState conserva campos, filtros, carga y errores. |
| Campo controlado | ProductForm, Comparar | value y onChangeText conectan el campo con el estado. |
| Estado compartido | CatalogProvider | Context comparte catálogo, lista y acciones. |
| Hook personalizado | useCatalog | Envuelve useContext y comprueba que exista el provider. |
| Efectos | Layout y provider | Sincronizan carga de fuentes y lectura del almacenamiento. |
| Referencias | CatalogProvider | useRef conserva valores sin provocar renders por sí mismo. |
| Eventos | ListButton, ProductForm | onPress responde a pulsaciones. |
| Promesas | Guardar y eliminar | await espera; catch maneja errores y finally libera ocupado. |
| Inmutabilidad | catalog.ts | Spread, map y filter crean objetos y arreglos nuevos. |
| Listas y key | Catálogo y tablas | map dibuja elementos y key los identifica. |
| Reinicio con key | Formulario y Comparar | Cambiar la key remonta el componente y reinicia su estado. |
| Condiciones | Detalle y carrito | Ternarios y && muestran carga, errores y estados vacíos. |
| Callbacks | ProductComparison | Un hijo comunica al padre el ID pulsado. |
| forwardRef | CustomButton | Reenvía la referencia al Pressable interno. |
| Accesibilidad | Enlaces y controles | Roles, etiquetas y estados ayudan a lectores de pantalla. |

Los hooks se llaman al nivel superior del componente o de otro hook; no dentro de condiciones, bucles o eventos. Un efecto con [] se asocia al montaje; en desarrollo puede ejecutarse nuevamente para detectar problemas.

React organiza componentes y estado. React Native ofrece View, Text, Image, Pressable, TextInput y contenedores de desplazamiento. NativeWind aplica las utilidades de Tailwind. La navegación por archivos pertenece a Expo Router.

## 3. Contenido y funcionamiento

### Arranque y guardado

Arranque: expo-router/entry → app/_layout.tsx → fuentes → CatalogProvider → lectura y validación de AsyncStorage → pantallas y barra inferior.

Guardado: TextInput → useState → conversión de strings a números → validarProducto → guardar del contexto → guardarProducto → escritura JSON → setEstado → detalle y pantallas actualizadas.

Las escrituras se serializan con una cola. La UI publica los cambios después de guardar correctamente. Una lectura fallida informa el error y permite reintentar sin reemplazar los datos guardados.

### Rutas actuales

| Ruta | Función |
|---|---|
| / | Inicio, ofertas y resumen por categoría. |
| /products | Catálogo y búsqueda. |
| /products/form | Crear. |
| /products/form?id=ID | Editar. |
| /products/detail?id=ID | Detalle fijo. |
| /products/[id] | Detalle dinámico para enlaces existentes. |
| /compare | Buscar, filtrar y seleccionar hasta dos productos. |
| /compare/categories | Comparación agregada por categoría. |
| /compare/categories/[categoria] | Detalle de categoría. |
| /offers | Ofertas y filtros. |
| /cart | Lista de una unidad por producto y totales. |
| /route | Sección pendiente: En proceso. |

Link crea enlaces; push añade al historial; replace sustituye la entrada actual; back vuelve. useLocalSearchParams lee parámetros y usePathname identifica la ruta activa. La barra inferior es propia, no un Tabs.

En web estática, generateStaticParams enumera IDs iniciales y categorías. Los productos posteriores se abren con la página fija /products/detail?id=ID. El ID no comparte los datos: el producto debe existir en el almacenamiento del dispositivo u origen web que abre el enlace.

### Fórmulas y límites reales

- Producto: ahorro = diferencia absoluta entre los dos precios. Empate: ahorro cero.
- Compra en una tienda: primero suma los precios de cada tienda y después compara ambos totales.
- Categoría: filtra sus productos y compara sus totales.
- Promedio por categoría: suma las diferencias y divide por el número de categorías. Con la semilla: $240.
- Banner de ofertas: suma diferencias individuales de los productos visibles; no mide descuentos históricos.
- calcularAhorroCompra: compara repartir los productos al menor precio con comprar todo en la tienda de menor total. Tiene pruebas, pero no alimenta el banner actual.
- Precio normalizado: precio × 1000 / contenido para g o ml; precio / contenido para kg, L y ud.

Manzanas más detergente: Líder $5.780 y Unimarc $5.680; comprar ambos en Unimarc ahorra $100. Repartirlos en sus tiendas de menor precio cuesta $5.480: $200 menos que la tienda de menor total. Son comparaciones diferentes.

Hay 18 productos ficticios iniciales: 6 Alimentos y 3 por cada otra categoría. Las tiendas están a 0,4 y 1,1 km simulados. No se consulta GPS. Hoy y semana son etiquetas; hoy se incluye en semana. El radio de ofertas se aplica a la tienda ganadora y excluye empates. El carrito no tiene pagos ni cantidades configurables.

AsyncStorage conserva productos, lista de IDs y siguienteId con la clave savely.catalog.v1. Los filtros y la selección son temporales. No hay sincronización entre dispositivos ni un backend de precios en este código.

### Implementación anterior y pruebas

legacy/app-stack y models/Producto.ts pertenecen a una versión anterior: cuatro tiendas, URLs de imagen y otro modelo. Las pantallas antiguas importan funciones ya no exportadas en products.store.ts. Se conservaron fuera de app para evitar rutas duplicadas y se excluyeron de TypeScript mediante tsconfig.json. Expo Router carga las pantallas actuales de app; el código histórico está disponible para consulta en legacy.

catalog.test.ts y product-comparison.test.ts usan node:test y assert. Cubren CRUD, validaciones, inmutabilidad, lectura JSON, selección, filtros y cálculos. No equivalen a pruebas de interfaz o de AsyncStorage real.

## 4. Preguntas orales para practicar

1. ¿package.json y app.json? Dependencias/comandos frente a configuración de aplicación/plataformas.
2. ¿Babel y Metro? Transformación frente a resolución y empaquetado de módulos y recursos.
3. ¿TypeScript y ESLint? Tipos frente a reglas y patrones de código.
4. ¿Props y estado? Datos recibidos frente a información conservada y actualizada por React.
5. ¿Por qué Context? Varias pantallas necesitan el mismo catálogo y lista, sin pasarlos por muchos niveles.
6. ¿Estado y persistencia? Datos durante la ejecución frente a recuperación después de cerrar o recargar.
7. ¿Por qué useRef? Conserva el estado más reciente y la cola sin provocar renders por sí solo.
8. ¿Por qué validar si hay tipos? El JSON y lo escrito por el usuario deben comprobarse en ejecución.
9. ¿Qué ocurre al eliminar? Se quitan producto y referencia en la lista.
10. ¿Qué ocurre si falla guardar? No se publica el nuevo estado y se informa el error.
11. ¿Cómo responde el buscador? onChangeText actualiza el estado y se recalcula el filtro.
12. ¿Para qué key? Identifica elementos; cambiarla también puede reiniciar el estado de un componente.
13. ¿Por qué comparar totales en lugar de sumar ahorros? Los productos pueden convenir en tiendas diferentes.
14. ¿El radio utiliza GPS? No: distancias fijas de demostración.
15. ¿Por qué detalle fijo y dinámico? La ruta fija permite abrir productos creados después de exportar la web estática.
16. ¿Todos los archivos pertenecen a la versión actual? No: hay pantallas antiguas con importaciones incompatibles.
17. ¿Qué falta para datos reales? Fuente de precios, backend, usuarios y sincronización; ubicación real si se implementa cercanía.

Orden de lectura: configuración → Product.ts → catalog.ts → CatalogProvider.tsx → layout raíz → formulario y detalle → cálculos → Comparar, categorías, ofertas y carrito → componentes → pruebas → versión anterior.
