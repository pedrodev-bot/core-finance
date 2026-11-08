import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';import { useAuthStore } from '../../stores/useAuthStore';
import { useTransactionStore } from '../../stores/transactionStore';

export function RecentTransactionsWidget() {
  const router = useRouter();

  const currentUserId = useAuthStore((state) => state.user?.id);
  const allTransactions = useTransactionStore((state) => state.transactions);

  const userTransactions = useMemo(() => {
    return allTransactions.filter((t) => t.userId === currentUserId);
  }, [allTransactions, currentUserId]);

  const recentTransactions = useMemo(() => {
    return [...userTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [userTransactions]);

  const formatCurrency = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>COMPRAS RECENTES</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions' as any)}>
          <Text style={styles.linkText}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      {recentTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma transação recente encontrada.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {recentTransactions.map((item, index) => {
            const isExpense = item.type === 'expense';
            const isLast = index === recentTransactions.length - 1;

            return (
              <View
                key={item.id || index}
                style={[styles.itemRow, !isLast && styles.itemBorder]}
              >
                <View style={styles.infoCol}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.description || 'Transação'}
                  </Text>
                  <Text style={styles.itemDate}>
                    {formatDate(item.date)} • {item.type === 'expense' ? 'Despesa' : item.type === 'income' ? 'Receita' : 'Investimento'}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.itemAmount,
                    isExpense ? styles.expenseColor : styles.incomeColor,
                  ]}
                >
                  {isExpense ? '- ' : '+ '}
                  {formatCurrency(Number(item.amount || 0))}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E24',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2A2A32',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  linkText: {
    fontSize: 12,
    color: '#0A84FF',
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  emptyText: {
    color: '#636366',
    fontSize: 13,
  },
  list: {
    flexDirection: 'column',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A32',
  },
  infoCol: {
    flex: 1,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  expenseColor: {
    color: '#FFFFFF',
  },
  incomeColor: {
    color: '#34C759',
  },
});