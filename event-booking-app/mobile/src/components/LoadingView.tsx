import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppTheme } from '../constants/appTheme';

export default function LoadingView({ text = 'Loading...' }: { text?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppTheme.colors.blue} />
      <Text style={styles.text}>{text}</Text>
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
  text: {
    marginTop: 12,
    color: AppTheme.colors.navyDeep,
    fontSize: 14,
    fontWeight: '700',
  },
});
