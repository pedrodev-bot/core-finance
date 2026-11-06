import { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

const LIME_GREEN = '#a3e635';
const VISIBLE_ROUTES = ['/', '/transactions']; 

export function GlobalFAB() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isVisible = VISIBLE_ROUTES.includes(pathname);

  if (!isVisible) return null;

  const handleNavigate = (type: string) => {
    setIsOpen(false);
    router.push({ pathname: '/new', params: { type } } as any);
  };

  return (
    <>
      <Pressable style={styles.fab} onPress={() => setIsOpen(true)}>
        <Ionicons name="add" size={28} color="#000" />
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setIsOpen(false)}>
          <View style={styles.menu}>
            
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>O que deseja registrar?</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color="#d1d5db" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('expense')}>
              <View style={[styles.iconContainer, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="arrow-down" size={20} color="#ef4444" />
              </View>
              <Text style={styles.menuText}>Despesa (Gasto)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('income')}>
              <View style={[styles.iconContainer, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="arrow-up" size={20} color="#22c55e" />
              </View>
              <Text style={styles.menuText}>Receita (Entrada)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('investment')}>
              <View style={[styles.iconContainer, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="wallet" size={20} color="#0ea5e9" />
              </View>
              <Text style={styles.menuText}>Investimento (Guardar)</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute', bottom: 90, right: 24, width: 60, height: 60,
    borderRadius: 30, backgroundColor: LIME_GREEN, justifyContent: 'center',
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8,
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menu: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  closeButton: { padding: 4 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 16, marginLeft: 16, color: '#374151', fontWeight: '500' }
});