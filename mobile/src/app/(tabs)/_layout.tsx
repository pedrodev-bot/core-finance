import { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../stores/useThemeStore';
import { GlobalFAB } from '../../components/GlobalFAB';

export default function TabLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);

  const handleNavigate = (route: string) => {
    setIsMenuOpen(false);
    router.replace(route as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={props.onPress}
              onLongPress={props.onLongPress}
              accessibilityRole={props.accessibilityRole}
              accessibilityState={props.accessibilityState}
              style={props.style}
              activeOpacity={0.7}
            >
              {props.children}
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: theme.tabBarBg,
            borderTopColor: theme.tabBarBorder,
            elevation: 0,
            borderTopWidth: 1,
            paddingTop: 6,
          },
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            headerShown: false,
            tabBarIcon: ({ color }: any) => <Ionicons name="home-outline" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transações',
            headerShown: false,
            tabBarIcon: ({ color }: any) => <Ionicons name="wallet-outline" size={22} color={color} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }: any) => <Ionicons name="menu-outline" size={22} color={color} />,
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

      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsMenuOpen(false)}>
          <View style={[styles.modalBackdrop, { backgroundColor: theme.modalOverlay }]}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.floatingBox,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  },
                ]}
              >
                <View style={[styles.boxHeader, { borderBottomColor: theme.cardBorder }]}>
                  <Text style={[styles.boxTitle, { color: theme.textPrimary }]}>Navegação</Text>
                  <TouchableOpacity
                    onPress={() => setIsMenuOpen(false)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={20} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => handleNavigate('/')}
                >
                  <Ionicons name="home-outline" size={20} color={theme.textPrimary} />
                  <Text style={[styles.menuText, { color: theme.textPrimary }]}>Início</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  activeOpacity={0.7}
                  onPress={() => handleNavigate('/transactions')}
                >
                  <Ionicons name="wallet-outline" size={20} color={theme.textPrimary} />
                  <Text style={[styles.menuText, { color: theme.textPrimary }]}>Transações</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  floatingBox: {
    width: 230,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginRight: 16,
    marginBottom: 85,
  },
  boxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  boxTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});