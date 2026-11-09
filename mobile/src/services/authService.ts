import { API_BASE_URL } from './api';
import { Platform } from 'react-native';
import i18n from '../locales/i18n';

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
const TOKEN_KEY = 'core_finance_auth_token';
const USER_KEY = 'core_finance_auth_user';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
  };
}

export async function loginRequest(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || i18n.t('auth.errors.loginFailed'));
  }

  return response.json();
}

export async function registerRequest(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Erro ao criar conta.');
  }

  return response.json();
}