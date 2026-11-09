import { Stack } from 'expo-router';
import { useThemeStore } from '../../../stores/useThemeStore';
import { useTranslation } from 'react-i18next';


export default function TransactionsLayout() {
  const { t } = useTranslation();
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
          title: t('transactions.list.title'),
        }}
      />
    </Stack>
  );
}