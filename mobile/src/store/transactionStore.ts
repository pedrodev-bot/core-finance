import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income' | 'investment';
  synced: boolean;
  deleted?: boolean;
}

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'synced' | 'deleted'>) => void;
  updateTransaction: (id: string, updatedData: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      
      addTransaction: (tx) => set((state) => ({
        transactions: [{ ...tx, id: uuidv4(), synced: false, deleted: false }, ...state.transactions]
      })),

      updateTransaction: (id, updatedData) => set((state) => ({
        transactions: state.transactions.map(tx => 
          tx.id === id ? { ...tx, ...updatedData, synced: false } : tx
        )
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.map(tx => 
          tx.id === id ? { ...tx, deleted: true, synced: false } : tx
        )
      })),

    }),
    {
      name: 'core-finance-transactions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);