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

export default function LoginScreen() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha usuário e senha.');
      return;
    }

    try {
      setLoading(true);
      const action = isRegistering ? registerRequest : loginRequest;
      const data = await action(username.trim(), password);

      if (!data || !data.token || !data.user) {
      throw new Error('Servidor não retornou os dados de autenticação.');
    }
    
      await login(data.token, data.user);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha na requisição.');
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
        <Text style={styles.brandTitle}>Core Finance</Text>
        <Text style={styles.subtitle}>
          {isRegistering ? 'Crie sua conta para começar' : 'Entre com sua conta'}
        </Text>

        <TextInput
          placeholder="Usuário"
          placeholderTextColor="#8E8E93"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Senha"
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
              {isRegistering ? 'Cadastrar e Entrar' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsRegistering(!isRegistering)}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isRegistering
              ? 'Já tem uma conta? Entrar'
              : 'Não tem conta? Crie uma agora'}
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