import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: any;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  style,
}) => {
  const variantStyles = {
    primary: 'bg-primary',
    secondary: 'bg-muted',
    destructive: 'bg-destructive',
    outline: 'bg-transparent border-2 border-primary',
  };

  const sizeStyles = {
    sm: 'px-3 py-2 rounded-input',
    md: 'px-4 py-3 rounded-input',
    lg: 'px-6 py-4 rounded-card',
  };

  const textColor = variant === 'outline' ? 'text-primary' : 'text-white';
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`flex-row items-center justify-center gap-2 ${variantStyles[variant]} ${
        sizeStyles[size]
      } ${disabled || loading ? 'opacity-50' : ''}`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2A9D8F' : 'white'} />
      ) : icon ? (
        <MaterialIcons name={icon} size={20} color={variant === 'outline' ? '#2A9D8F' : 'white'} />
      ) : null}
      <Text className={`font-semibold ${textColor} ${textSize}`}>{title}</Text>
    </TouchableOpacity>
  );
};

import { ActivityIndicator } from 'react-native';
