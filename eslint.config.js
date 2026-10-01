/**
 * CONFIGURACIÓN: ESLint revisa patrones de código con las reglas de Expo.
 * Complementa la comprobación de tipos de TypeScript; npm run lint ejecuta esta revisión.
 */
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  // Hereda el conjunto de reglas recomendado por Expo.
  expoConfig,
  {
    // Excluye la salida generada: se revisan los fuentes, no los archivos compilados.
    ignores: ['dist/*'],
  },
]);
