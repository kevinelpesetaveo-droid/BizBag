import React from 'react';
import { TextInput as RNTextInput, View, Text, ViewStyle } from 'react-native';

interface TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  style?: ViewStyle;
  label?: string;
  error?: string;
  maxLength?: number;
}

export const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  editable = true,
  multiline = false,
  style,
  label,
  error,
  maxLength,
}) => {
  return (
    <View style={style}>
      {label && <Text className="text-foreground font-semibold mb-2 text-sm">{label}</Text>}
      <RNTextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={editable}
        multiline={multiline}
        maxLength={maxLength}
        placeholderTextColor="#E2E8F0"
        className={`bg-muted text-foreground rounded-input px-4 py-3 font-medium ${
          multiline ? 'text-left' : 'text-base'
        } ${!editable ? 'opacity-50' : ''} ${error ? 'border-2 border-destructive' : ''}`}
        style={{
          textAlignVertical: multiline ? 'top' : 'center',
          minHeight: multiline ? 100 : 48,
        }}
      />
      {error && <Text className="text-destructive text-xs mt-1">{error}</Text>}
    </View>
  );
};
