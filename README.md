# Savely

Expo SDK 54 / React Native / Expo Router / TypeScript / NativeWind.

Solo Líder y Unimarc, con datos ficticios locales.

## Secciones

Inicio, Comparar, Ofertas, Carrito y Ruta (pendiente). El catálogo permite crear,
editar, eliminar y elegir una imagen local desde el formulario.

## Datos y persistencia

`store/products.store.ts` es la semilla de 18 productos: 6 Alimentos y 3 en cada
una de las otras cuatro categorías. `store/CatalogProvider.tsx` comparte el estado
actual y lo guarda en AsyncStorage (dependencia ya instalada), clave `savely.catalog.v1`.
El catálogo y la lista se conservan al reiniciar o recargar, por dispositivo/origen web.
No hay sincronización entre dispositivos. Los filtros y la selección de comparación
son temporales. Se actualiza la UI después de una escritura exitosa; las escrituras
se serializan. Un error de lectura no reemplaza los datos guardados.

Los productos creados usan `/products/detail?id=ID` y la edición `/products/form?id=ID`.
Estas rutas fijas funcionan también al recargar productos nuevos en una exportación
web estática. Los antiguos enlaces `/products/1` siguen disponibles.


## Archivos principales

- `models/Product.ts`: modelo ampliado y tipo del formulario.
- `store/catalog.ts`: validaciones, altas, cambios, eliminación y lectura validada.
- `store/CatalogProvider.tsx`: estado compartido y almacenamiento local.
- `store/product-comparison.ts`, `store/offers.ts`: cálculo y filtrado sin UI.
- `components/ProductForm.tsx`, `ProductDetail.tsx`, `ProductMetadata.tsx`,
  `ListButton.tsx`: formularios, detalle, contenido/precio por unidad y lista.
- `components/SavingsBanner.tsx`: presentación reutilizable de valores dinámicos.
- `components/LocalOffers.tsx`: conecta filtros y catálogo con banner/supermercados.
- `app/products/index.tsx`, `form.tsx`, `detail.tsx`: rutas del CRUD.
- Inicio, Comparar, categorías, Ofertas, Carrito y layout consumen el mismo catálogo.

## Imágenes y vista previa

Los 18 productos tienen PNG locales transparentes en `assets/images/productos/`.
La manzana original `manzana.jpg` se conserva. Las descargas originales y sus
fuentes/licencias se documentan en `assets/images/productos/fuentes.json` y su README.
Los catálogos antiguos se adaptan al leerlos sin perder productos ni lista; se
conserva la imagen elegida en el formulario al guardar y recargar.

Para verlas: `npm run web` → Gestionar productos → Ver detalle → Editar producto.
Crear producto también muestra vista previa y el selector Cambiar imagen.
Las imágenes se incluyen en el bundle, por lo que no dependen de URLs externas al abrir la app.
El banner reutiliza `assets/images/savely-logo.png`, con bolsa y moneda, sin emojis.

## Código anterior

Las pantallas antiguas de `app/(stack)` se conservan en `legacy/app-stack/`, fuera
de Expo Router y del chequeo TypeScript. Esto evita rutas duplicadas e importaciones
de funciones eliminadas. La explicación del código está en `GUIA_CODIGO_COMENTADO.md`.

