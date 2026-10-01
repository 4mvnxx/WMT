import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FormInput from '../components/FormInput';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validators';
import { AppTheme } from '../constants/appTheme';

export default function LoginScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const role = route?.params?.role || 'user';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {
      email: validateEmail(email) ? '' : 'Enter a valid email',
      password: validatePassword(password),
    };

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      await login(response.data);
    } catch (error: any) {
      Alert.alert('Login failed', error?.response?.data?.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backgroundGlowTop} />
      <View style={styles.backgroundGlowBottom} />

      <View style={styles.card}>
        <View style={styles.topIconWrap}>
          <Text style={styles.bannerEmoji}>{role === 'admin' ? '👑' : '👤'}</Text>
        </View>
        <Text style={styles.eyebrow}>Welcome back</Text>
        <Text style={styles.title}>Let’s sign you in</Text>
        <Text style={styles.subtitle}>A clean mobile experience built for event lovers and admins.</Text>

        <FormInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) ? '' : 'Enter a valid email' }))}
          placeholder="you@example.com"
          keyboardType="email-address"
          error={errors.email}
          variant="dark"
        />

        <FormInput
          label="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          onBlur={() => setErrors((prev) => ({ ...prev, password: validatePassword(password) }))}
          placeholder="••••••••"
          secureTextEntry
          error={errors.password}
          variant="dark"
        />

        <Pressable style={[styles.primaryButton, loading && styles.primaryButtonDisabled]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.primaryButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Register
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: AppTheme.colors.navy,
  },
  backgroundGlowTop: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 170,
    height: 170,
    borderRadius: 170,
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
  },
  backgroundGlowBottom: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 210,
    height: 210,
    borderRadius: 210,
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
  },
  topIconWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerEmoji: {
    fontSize: 36,
  },
  card: {
    backgroundColor: AppTheme.colors.navyDeep,
    borderRadius: AppTheme.radius.large,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6,
  },
  eyebrow: {
    color: AppTheme.colors.blue,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: AppTheme.colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.blue,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: AppTheme.colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    gap: 8,
  },
  footerText: {
    color: '#94a3b8',
  },
  link: {
    color: AppTheme.colors.blue,
    fontWeight: '700',
  },
});
