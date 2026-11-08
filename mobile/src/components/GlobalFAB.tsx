import { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { useThemeStore } from '../stores/useThemeStore';

const VISIBLE_ROUTES = ['/', '/transactions']; 

export function GlobalFAB() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);

  const isVisible = VISIBLE_ROUTES.includes(pathname);

  if (!isVisible) return null;

  const handleNavigate = (type: string) => {
    setIsOpen(false);
    router.push({ pathname: '/new', params: { type } } as any);
  };

  return (
    <>
      <Pressable 
        style={[styles.fab, { backgroundColor: theme.accent }]} 
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="add" size={28} color="#000" />
      </Pressable>

      <Modal 
        visible={isOpen} 
        transparent 
        animationType="fade"
        statusBarTranslucent
        >
        <TouchableOpacity 
          style={[styles.overlay, { backgroundColor: theme.modalOverlay }]} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.menu, { backgroundColor: theme.card }]}>
            
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>
                O que deseja registrar?
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: theme.cardBorder }]} 
              onPress={() => handleNavigate('expense')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                <Ionicons name="arrow-down" size={20} color={theme.expense} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>Despesa</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: theme.cardBorder }]} 
              onPress={() => handleNavigate('income')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                <Ionicons name="arrow-up" size={20} color={theme.income} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>Receita</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: theme.cardBorder }]} 
              onPress={() => handleNavigate('investment')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(14, 165, 233, 0.15)' }]}>
                <Ionicons name="wallet" size={20} color={theme.investment} />
              </View>
              <Text style={[styles.menuText, { color: theme.textPrimary }]}>Investimento</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', 
    bottom: 90, 
    right: 24, 
    width: 60, 
    height: 60,
    borderRadius: 30, 
    justifyContent: 'center',
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, 
    shadowRadius: 4.65, 
    elevation: 8,
  },
  overlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
  },
  menu: { 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    padding: 24, 
    paddingBottom: 60,
    marginBottom: -20,
  },
  menuHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20, 
  },
  menuTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
  },
  closeButton: { 
    padding: 4, 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
  },
  iconContainer: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  menuText: { 
    fontSize: 16, 
    marginLeft: 16, 
    fontWeight: '500', 
  },
});