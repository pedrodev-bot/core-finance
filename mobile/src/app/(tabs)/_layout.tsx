import { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlobalFAB } from '../../components/GlobalFAB';

export default function TabLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigate = (route: string) => {
    setIsMenuOpen(false);
    router.replace(route as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#a3e635',
        tabBarInactiveTintColor: '#888',
      }}>
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Início',
            tabBarIcon: ({ color }: any) => <Ionicons name="home-outline" size={24} color={color} />
          }} 
        />
        <Tabs.Screen 
          name="transactions" 
          options={{ 
            title: 'Transações', 
            headerShown: false,
            tabBarIcon: ({ color }: any) => <Ionicons name="wallet-outline" size={24} color={color} />
          }} 
        />
        <Tabs.Screen 
          name="menu" 
          options={{ 
            title: 'Menu',
            tabBarIcon: ({ color }: any) => <Ionicons name="menu-outline" size={24} color={color} />
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); 
              setIsMenuOpen(true); 
            },
          }}
        />
      </Tabs>
      
      <GlobalFAB />

      <Modal visible={isMenuOpen} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={() => setIsMenuOpen(false)} 
        >
          <View style={styles.floatingBox}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>Navegação</Text>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Ionicons name="close" size={24} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('/')}>
              <Ionicons name="home-outline" size={20} color="#4b5563" />
              <Text style={styles.menuText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('/transactions')}>
              <Ionicons name="list-outline" size={20} color="#4b5563" />
              <Text style={styles.menuText}>Transações</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end', 
  },
  floatingBox: {
    backgroundColor: '#fff',
    width: 220,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    marginBottom: 90, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  boxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#374151',
    fontWeight: '500',
  },
});