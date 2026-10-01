import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppTheme } from '../constants/appTheme';

export default function EmptyView({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📭</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: AppTheme.colors.ice,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: AppTheme.colors.muted,
    textAlign: 'center',
    fontWeight: '600',
  },
});
