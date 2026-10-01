/**
 * CONFIGURACIÓN: Metro resuelve importaciones, imágenes y fuentes, y empaqueta la aplicación.
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Parte de la configuración compatible con Expo; __dirname es la carpeta de este archivo.
const config = getDefaultConfig(__dirname);

// Añade NativeWind y usa global.css como entrada de las utilidades de Tailwind.
module.exports = withNativeWind(config, { input: "./global.css" });