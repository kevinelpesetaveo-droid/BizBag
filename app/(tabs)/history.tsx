import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBizBagStore } from '../../lib/store/useBizBagStore';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { formatMoney, formatDate } from '../../lib/utils/helpers';

export default function HistoryScreen() {
  const { balances } = useBizBagStore();
  const [selectedBalance, setSelectedBalance] = useState<string | null>(null);

  const selectedBalanceData = balances.find((b) => b.id === selectedBalance);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Historial" />

      <View className="flex-1">
        {selectedBalance && selectedBalanceData ? (
          // Vista de detalle
          <ScrollView className="flex-1 px-4 py-4">
            <TouchableOpacity
              onPress={() => setSelectedBalance(null)}
              className="flex-row items-center gap-2 mb-4"
            >
              <MaterialIcons name="arrow_back" size={24} color="#2A9D8F" />
              <Text className="text-primary font-semibold">Volver</Text>
            </TouchableOpacity>

            <View className="bg-primary rounded-card p-4 mb-4">
              <Text className="text-white/80 text-sm font-medium">{selectedBalanceData.name}</Text>
              <Text className="text-white text-xs mt-1">{formatDate(selectedBalanceData.date)}</Text>
              <Text className="text-white text-3xl font-bold mt-3">{formatMoney(selectedBalanceData.total)}</Text>
            </View>

            <Text className="text-foreground text-lg font-bold mb-3">Desglose</Text>
            {selectedBalanceData.lines.map((line) => (
              <View key={line.productId} className="bg-card rounded-card p-4 mb-3 border border-border">
                <View className="flex-row justify-between items-start mb-2">
                  <View>
                    <Text className="text-foreground font-bold">{line.name}</Text>
                    <Text className="text-muted text-xs mt-1">{formatMoney(line.price)} c/u</Text>
                  </View>
                  <Text className="text-primary font-bold">{formatMoney(line.total)}</Text>
                </View>

                <View className="bg-muted rounded-input p-2 mt-2">
                  <View className="flex-row justify-between text-xs mb-1">
                    <Text className="text-foreground text-xs">Inicio: {line.start}</Text>
                    <Text className="text-foreground text-xs">+{line.added}</Text>
                    <Text className="text-foreground text-xs">-{line.waste}</Text>
                    <Text className="text-foreground font-bold text-xs">= {line.start + line.added - line.waste}</Text>
                  </View>
                  <View className="flex-row justify-between text-xs">
                    <Text className="text-foreground text-xs">Stock Final: {line.stock}</Text>
                    <Text className="text-foreground font-bold text-xs">Vendidas: {line.sales}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          // Vista de lista
          <ScrollView className="flex-1">
            {balances.length === 0 ? (
              <View className="items-center justify-center py-12">
                <MaterialIcons name="history" size={48} color="#E2E8F0" />
                <Text className="text-muted text-center mt-4">No hay cuadres guardados</Text>
              </View>
            ) : (
              <View className="px-4 py-4">
                {balances.map((balance) => (
                  <TouchableOpacity key={balance.id} onPress={() => setSelectedBalance(balance.id)}>
                    <Card
                      title={balance.name}
                      subtitle={formatDate(balance.date)}
                      value={formatMoney(balance.total)}
                      icon="receipt"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
