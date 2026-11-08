import { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useThemeStore } from '../../../stores/useThemeStore';
import { useTransactionStore, Transaction } from '../../../stores/transactionStore';
import { useAuthStore } from '../../../stores/useAuthStore';

export default function TransactionsListScreen() {
  const router = useRouter();
  const theme = useThemeStore((state) => state.theme);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const allTransactions = useTransactionStore((state) => state.transactions);

  const transactions = useMemo(() => {
    return allTransactions.filter((t) => t.userId === currentUserId);
  }, [allTransactions, currentUserId]);

  const isNavigating = useRef(false);

  const handlePress = (id: string) => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    router.push({
      pathname: '/transactions/[id]',
      params: { id },
    });

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const type = item.type || 'expense';

    let color = theme.expense;
    let iconElement = <Ionicons name="arrow-down" size={16} color={color} style={styles.icon} />;

    if (type === 'income') {
      color = theme.income;
      iconElement = <Ionicons name="arrow-up" size={16} color={color} style={styles.icon} />;
    } else if (type === 'investment') {
      color = theme.investment;
      iconElement = <FontAwesome5 name="coins" size={14} color={color} style={styles.icon} />;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress(item.id)}
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            {item.description}
          </Text>
          <Text style={[styles.cardDate, { color: theme.textSecondary }]}>
            {new Date(item.date).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.cardAmount, { color }]}>
            R$ {item.amount.toFixed(2).replace('.', ',')}
          </Text>
          {iconElement}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerSubtitle}>HISTÓRICO</Text>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Minhas Transações</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Nenhuma transação cadastrada.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
  paddingHorizontal: 20,
  paddingTop: 16,
  paddingBottom: 12,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 12,
    marginTop: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  icon: {
    marginLeft: 4,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
  },
});