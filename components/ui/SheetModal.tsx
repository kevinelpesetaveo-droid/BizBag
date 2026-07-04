import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SheetModalProps {
  visible: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  hasFooter?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const SheetModal: React.FC<SheetModalProps> = ({
  visible,
  title,
  description,
  onClose,
  children,
  hasFooter = true,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-card rounded-t-3xl max-h-4/5">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-border">
              <Text className="text-foreground text-lg font-bold">{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color="#1A1D24" />
              </TouchableOpacity>
            </View>

            {/* Description */}
            {description && (
              <Text className="text-muted text-sm px-4 pt-2 pb-4">{description}</Text>
            )}

            {/* Content */}
            <ScrollView className="px-4 py-4 flex-1">
              {children}
            </ScrollView>

            {/* Footer */}
            {hasFooter && (
              <View className="flex-row gap-3 p-4 border-t border-border">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 bg-muted rounded-input py-3 items-center"
                >
                  <Text className="text-foreground font-semibold">{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 rounded-input py-3 items-center ${
                    isLoading ? 'bg-primary/50' : 'bg-primary'
                  }`}
                >
                  <Text className="text-white font-semibold">
                    {isLoading ? 'Guardando...' : confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
