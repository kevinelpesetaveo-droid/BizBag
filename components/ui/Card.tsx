import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: string;
  onPress?: () => void;
  style?: any;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  value,
  icon,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      className="bg-card rounded-card p-4 mb-3 border border-border"
      style={style}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-foreground font-semibold text-base">{title}</Text>
          {subtitle && <Text className="text-muted text-sm mt-1">{subtitle}</Text>}
        </View>
        {icon && <MaterialIcons name={icon} size={24} color="#2A9D8F" />}
      </View>
      {value && (
        <Text className="text-primary font-bold text-lg mt-3">{value}</Text>
      )}
    </TouchableOpacity>
  );
};
