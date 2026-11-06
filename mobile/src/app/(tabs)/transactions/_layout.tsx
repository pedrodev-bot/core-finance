import { Stack } from 'expo-router';

export default function TransactionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Minhas Transações' }} />
      <Stack.Screen name="new" options={{ title: 'Nova Transação', presentation: 'modal' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalhes da Transação' }} />
    </Stack>
  );
}