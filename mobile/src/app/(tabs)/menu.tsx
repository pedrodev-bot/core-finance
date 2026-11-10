import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function MenuScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'settings',
      icon: 'settings' as const,
      title: t('menu.settings.title', 'Configurações'), 
      subtitle: t('menu.settings.subtitle', 'Idioma, tema e preferências'),
      action: () => router.push('/settings' as any),
    },
    {
      id: 'help',
      icon: 'help-circle' as const,
      title: t('menu.help.title', 'Ajuda e Suporte'),
      subtitle: t('menu.help.subtitle', 'Dúvidas e atendimento'),
      action: () => console.log('Navegar para ajuda'),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>{t('menu.header', 'Menu')}</Text>

      <View style={styles.card}>
        {menuItems.map((item, index) => {
          const isLast = index === menuItems.length - 1;
          
          return (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.row, !isLast && styles.rowBorder]}
              activeOpacity={0.7}
              onPress={item.action}
            >
              <View style={styles.iconContainer}>
                <Feather name={item.icon} size={20} color="#FFFFFF" />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
              </View>

              <Feather name="chevron-right" size={20} color="#3f3f46" />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121216',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1E1E24',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A32',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A32',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#2A2A32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
});