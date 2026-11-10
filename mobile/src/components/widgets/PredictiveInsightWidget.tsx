import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useUIStore } from '../../stores/useUIStore';
import { useTranslation, Trans } from 'react-i18next';

export function PredictiveInsightWidget() {
  const { t, i18n } = useTranslation();
  const rawMonthName = new Date().toLocaleString(i18n.language, { month: 'long' });
  const currentMonth = rawMonthName.charAt(0).toUpperCase() + rawMonthName.slice(1);
  const transactions = useTransactionStore((state) => state.transactions);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isValuesHidden = useUIStore((state) => state.isValuesHidden);

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
      <Text style={styles.label}>
        {t('home.widgets.predictiveInsight.title')} • {currentMonth}
      </Text>
      {isValuesHidden ? (
        <View style={styles.hiddenSkeletonLarge} />
      ) : (
        <Text style={styles.projectedValue}>{formatCurrency(projectedTotal)}</Text>
      )}
      <Text style={styles.description}>
        <Trans 
          i18nKey="home.widgets.predictiveInsight.description"
          values={{ 
            days: daysRemaining,
            amount: isValuesHidden ? '' : formatCurrency(dailyPace)
          }}
          components={{
            val: isValuesHidden ? (
              <View style={styles.hiddenSkeletonTextGray} />
            ) : (
              <Text style={{ color: '#FFFFFF' }} /> 
            )
          }}
        />
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
  hiddenSkeletonLarge: {
    height: 26,
    width: 140,
    backgroundColor: '#2A2A32',
    borderRadius: 6,
    marginTop: 6,
  },
  description: {
    fontSize: 13,
    color: '#A1A1AA',
    marginTop: 6,
    lineHeight: 18,
  },
  hiddenSkeletonTextGray: {
    height: 14,
    width: 60,
    backgroundColor: '#3f3f46',
    borderRadius: 4,
    marginHorizontal: 4,
    transform: [{ translateY: 2 }], 
  },
});