import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CurrencyInput from 'react-native-currency-input';
import { useTransactionStore } from '../../../stores/transactionStore';
import { useThemeStore } from '../../../stores/useThemeStore';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);

  const transactions = useTransactionStore((state) => state.transactions);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

  const currentTransaction = transactions.find((t) => t.id === id);

  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (currentTransaction) {
      setAmount(currentTransaction.amount);
      setDescription(currentTransaction.description);
    }
  }, [currentTransaction]);

  if (!currentTransaction) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.textSecondary }}>Transação não encontrada.</Text>
      </View>
    );
  }

  const isExpense = currentTransaction.type === 'expense';
  const isIncome = currentTransaction.type === 'income';
  const themeColor = isExpense ? theme.expense : isIncome ? theme.income : theme.investment;

  const handleUpdate = () => {
    if (!amount || !description.trim()) return;

    if (updateTransaction) {
      updateTransaction(currentTransaction.id, {
        amount,
        description: description.trim(),
      });
    }
    router.back();
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    deleteTransaction(currentTransaction.id);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Editar Transação',
          headerTintColor: theme.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          headerStyle: { backgroundColor: theme.background },
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
        placeholder="Descrição da transação"
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
        style={[styles.primaryButton, { backgroundColor: theme.accent }]}
        activeOpacity={0.8}
        onPress={handleUpdate}
      >
        <Text style={styles.primaryButtonText}>Atualizar Transação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.deleteButton, { borderColor: theme.expense }]}
        activeOpacity={0.8}
        onPress={() => setShowDeleteModal(true)}
      >
        <Text style={[styles.deleteButtonText, { color: theme.expense }]}>Deletar Transação</Text>
      </TouchableOpacity>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowDeleteModal(false)}>
          <View style={[styles.modalBackdrop, { backgroundColor: theme.modalOverlay }]}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalCard,
                  { backgroundColor: theme.card, borderColor: theme.cardBorder },
                ]}
              >
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Ionicons name="trash-outline" size={24} color={theme.expense} />
                </View>

                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Excluir transação?
                </Text>

                <Text style={[styles.modalDescription, { color: theme.textSecondary }]}>
                  Esta ação não pode ser desfeita. O registro será removido permanentemente.
                </Text>

                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: theme.cardBorder }]}
                    onPress={() => setShowDeleteModal(false)}
                  >
                    <Text style={[styles.cancelButtonText, { color: theme.textPrimary }]}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.confirmDeleteButton, { backgroundColor: theme.expense }]}
                    onPress={confirmDelete}
                  >
                    <Text style={styles.confirmDeleteText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  deleteButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});