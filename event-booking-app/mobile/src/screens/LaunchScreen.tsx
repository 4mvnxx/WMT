import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../constants/appTheme';

export default function LaunchScreen() {
  const navigation = useNavigation<any>();
  const pulse = useRef(new Animated.Value(0.75)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 850, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.75, duration: 850, useNativeDriver: true }),
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.container}>
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎟️</Text>
          </View>
          <Text style={styles.brandMark}>Event Hub</Text>
          <Text style={styles.heroTitle}>Simple booking for users and admins.</Text>
          <Text style={styles.heroText}>
            Open events, bookings, and management tools in a clean mobile experience.
          </Text>
        </View>

        <View style={styles.actionBlock}>
          <View style={styles.buttonRow}>
            <Animated.View style={[styles.rowButton, styles.primaryWrapper, { opacity: pulse }]}>
              <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Login', { role: 'user' })}>
                <Text style={styles.primaryButtonText}>Login</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={[styles.rowButton, styles.secondaryWrapper, { opacity: pulse }]}>
              <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.secondaryButtonText}>Register</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.navy,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    gap: 18,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(56, 189, 248, 0.18)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -40,
    left: -30,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
  },
  logoWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 96,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 42,
  },
  brandMark: {
    color: AppTheme.colors.white,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: 0.8,
    fontSize: 24,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
    color: AppTheme.colors.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  heroText: {
    color: '#dbeafe',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  actionBlock: {
    gap: 12,
    paddingBottom: 22,
    marginTop: -4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rowButton: {
    flex: 1,
  },
  primaryWrapper: {
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderRadius: 16,
  },
  secondaryWrapper: {
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 7 },
    elevation: 3,
    borderRadius: 16,
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.blue,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
  },
  primaryButtonText: {
    color: AppTheme.colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: AppTheme.colors.navyDeep,
    fontWeight: '800',
    fontSize: 16,
  },
});
