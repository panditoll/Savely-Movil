/**
 * BOTÓN COMPARTIDO: variantes con fondo o solo texto y colores personalizados de Tailwind.
 * Recibe eventos de pulsación y una referencia al elemento Pressable mediante forwardRef.
 */
import React from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';

// Extiende propiedades de Pressable y agrega texto, color, variante y clases.
// El componente solo reenvía los eventos y props que desestructura explícitamente.
interface Props extends PressableProps {
  children: string;
  color?: 'primary' | `secondary` | 'tertiary';

  variant?: 'contained' | 'text-only';
  className?: string;
}

// forwardRef recibe props y ref por separado, y conecta la referencia con el control interno.
const CustomButton = React.forwardRef(
  (
    {
      children,
      color = 'primary',
      onPress,
      onLongPress,
      variant = 'contained',
      className,
    }: Props,
    ref: React.Ref<View>
  ) => {
    // Tabla de clases completas de fondo; evita construir nombres que Tailwind no pueda detectar.
    const btnColor = {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      tertiary: 'bg-tertiary',
    }[color];

    // Tabla equivalente para la variante de texto sin fondo.
    const textColor = {
      primary: 'text-primary',
      secondary: 'text-secondary',
      tertiary: 'text-tertiary',
    }[color];

    // Renderizado condicional: devuelve antes la variante sin fondo.
    if (variant === 'text-only') {
      return (
        <Pressable
          className={`p-3 ${className}`}
          onPress={onPress}
          onLongPress={onLongPress}
          ref={ref}
        >
          <Text className={`text-center ${textColor} font-work-medium`}>
            {children}
          </Text>
        </Pressable>
      );
    }

    // La otra variante usa fondo de color y texto blanco; onLongPress representa pulsación prolongada.
    return (
      <Pressable
        className={`p-3 rounded-md ${btnColor} active:opacity-90 ${className}`}
        onPress={onPress}
        onLongPress={onLongPress}
        ref={ref}
      >
        <Text className="text-white text-center font-work-medium">
          {children}
        </Text>
      </Pressable>
    );
  }
);

// Nombre explícito para las herramientas de React y la regla react/display-name.
CustomButton.displayName = 'CustomButton';

export default CustomButton;
