import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useBizBagStore } from '../../lib/store/useBizBagStore';

export const SplashScreen: React.FC = () => {
  const { initialize } = useBizBagStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <View className="mb-8">
        <Text className="text-white text-4xl font-bold text-center">BizBag</Text>
        <Text className="text-white/70 text-center mt-2">Control de Inventario</Text>
      </View>
      <ActivityIndicator size="large" color="white" />
      <Text className="text-white/50 mt-8 text-sm">Inicializando...</Text>
    </View>
  );
};
