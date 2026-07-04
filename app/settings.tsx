import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBizBagStore } from '../lib/store/useBizBagStore';
import { TopBar } from '../components/ui/TopBar';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { MaterialIcons } from '@expo/vector-icons';
import { daysUntilExpiry, formatDate } from '../lib/utils/helpers';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { userName, expiry, accountStatus, darkMode, toggleDarkMode, logout } = useBizBagStore();
  const [businessName, setBusinessName] = useState(userName);
  const [adminTaps, setAdminTaps] = useState(0);
  const daysLeft = daysUntilExpiry(expiry);

  const handleAdminTap = () => {
    setAdminTaps(adminTaps + 1);
    if (adminTaps === 6) {
      router.push('/admin');
      setAdminTaps(0);
    }
  };

  const statusColor = accountStatus === 'active' ? 'text-success' : accountStatus === 'expired' ? 'text-warning' : 'text-destructive';
  const statusText = accountStatus === 'active' ? 'Activa' : accountStatus === 'expired' ? 'Vencida' : 'Bloqueada';

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Ajustes" showNotifications={false} />

      <ScrollView className="flex-1 px-4 py-4">
        {/* Información de Cuenta */}
        <View className="bg-card rounded-card p-4 border border-border mb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-bold">Suscripción</Text>
            <View className={`px-3 py-1 rounded-chip ${
              accountStatus === 'active' ? 'bg-success/20' : accountStatus === 'expired' ? 'bg-warning/20' : 'bg-destructive/20'
            }`}>
              <Text className={`text-xs font-semibold ${
                accountStatus === 'active' ? 'text-success' : accountStatus === 'expired' ? 'text-warning' : 'text-destructive'
              }`}>
                {statusText}
              </Text>
            </View>
          </View>
          <Text className="text-muted text-sm mb-2">Días restantes</Text>
          <Text className="text-primary text-3xl font-bold">{daysLeft}</Text>
          <Text className="text-muted text-xs mt-2">Vence: {formatDate(expiry)}</Text>
        </View>

        {/* Nombre del Negocio */}
        <TextInput
          label="Nombre del Negocio"
          placeholder="Tu negocio"
          value={businessName}
          onChangeText={setBusinessName}
          style={{ marginBottom: 12 }}
        />

        {/* Opciones de App */}
        <View className="bg-card rounded-card p-4 border border-border mb-4">
          <View className="flex-row items-center justify-between mb-3 pb-3 border-b border-border">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="dark_mode" size={24} color="#2A9D8F" />
              <View>
                <Text className="text-foreground font-semibold">Modo Oscuro</Text>
                <Text className="text-muted text-xs mt-1">Activa el tema oscuro</Text>
              </View>
            </View>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>

        {/* Botón de Cerrar Sesión */}
        <Button
          title="Cerrar Sesión"
          onPress={() => {
            logout();
            router.replace('/');
          }}
          variant="destructive"
          size="lg"
          style={{ marginBottom: 20 }}
        />

        {/* Botón Oculto para Admin */}
        <TouchableOpacity
          onPress={handleAdminTap}
          className="items-center py-6"
        >
          <MaterialIcons name="admin_panel_settings" size={32} color="#E2E8F0" />
          <Text className="text-muted text-xs mt-1">Admin ({adminTaps}/7)</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
