import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useBizBagStore } from '../../lib/store/useBizBagStore';
import { daysUntilExpiry, formatMoney } from '../../lib/utils/helpers';

interface TopBarProps {
  title: string;
  showNotifications?: boolean;
  unreadCount?: number;
}

export const TopBar: React.FC<TopBarProps> = ({ title, showNotifications = true, unreadCount = 0 }) => {
  const { expiry, userName } = useBizBagStore();
  const daysLeft = expiry ? daysUntilExpiry(expiry) : 0;

  return (
    <SafeAreaView className="bg-primary">
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-1">
          <Text className="text-white text-sm font-medium opacity-90">{userName}</Text>
          <Text className="text-white text-lg font-bold">{title}</Text>
        </View>

        <View className="flex-row gap-2">
          {/* Indicador de suscripción */}
          <View className="bg-white/20 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-semibold">{daysLeft}d</Text>
          </View>

          {/* Buzón */}
          {showNotifications && (
            <Link href="/inbox" asChild>
              <TouchableOpacity className="relative">
                <MaterialIcons name="mail" size={24} color="white" />
                {unreadCount > 0 && (
                  <View className="absolute -top-1 -right-1 bg-destructive rounded-full w-5 h-5 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Link>
          )}

          {/* Configuración */}
          <Link href="/settings" asChild>
            <TouchableOpacity>
              <MaterialIcons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};
