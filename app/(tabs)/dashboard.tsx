import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBizBagStore } from '../../lib/store/useBizBagStore';
import { TopBar } from '../../components/ui/TopBar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { formatMoney, available } from '../../lib/utils/helpers';

export default function DashboardScreen() {
  const { products, inventory, balances, messages } = useBizBagStore();
  const [totalValue, setTotalValue] = React.useState(0);
  const [unreadMessages, setUnreadMessages] = React.useState(0);

  useEffect(() => {
    // Calcular valor total en existencias
    let total = 0;
    products.forEach((product) => {
      const inv = inventory[product.id];
      if (inv) {
        const stock = available(inv);
        total += stock * product.price;
      }
    });
    setTotalValue(total);

    // Contar mensajes no leídos
    const unread = messages.filter((m) => !m.read).length;
    setUnreadMessages(unread);
  }, [products, inventory, messages]);

  const lastBalance = balances[0];
  const lastMessage = messages[0];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Inicio" unreadCount={unreadMessages} />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Resumen de Existencias */}
        <View className="bg-primary rounded-card p-6 mb-6">
          <Text className="text-white/80 text-sm font-medium">Valor en Existencias</Text>
          <Text className="text-white text-3xl font-bold mt-2">{formatMoney(totalValue)}</Text>
          <Text className="text-white/60 text-xs mt-2">
            {products.length} productos | {Object.keys(inventory).length} en inventario
          </Text>
        </View>

        {/* Último Cuadre */}
        {lastBalance && (
          <Card
            title="Último Cuadre"
            subtitle={lastBalance.name}
            value={formatMoney(lastBalance.total)}
            icon="check_circle"
          />
        )}

        {/* Último Mensaje */}
        {lastMessage && (
          <Card
            title="Último Mensaje"
            subtitle={lastMessage.title}
            icon={lastMessage.read ? 'mail_outline' : 'mail'}
          />
        )}

        {/* Accesos Rápidos */}
        <Text className="text-foreground text-lg font-bold mb-3 mt-4">Accesos Rápidos</Text>
        <View className="flex-row flex-wrap gap-2">
          <Link href="/(tabs)/products" asChild>
            <TouchableOpacity className="flex-1 min-w-1/2 bg-card rounded-card p-4 items-center border border-border">
              <MaterialIcons name="store" size={32} color="#2A9D8F" />
              <Text className="text-foreground text-sm font-semibold mt-2">Productos</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/inventory" asChild>
            <TouchableOpacity className="flex-1 min-w-1/2 bg-card rounded-card p-4 items-center border border-border">
              <MaterialIcons name="inventory_2" size={32} color="#2A9D8F" />
              <Text className="text-foreground text-sm font-semibold mt-2">Inventario</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/balance" asChild>
            <TouchableOpacity className="flex-1 min-w-1/2 bg-card rounded-card p-4 items-center border border-border">
              <MaterialIcons name="receipt" size={32} color="#2A9D8F" />
              <Text className="text-foreground text-sm font-semibold mt-2">Cuadre</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/history" asChild>
            <TouchableOpacity className="flex-1 min-w-1/2 bg-card rounded-card p-4 items-center border border-border">
              <MaterialIcons name="history" size={32} color="#2A9D8F" />
              <Text className="text-foreground text-sm font-semibold mt-2">Historial</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
