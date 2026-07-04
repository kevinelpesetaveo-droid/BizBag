import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBizBagStore } from '../../lib/store/useBizBagStore';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { MaterialIcons } from '@expo/vector-icons';
import { available, formatMoney } from '../../lib/utils/helpers';

export default function InventoryScreen() {
  const { products, inventory, updateInventory } = useBizBagStore();
  const [formData, setFormData] = useState<Record<string, { start: number; added: number; waste: number }>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newFormData: Record<string, any> = {};
    products.forEach((product) => {
      const inv = inventory[product.id] || { start: 0, added: 0, waste: 0 };
      newFormData[product.id] = inv;
    });
    setFormData(newFormData);
  }, [products, inventory]);

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const [productId, data] of Object.entries(formData)) {
        await updateInventory(productId, data);
      }
      alert('✅ Inventario guardado');
    } catch (error) {
      alert('❌ Error al guardar');
    }
    setLoading(false);
  };

  const updateField = (productId: string, field: 'start' | 'added' | 'waste', value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: numValue,
      },
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Inventario" />

      <ScrollView className="flex-1 px-4 py-4">
        {products.length === 0 ? (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="inbox" size={48} color="#E2E8F0" />
            <Text className="text-muted text-center mt-4">No hay productos</Text>
          </View>
        ) : (
          products.map((product) => {
            const data = formData[product.id] || { start: 0, added: 0, waste: 0 };
            const availableStock = available(data);
            return (
              <View key={product.id} className="bg-card rounded-card p-4 mb-4 border border-border">
                <Text className="text-foreground text-lg font-bold">{product.name}</Text>
                <Text className="text-muted text-sm mb-3">{product.category}</Text>

                <TextInput
                  label="Inicio"
                  placeholder="0"
                  value={data.start.toString()}
                  onChangeText={(v) => updateField(product.id, 'start', v)}
                  keyboardType="numeric"
                />
                <TextInput
                  label="Agregó"
                  placeholder="0"
                  value={data.added.toString()}
                  onChangeText={(v) => updateField(product.id, 'added', v)}
                  keyboardType="numeric"
                  style={{ marginTop: 8 }}
                />
                <TextInput
                  label="Merma"
                  placeholder="0"
                  value={data.waste.toString()}
                  onChangeText={(v) => updateField(product.id, 'waste', v)}
                  keyboardType="numeric"
                  style={{ marginTop: 8 }}
                />

                <View className="bg-primary/10 rounded-input p-3 mt-3 flex-row justify-between">
                  <Text className="text-foreground font-semibold">Disponible:</Text>
                  <Text className="text-primary font-bold">{availableStock}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <View className="px-4 py-4 bg-card border-t border-border">
        <Button title="Guardar Inventario" onPress={handleSave} loading={loading} />
      </View>
    </SafeAreaView>
  );
}
