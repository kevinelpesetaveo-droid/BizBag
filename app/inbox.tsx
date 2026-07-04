import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBizBagStore } from '../../lib/store/useBizBagStore';
import { TopBar } from '../../components/ui/TopBar';
import { Button } from '../../components/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDate } from '../../lib/utils/helpers';
import { router } from 'expo-router';

export default function InboxScreen() {
  const { messages, markMessageAsRead, loadMessages } = useBizBagStore();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const selectedMessageData = messages.find((m) => m.id === selectedMessage);

  const handleSelectMessage = (messageId: string) => {
    markMessageAsRead(messageId);
    setSelectedMessage(messageId);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TopBar title="Buzón" showNotifications={false} />

      <View className="flex-1">
        {selectedMessage && selectedMessageData ? (
          // Vista de detalle del mensaje
          <ScrollView className="flex-1 px-4 py-4">
            <TouchableOpacity
              onPress={() => setSelectedMessage(null)}
              className="flex-row items-center gap-2 mb-4"
            >
              <MaterialIcons name="arrow_back" size={24} color="#2A9D8F" />
              <Text className="text-primary font-semibold">Volver</Text>
            </TouchableOpacity>

            <View className="bg-card rounded-card p-4 border border-border mb-4">
              <Text className="text-foreground text-2xl font-bold">{selectedMessageData.title}</Text>
              <Text className="text-muted text-xs mt-2">{formatDate(selectedMessageData.date)}</Text>
              <Text className="text-foreground text-base mt-4 leading-6">{selectedMessageData.body}</Text>
            </View>
          </ScrollView>
        ) : (
          // Vista de lista de mensajes
          <ScrollView className="flex-1">
            {messages.length === 0 ? (
              <View className="items-center justify-center py-12">
                <MaterialIcons name="mail_outline" size={48} color="#E2E8F0" />
                <Text className="text-muted text-center mt-4">No hay mensajes</Text>
              </View>
            ) : (
              <View className="px-4 py-4">
                {messages.map((message) => (
                  <TouchableOpacity
                    key={message.id}
                    onPress={() => handleSelectMessage(message.id)}
                    className={`bg-card rounded-card p-4 mb-3 border ${
                      message.read ? 'border-border' : 'border-primary bg-primary/5'
                    } flex-row items-center`}
                  >
                    <View className="flex-1">
                      <Text className={`${
                        message.read ? 'font-normal' : 'font-bold'
                      } text-foreground`}>
                        {message.title}
                      </Text>
                      <Text className="text-muted text-xs mt-1">{formatDate(message.date)}</Text>
                    </View>
                    {!message.read && (
                      <View className="w-2 h-2 rounded-full bg-primary ml-2" />
                    )}
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
