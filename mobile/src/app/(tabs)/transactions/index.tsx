import { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTransactionStore, Transaction } from '../../../store/transactionStore';

export default function TransactionsListScreen() {
  const allTransactions = useTransactionStore((state) => state.transactions);
  const transactions = allTransactions.filter((tx) => !tx.deleted);
  const router = useRouter();
  
  const isNavigating = useRef(false);

  const handlePress = (id: string) => {
    if (isNavigating.current) return; 
    isNavigating.current = true;
    
    router.push({
      pathname: '/transactions/[id]',
      params: { id }
    });
    
    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const type = item.type || 'expense'; 
    
    let color = '#ef4444'; 
    let iconElement = <Ionicons name="arrow-down" size={16} color={color} style={styles.icon} />;

    if (type === 'income') {
      color = '#22c55e'; 
      iconElement = <Ionicons name="arrow-up" size={16} color={color} style={styles.icon} />;
    } else if (type === 'investment') {
      color = '#0ea5e9'; 
      iconElement = <FontAwesome5 name="coins" size={14} color={color} style={styles.icon} />; 
    }

    return (
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.7}
        onPress={() => handlePress(item.id)} 
      >
        <View style={styles.cardHeader}>
          <Text style={styles.description}>{item.description}</Text>
          
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color }]}>
              R$ {item.amount.toFixed(2).replace('.', ',')}
            </Text>
            {iconElement}
          </View>
        </View>
        
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString('pt-BR')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma transação ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
  listContent: { padding: 16, paddingBottom: 100 }, 
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' },
  description: { fontSize: 16, fontWeight: '500', color: '#333', flex: 1 },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  amount: { fontSize: 16, fontWeight: 'bold' },
  icon: { marginLeft: 6 },
  date: { fontSize: 12, color: '#888' }
});