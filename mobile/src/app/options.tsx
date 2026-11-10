import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../stores/useThemeStore';

export default function OptionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);

  const menuItems = [
    {
      id: 'settings',
      icon: 'settings' as const,
      title: t('options.settings.title'), 
      subtitle: t('options.settings.subtitle'),
      action: () => router.push('/settings' as any),
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {t('options.header')}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        {menuItems.map((item, index) => {
          const isLast = index === menuItems.length - 1;
          
          return (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.cardBorder }]}
              activeOpacity={0.7}
              onPress={item.action}
            >
              <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
                <Feather name={item.icon} size={20} color={theme.textPrimary} />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
              </View>

              <Feather name="chevron-right" size={20} color={theme.textSecondary} />
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
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
  },
  rowSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});