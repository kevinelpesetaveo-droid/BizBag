import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopBar } from '../components/ui/TopBar';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/TextInput';
import { SheetModal } from '../components/ui/SheetModal';
import { Card } from '../components/ui/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as supabase from '../lib/supabase/client';
import { generateAccessKey, daysUntilExpiry, generateID, formatDate } from '../lib/utils/helpers';
import { User } from '../types';

export default function AdminScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [formData, setFormData] = useState({ businessName: '', plan: '30' });

  const authenticateAdmin = async () => {
    const isValid = await supabase.validateAdminPassword(adminPassword);
    if (isValid) {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      await loadUsers();
    } else {
      setPasswordError('Contraseña incorrecta');
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await supabase.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!formData.businessName.trim()) {
      alert('Ingresa el nombre del negocio');
      return;
    }

    const accessKey = generateAccessKey();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + parseInt(formData.plan));

    const newUser: Omit<User, 'id'> = {
      business_name: formData.businessName,
      access_key: accessKey,
      device_id: '',
      expiration_date: expirationDate.toISOString(),
      is_blocked: false,
      role: 'user',
      payment_date: new Date().toISOString(),
    };

    try {
      const created = await supabase.createUser(newUser);
      if (created) {
        alert(`✅ Usuario creado\nClave: ${accessKey}`);
        await loadUsers();
        setFormData({ businessName: '', plan: '30' });
        setShowCreateUserModal(false);
      }
    } catch (error) {
      alert('Error creando usuario');
    }
  };

  if (showPasswordModal && !isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-4">
          <MaterialIcons name="lock" size={64} color="#2A9D8F" />
          <Text className="text-foreground text-2xl font-bold mt-4">Panel de Admin</Text>
          <Text className="text-muted text-center mt-2">Ingresa tu contraseña</Text>

          <TextInput
            label="Contraseña"
            placeholder="Ingresa la contraseña"
            value={adminPassword}
            onChangeText={(text) => {
              setAdminPassword(text);
              setPasswordError('');
            }}
            secureTextEntry
            error={passwordError}
            style={{ marginTop: 24, width: '100%' }}
          />

          <Button
            title="Acceder"
            onPress={authenticateAdmin}
            style={{ marginTop: 24, width: '100%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Administración" showNotifications={false} />

      <ScrollView className="flex-1 px-4 py-4">
        {loading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="#2A9D8F" />
          </View>
        ) : (
          <>
            <Text className="text-foreground text-lg font-bold mb-3">Usuarios Activos ({users.length})</Text>

            {users.map((user) => {
              const daysLeft = daysUntilExpiry(user.expiration_date);
              const statusColor = !user.is_blocked && daysLeft > 0 ? 'text-success' : 'text-destructive';
              const statusText = user.is_blocked ? 'Bloqueado' : daysLeft <= 0 ? 'Vencido' : 'Activo';

              return (
                <Card
                  key={user.id}
                  title={user.business_name}
                  subtitle={`${user.access_key} | ${daysLeft}d`}
                  value={statusText}
                  style={{ marginBottom: 12 }}
                />
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Botón flotante */}
      <TouchableOpacity
        onPress={() => setShowCreateUserModal(true)}
        className="absolute bottom-20 right-4 w-16 h-16 rounded-full bg-primary items-center justify-center shadow-lg"
      >
        <MaterialIcons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* Modal crear usuario */}
      <SheetModal
        visible={showCreateUserModal}
        title="Crear Nuevo Usuario"
        description="Completa los datos del negocio"
        onClose={() => setShowCreateUserModal(false)}
        onConfirm={handleCreateUser}
        confirmText="Crear Usuario"
      >
        <TextInput
          label="Nombre del Negocio"
          placeholder="Ej: Panadería El Trigo"
          value={formData.businessName}
          onChangeText={(text) => setFormData({ ...formData, businessName: text })}
        />
        <View style={{ marginTop: 12 }}>
          <Text className="text-foreground font-semibold mb-2 text-sm">Plan (días)</Text>
          <View className="flex-row gap-2">
            {['7', '30', '90'].map((days) => (
              <TouchableOpacity
                key={days}
                onPress={() => setFormData({ ...formData, plan: days })}
                className={`flex-1 py-2 rounded-input items-center ${
                  formData.plan === days ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Text className={formData.plan === days ? 'text-white font-bold' : 'text-foreground'}>
                  {days}d
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SheetModal>
    </SafeAreaView>
  );
}
