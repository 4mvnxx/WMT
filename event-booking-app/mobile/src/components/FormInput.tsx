import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppTheme } from '../constants/appTheme';

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  error,
  multiline,
  numberOfLines,
  variant,
  onBlur,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  variant?: 'light' | 'dark';
  onBlur?: () => void;
}) {
  const isDark = variant === 'dark';
  return (
    <View style={styles.container}>
      <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={secureTextEntry ? 'none' : 'words'}
        textAlignVertical={multiline ? 'top' : 'center'}
        placeholderTextColor={isDark ? "#94a3b8" : AppTheme.colors.muted}
        onBlur={onBlur}
        style={[
          styles.input,
          isDark && styles.inputDark,
          multiline ? styles.multilineInput : null,
          error ? styles.inputError : null
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: AppTheme.colors.navyDeep,
  },
  labelDark: {
    color: AppTheme.colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: AppTheme.colors.white,
    color: AppTheme.colors.text,
  },
  inputDark: {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: AppTheme.colors.navy,
    color: AppTheme.colors.white,
  },
  multilineInput: {
    minHeight: 110,
    paddingTop: 14,
  },
  inputError: {
    borderColor: AppTheme.colors.danger,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    color: AppTheme.colors.danger,
  },
});
