import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBizBagStore } from '../../lib/store/useBizBagStore';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { SheetModal } from '../../components/ui/SheetModal';
import { MaterialIcons } from '@expo/vector-icons';
import { available, calculateBalanceLine, formatMoney } from '../../lib/utils/helpers';
import { BalanceLine } from '../../types';

export default function BalanceScreen() {
  const { products, inventory, saveBalance } = useBizBagStore();
  const [stockFinal, setStockFinal] = useState<Record<string, string>>({});
  const [balanceLines, setBalanceLines] = useState<BalanceLine[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [balanceName, setBalanceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalExpected, setTotalExpected] = useState(0);

  useEffect(() => {
    // Inicializar campos de stock final
    const newStockFinal: Record<string, string> = {};
    products.forEach((product) => {
      newStockFinal[product.id] = '';
    });
    setStockFinal(newStockFinal);
  }, [products]);

  useEffect(() => {
    // Calcular líneas de balance y total
    const lines: BalanceLine[] = [];
    let total = 0;

    products.forEach((product) => {
      const inv = inventory[product.id] || { start: 0, added: 0, waste: 0 };
      const stock = parseInt(stockFinal[product.id]) || 0;
      const line = calculateBalanceLine(
        product.id,
        product.name,
        product.price,
        inv.start,
        inv.added,
        inv.waste,
        stock
      );
      lines.push(line);
      total += line.total;
    });

    setBalanceLines(lines);
    setTotalExpected(total);
  }, [stockFinal, products, inventory]);

  const handleSaveBalance = async () => {
    if (!balanceName.trim()) {
      alert('Ingresa un nombre para el cuadre');
      return;
    }

    setLoading(true);
    try {
      await saveBalance(balanceName, balanceLines, totalExpected);
      alert('✅ Cuadre guardado exitosamente');
      setBalanceName('');
      setStockFinal({});
      setShowModal(false);
    } catch (error) {
      alert('❌ Error al guardar cuadre');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Cuadre" />

      <ScrollView className="flex-1 px-4 py-4">
        {products.length === 0 ? (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="inbox" size={48} color="#E2E8F0" />
            <Text className="text-muted text-center mt-4">No hay productos</Text>
          </View>
        ) : (
          products.map((product) => {
            const inv = inventory[product.id] || { start: 0, added: 0, waste: 0 };
            const availableStock = available(inv);
            const stock = parseInt(stockFinal[product.id]) || 0;
            const sales = availableStock - stock;
            const total = sales * product.price;

            return (
              <View key={product.id} className="bg-card rounded-card p-4 mb-4 border border-border">
                <View className="flex-row justify-between items-start mb-3">
                  <View>
                    <Text className="text-foreground text-lg font-bold">{product.name}</Text>
                    <Text className="text-muted text-sm">{product.category}</Text>
                  </View>
                  <Text className="text-primary font-bold text-lg">{formatMoney(product.price)}</Text>
                </View>

                {/* Resumen de movimientos */}
                <View className="bg-muted rounded-input p-2 mb-3 flex-row justify-between text-xs">
                  <Text className="text-foreground font-medium">Inicio: {inv.start}</Text>
                  <Text className="text-foreground font-medium">+{inv.added}</Text>
                  <Text className="text-foreground font-medium">-{inv.waste}</Text>
                  <Text className="text-primary font-bold">= {availableStock}</Text>
                </View>

                {/* Input de stock final */}
                <TextInput
                  label="Stock Final (Físico)"
                  placeholder="0"
                  value={stockFinal[product.id]}
                  onChangeText={(v) => setStockFinal((prev) => ({ ...prev, [product.id]: v }))}
                  keyboardType="numeric"
                />

                {/* Resumen de ventas */}
                <View className="bg-success/10 rounded-input p-3 mt-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-foreground text-xs">Vendidas:</Text>
                    <Text className="text-foreground font-bold text-xs">{sales}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-foreground text-xs">Total Esperado:</Text>
                    <Text className="text-success font-bold">{formatMoney(total)}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Resumen Total */}
      <View className="px-4 py-4 bg-card border-t border-border">
        <View className="bg-primary rounded-card p-4 mb-4">
          <Text className="text-white/80 text-sm font-medium">Total Esperado en Caja</Text>
          <Text className="text-white text-3xl font-bold mt-2">{formatMoney(totalExpected)}</Text>
        </View>
        <Button
          title="Guardar Cuadre"
          onPress={() => setShowModal(true)}
          size="lg"
        />
      </View>

      {/* Modal para nombre del cuadre */}
      <SheetModal
        visible={showModal}
        title="Guardar Cuadre"
        description="Ingresa un nombre para este cuadre (ej: Cuadre Noche)"
        onClose={() => setShowModal(false)}
        onConfirm={handleSaveBalance}
        confirmText="Guardar"
        isLoading={loading}
      >
        <TextInput
          label="Nombre del Cuadre"
          placeholder="Ej: Cuadre Noche"
          value={balanceName}
          onChangeText={setBalanceName}
        />
      </SheetModal>
    </SafeAreaView>
  );
}
