/**
 * CONFIGURACIÓN: Babel transforma el código usando los presets de Expo y NativeWind.
 * Metro empaqueta módulos; Babel realiza transformaciones. Aquí se conecta className con NativeWind.
 */
module.exports = function (api) {
  // Reutiliza esta configuración mientras no cambie; evita recalcularla en cada transformación.
  api.cache(true);
  return {
    // Un preset agrupa reglas de transformación. jsxImportSource conecta JSX con NativeWind.
    // El preset nativewind/babel completa la integración de estilos.
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};