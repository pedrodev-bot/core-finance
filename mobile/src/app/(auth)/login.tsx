import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../stores/useAuthStore';
import { loginRequest, registerRequest } from '../../services/authService';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      Alert.alert(t('common.attention'), t('auth.login.alerts.missingCredentials'));
      return;
    }

    try {
      setLoading(true);
      const action = isRegistering ? registerRequest : loginRequest;
      const data = await action(username.trim(), password);

      if (!data || !data.token || !data.user) {
      throw new Error(t('auth.login.errors.missingAuthData'));
    }
    
      await login(data.token, data.user);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('auth.login.errors.requestFailed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.formCard}>
        <Text style={styles.brandTitle}>{t('auth.login.brandTitle')}</Text>
        <Text style={styles.subtitle}>
          {isRegistering ? t('auth.login.subtitle.register') : t('auth.login.subtitle.signIn')}
        </Text>

        <TextInput
          placeholder={t('auth.login.placeholders.username')}
          placeholderTextColor="#8E8E93"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder={t('auth.login.placeholders.password')}
          placeholderTextColor="#8E8E93"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <Text style={styles.buttonText}>
              {isRegistering ? t('auth.login.buttons.registerAndSignIn') : t('auth.login.buttons.signIn')}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isRegistering ? t('auth.login.switchMode.toLogin') : t('auth.login.switchMode.toRegister')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121216',
    justifyContent: 'center',
    padding: 24,
  },
  formCard: {
    backgroundColor: '#1E1E24',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A2A32',
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#121216',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A32',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#9EF01A',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  switchText: {
    color: '#0A84FF',
    fontSize: 13,
    fontWeight: '500',
  },
});