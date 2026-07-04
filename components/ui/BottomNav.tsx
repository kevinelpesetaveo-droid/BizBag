import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface BottomNavProps {
  active: 'dashboard' | 'products' | 'inventory' | 'balance' | 'history';
}

export const BottomNav: React.FC<BottomNavProps> = ({ active }) => {
  const navItems = [
    { name: 'dashboard', label: 'Inicio', icon: 'dashboard' as const },
    { name: 'products', label: 'Productos', icon: 'store' as const },
    { name: 'inventory', label: 'Inventario', icon: 'inventory_2' as const },
    { name: 'balance', label: 'Cuadre', icon: 'receipt' as const },
    { name: 'history', label: 'Historial', icon: 'history' as const },
  ];

  return (
    <View className="flex-row bg-card border-t border-border">
      {navItems.map((item) => {
        const isActive = active === item.name;
        return (
          <Link
            key={item.name}
            href={`/(tabs)/${item.name}`}
            asChild
          >
            <TouchableOpacity
              className={`flex-1 items-center justify-center py-3 ${
                isActive ? 'bg-primary/10' : 'bg-transparent'
              }`}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={isActive ? '#2A9D8F' : '#E2E8F0'}
              />
              <Text
                className={`text-xs mt-1 ${
                  isActive ? 'text-primary font-semibold' : 'text-muted font-normal'
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
};
