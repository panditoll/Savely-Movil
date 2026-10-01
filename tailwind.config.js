/**
 * CONFIGURACIÓN: Tailwind busca clases en los archivos indicados por content.
 * NativeWind adapta esas utilidades a React Native; theme.extend agrega valores al tema base.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  // Incluye las pantallas y componentes que usan className para generar sus estilos.
  content: ["./app/index.tsx", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app.{js,jsx,ts,tsx}",],
  // Integra las utilidades con las reglas de NativeWind.
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
       // Colores personalizados disponibles como bg-primary o text-secondary-100.
       colors: {
        primary: '#49129C',
        secondary: {
          DEFAULT: '#B40086',
          100: '#C51297',
          200: '#831266',
        },
        tertiary: '#EF2967'


      },

      // Relaciona clases como font-work-medium con los nombres cargados mediante useFonts.
      fontFamily:{
        'work-black': [ 'WorkSans-Black', 'sans-serif' ],
        'work-light': [ 'WorkSans-Light', 'sans-serif' ],
        'work-medium': [ 'WorkSans-Medium', 'sans-serif' ],
      }


    },
  },
  // No hay plugins adicionales de Tailwind configurados.
  plugins: [],
}