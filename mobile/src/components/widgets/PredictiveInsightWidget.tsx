import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTranslation } from 'react-i18next';

export function PredictiveInsightWidget() {
  const { t, i18n } = useTranslation();
  const transactions = useTransactionStore((state) => state.transactions);
  const currentUserId = useAuthStore((state) => state.user?.id);

  const { dailyPace, daysRemaining, projectedTotal } = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const totalSpentSoFar = transactions
      .filter((t) => {
        if (t.userId !== currentUserId) return false;
        if (t.type !== 'expense') return false;
        const d = new Date(t.date);
        return (
          d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth &&
          d.getDate() <= currentDay
        );
      })
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const remainingDays = lastDayOfMonth - currentDay;
    const pace = currentDay > 0 && totalSpentSoFar > 0 ? totalSpentSoFar / currentDay : 0;
    const projected = totalSpentSoFar > 0 ? totalSpentSoFar + (pace * remainingDays) : 0;

    return {
      dailyPace: pace,
      daysRemaining: remainingDays,
      projectedTotal: projected,
    };
  }, [transactions]);

  const formatCurrency = (val: number) =>
    val.toLocaleString(i18n.language, { style: 'currency', currency: 'BRL' });

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{t('home.widgets.predictiveInsight.title')}</Text>
      <Text style={styles.projectedValue}>{formatCurrency(projectedTotal)}</Text>
      <Text style={styles.description}>
        {t('home.widgets.predictiveInsight.description', {
          amount: formatCurrency(dailyPace),
          days: daysRemaining,
        })}
      </Text>
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
  label: {
    fontSize: 12,
    color: '#8E8E93',
    letterSpacing: 0.5,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  projectedValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 6,
  },
  description: {
    fontSize: 13,
    color: '#A1A1AA',
    marginTop: 6,
    lineHeight: 18,
  },
});