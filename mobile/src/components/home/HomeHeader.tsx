import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useUIStore } from '../../stores/useUIStore';
import { useTranslation } from 'react-i18next';

interface HomeHeaderProps {
  userName: string;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  const { isValuesHidden, toggleValuesVisibility } = useUIStore();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.subtitle}>{t('home.header.title')}</Text>
        <Text style={styles.title}>{t('home.header.greeting', { userName })}</Text>
      </View>
      
      <TouchableOpacity 
        onPress={toggleValuesVisibility} 
        activeOpacity={0.7}
        style={styles.iconButton}
      >
        <Feather 
          name={isValuesHidden ? 'eye-off' : 'eye'} 
          size={24} 
          color="#8E8E93" 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E24',
    backgroundColor: '#121216',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginRight: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
  }
});