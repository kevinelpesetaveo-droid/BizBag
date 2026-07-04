import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useBizBagStore } from '../lib/store/useBizBagStore';
import * as supabaseClient from '../lib/supabase/client';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { router } from 'expo-router';
import { getDeviceId } from '../lib/utils/helpers';

const DEFAULT_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const DEFAULT_SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export default function LoginScreen() {
  const { setUser } = useBizBagStore();
  const [accessKey, setAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConnectionInfo, setShowConnectionInfo] = useState(!DEFAULT_SUPABASE_URL);

  const handleLogin = async () => {
    if (!accessKey.trim()) {
      setError('Ingresa tu clave de acceso');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!DEFAULT_SUPABASE_URL || !DEFAULT_SUPABASE_KEY) {
        setError('⚠️ Supabase no está configurado. Contacta al administrador.');
        setLoading(false);
        return;
      }

      const user = await supabaseClient.validateAccessKey(accessKey);

      if (!user) {
        setError('Clave de acceso inválida');
        setLoading(false);
        return;
      }

      // Verificar si está bloqueado o vencido
      const now = new Date();
      const expiryDate = new Date(user.expiration_date);
      let status: 'active' | 'blocked' | 'expired' = 'active';

      if (user.is_blocked) {
        status = 'blocked';
        setError('Tu cuenta ha sido bloqueada. Contacta al administrador.');
      } else if (expiryDate < now) {
        status = 'expired';
        setError('Tu suscripción ha vencido. Contacta al administrador.');
      } else {
        // Login exitoso
        setUser(user.business_name, user.expiration_date, status, user.id);
        router.replace('/(tabs)/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error de conexión. Verifica tu internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactAdmin = () => {
    Linking.openURL('https://wa.me/?text=Necesito%20ayuda%20con%20BizBag');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 items-center justify-center px-4 py-8">
        {/* Logo */}
        <View className="mb-8 items-center">
          <View className="bg-primary rounded-full p-6 mb-4">
            <MaterialIcons name="shopping_bag" size={48} color="white" />
          </View>
          <Text className="text-foreground text-3xl font-bold">BizBag</Text>
          <Text className="text-muted text-center mt-2">Control de Inventario y Cuadre</Text>
        </View>

        {/* Formulario */}
        <View className="w-full">
          <TextInput
            label="Clave de Acceso"
            placeholder="Ej: BIZBAG-XXXX"
            value={accessKey}
            onChangeText={(text) => {
              setAccessKey(text.toUpperCase());
              setError('');
            }}
            editable={!loading}
            error={error}
          />

          <Button
            title={loading ? 'Validando...' : 'Acceder'}
            onPress={handleLogin}
            disabled={loading}
            loading={loading}
            style={{ marginTop: 20 }}
          />
        </View>

        {/* Botón Contactar Admin */}
        <TouchableOpacity
          onPress={handleContactAdmin}
          className="mt-8 flex-row items-center gap-2"
        >
          <MaterialIcons name="help_outline" size={20} color="#2A9D8F" />
          <Text className="text-primary font-semibold">Contactar Administrador</Text>
        </TouchableOpacity>

        {/* Info de Conexión */}
        {showConnectionInfo && (
          <View className="mt-8 w-full bg-warning/10 rounded-card p-4 border border-warning">
            <Text className="text-warning font-bold mb-2">⚙️ Configuración Requerida</Text>
            <Text className="text-warning text-xs mb-3">
              Supabase no está configurado. Para usar la app, necesitas:
            </Text>
            <View className="bg-white/10 rounded-input p-3">
              <Text className="text-warning text-xs font-mono mb-2 selectable">
                EXPO_PUBLIC_SUPABASE_URL
              </Text>
              <Text className="text-warning text-xs font-mono selectable">
                EXPO_PUBLIC_SUPABASE_ANON_KEY
              </Text>
            </View>
            <Button
              title="Entendido"
              onPress={() => setShowConnectionInfo(false)}
              variant="outline"
              size="sm"
              style={{ marginTop: 12 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
