import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useTransactionStore } from '../stores/transactionStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useThemeStore } from '../stores/useThemeStore';
import CurrencyInput from 'react-native-currency-input';

export default function NewTransactionScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const { type } = useLocalSearchParams();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const currentUserId = useAuthStore((state) => state.user?.id);
  
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const isExpense = type === 'expense';
  const isIncome = type === 'income';

  const screenTitle = isExpense ? 'Nova Despesa' : isIncome ? 'Nova Receita' : 'Novo Investimento';
  const placeholderText = isExpense ? 'Com o que gastou?' : isIncome ? 'Origem do dinheiro?' : 'Onde investiu?';
  const themeColor = isExpense ? theme.expense : isIncome ? theme.income : theme.investment;

  const handleSave = () => {
    if (!amount || !description) return;

    addTransaction({
      userId: currentUserId || '',
      amount,
      description,
      type: type as 'expense' | 'income' | 'investment',
      date: new Date().toISOString(),
    });

    router.back();
  };

return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: screenTitle,
          headerTintColor: themeColor,
          headerTitleStyle: {
            fontWeight: '700',
            color: themeColor,
          },
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerShadowVisible: false,
        }}
      />

      <CurrencyInput
        value={amount}
        onChangeValue={setAmount}
        prefix="R$ "
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
        placeholder="Valor (R$)"
        placeholderTextColor={theme.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
            color: theme.textPrimary,
          },
        ]}
        cursorColor={themeColor}
        selectionColor={themeColor}
      />

      <TextInput
        placeholder={placeholderText}
        placeholderTextColor={theme.textMuted}
        value={description}
        onChangeText={setDescription}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
            color: theme.textPrimary,
          },
        ]}
        cursorColor={themeColor}
        selectionColor={themeColor}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColor }]}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});