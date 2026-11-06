import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useTransactionStore } from '../store/transactionStore';
import CurrencyInput from 'react-native-currency-input';

const LIME_GREEN = '#a3e635';

export default function NewTransactionScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  const isExpense = type === 'expense';
  const isIncome = type === 'income';

  const screenTitle = isExpense ? 'Nova Despesa' : isIncome ? 'Nova Receita' : 'Novo Investimento';
  const placeholderText = isExpense ? 'Com o que gastou?' : isIncome ? 'Origem do dinheiro?' : 'Onde investiu?';
  const themeColor = isExpense ? '#ef4444' : isIncome ? '#22c55e' : '#0ea5e9';

  const handleSave = () => {
    if (!amount || !description) return;

    addTransaction({
      amount,
      description,
      type: type as 'expense' | 'income' | 'investment',
      date: new Date().toISOString(),
    });

    router.back();
  };

return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: screenTitle, 
          headerTintColor: themeColor,
          headerBackTitle: ''
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
        style={styles.input}
        cursorColor={themeColor}
        selectionColor={themeColor}
      />
      <TextInput
        placeholder={placeholderText}
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        cursorColor={themeColor}
        selectionColor={themeColor}
      />
      
      <TouchableOpacity style={[styles.button, { backgroundColor: themeColor }]} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { 
    borderWidth: 1, borderColor: '#e5e5e5', padding: 16, marginBottom: 16, 
    borderRadius: 12, fontSize: 16, backgroundColor: '#f9f9f9',
  },
  button: {
    padding: 16, borderRadius: 12, 
    alignItems: 'center', marginTop: 8,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' }
});