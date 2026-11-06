import { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTransactionStore } from '../../../store/transactionStore';
import CurrencyInput from 'react-native-currency-input';

const LIME_GREEN = '#a3e635';

export default function EditTransactionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  const transactions = useTransactionStore((state) => state.transactions);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

  const transaction = transactions.find((tx) => tx.id === id);

  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount);
      setDescription(transaction.description);
    }
  }, [transaction]);

  if (!transaction) return null;

  const handleUpdate = () => {
    if (!amount || !description) return;

    updateTransaction(id as string, {
      amount,
      description,
    });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      "Deletar Transação",
      "Tem certeza que deseja apagar este registro?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Deletar", 
          style: "destructive",
          onPress: () => {
            deleteTransaction(id as string);
            router.back();
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
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
        cursorColor={LIME_GREEN}
        selectionColor={LIME_GREEN}
      />
      
      <TextInput
        placeholder="Descrição da despesa"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        cursorColor={LIME_GREEN}
        selectionColor={LIME_GREEN}
      />
      
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Atualizar Transação</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>Deletar</Text>
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
  updateButton: {
    backgroundColor: LIME_GREEN,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#000' },
  deleteButtonText: { fontSize: 16, fontWeight: '600', color: '#ff4444' }
});