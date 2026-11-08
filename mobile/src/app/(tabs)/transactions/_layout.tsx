import { Stack } from 'expo-router';
import { useThemeStore } from '../../../stores/useThemeStore';

export default function TransactionsLayout() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTintColor: theme.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Minhas Transações',
        }}
      />
    </Stack>
  );
}