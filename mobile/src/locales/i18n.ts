import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ptBR from './pt-BR.json';
import enUS from './en-US.json';

const resources = {
  'pt-BR': { translation: ptBR },
  'pt': { translation: ptBR },
  'en-US': { translation: enUS },
  'en': { translation: enUS }
};

const LANGUAGE_STORAGE_KEY = '@core_finance_language';

const languageDetectorPlugin = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async function (callback: (lang: string) => void) {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      if (savedLanguage) {
        return callback(savedLanguage);
      }
    } catch (error) {
        if (__DEV__) {
            console.error('Erro ao ler idioma salvo:', error);
        }
    }
    
    const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'en-US';
    callback(deviceLanguage);
  },
  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
        if (__DEV__) {
            console.error('Erro ao salvar idioma:', error);
        }
    }
  }
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false, 
    },
    react: {
        useSuspense: false
    },
  });

export default i18n;