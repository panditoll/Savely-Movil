# Implementación anterior

`app-stack/` conserva las pantallas antiguas que antes estaban en `app/(stack)`.
Se movieron aquí porque duplicaban rutas del catálogo actual e importaban funciones
que ya no existen. No forman parte de Expo Router ni de la comprobación de tipos.

Para estudiar o continuar la aplicación actual, utiliza `app/products/`,
`components/ProductForm.tsx`, `components/ProductDetail.tsx` y `store/CatalogProvider.tsx`.
