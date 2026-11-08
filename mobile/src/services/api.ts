
import { Platform } from 'react-native';

// Se rodar no emulador Android -> 10.0.2.2
// Se rodar no iOS Simulator ou Web -> localhost
// Se for celular físico -> troque pelo IP da sua máquina (ex: 192.168.15.5)
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:8000',
  ios: 'http://localhost:8000',
  default: 'http://localhost:8000',
});

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_API_URL;