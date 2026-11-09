import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ExpenseSummaryVariant } from '../../types/widgets';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { useTranslation } from 'react-i18next';

interface Props {
  variant?: ExpenseSummaryVariant;
}

export function ExpenseSummaryWidget({ variant = 'chart_screen_time' }: Props) {
  const [selectedDayData, setSelectedDayData] = useState<{ day: string; amount: number } | null>(null);
  const [period, setPeriod] = useState<'1M' | '3M'>('1M');
  const currentUserId = useAuthStore((state) => state.user?.id);
  const allTransactions = useTransactionStore((state) => state.transactions);

  const { t } = useTranslation();
  const periodLabels = {
    '1M': t('home.widgets.expenseSummary.periods.oneMonth'),
    '3M': t('home.widgets.expenseSummary.periods.threeMonths'),
  };

  const { dailyData, totalSpent, dailyAverage, maxAmount } = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const expenses = allTransactions.filter((t) => {
      if (t.userId !== currentUserId) return false;
      if (t.type !== 'expense') return false;
      const tDate = new Date(t.date);

      if (period === '1M') {
        return (
          tDate.getFullYear() === currentYear &&
          tDate.getMonth() === currentMonth &&
          tDate.getDate() <= currentDay
        );
      }

      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(today.getDate() - 90);
      return tDate >= ninetyDaysAgo && tDate <= today;
    });

    const daysToShow = 7;
    const startDay = Math.max(1, currentDay - daysToShow + 1);

    const calculatedDailyData = Array.from(
      { length: currentDay - startDay + 1 },
      (_, index) => {
        const dayNumber = startDay + index;
        const dayStr = String(dayNumber).padStart(2, '0');

        const dayTotal = expenses
          .filter((t) => {
            const d = new Date(t.date);
            return (
              d.getDate() === dayNumber &&
              d.getMonth() === currentMonth &&
              d.getFullYear() === currentYear
            );
          })
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        return { day: dayStr, amount: dayTotal };
      }
    );

    const total = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const average = currentDay > 0 ? total / currentDay : 0;
    const max = Math.max(...calculatedDailyData.map((d) => d.amount), 1);

    return {
      dailyData: calculatedDailyData,
      totalSpent: total,
      dailyAverage: average,
      maxAmount: max,
    };
  }, [allTransactions, currentUserId, period]);

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (variant === 'compact') {
    return (
      <View style={styles.card}>
        <Text style={styles.label}>{t('home.widgets.predictiveInsight.title')}</Text>
        <Text style={styles.totalValue}>{formatBRL(totalSpent)}</Text>
      </View>
    );
  }

  const chartHeight = 130;
  const trackHeight = 90;
  const averageLineBottom = Math.min(
    (dailyAverage / maxAmount) * trackHeight + 24,
    chartHeight
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>
            {selectedDayData
            ? t('home.widgets.expenseSummary.spentOnDay', {
                day: selectedDayData.day,
                month: String(new Date().getMonth() + 1).padStart(2, '0'),
              })
            : t('home.widgets.expenseSummary.totalSpent')}
          </Text>
          <Text style={styles.totalValue}>
            {formatBRL(selectedDayData ? selectedDayData.amount : totalSpent)}
          </Text>
        </View>

        <View style={styles.periodSelector}>
          {(['1M', '3M'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p && styles.periodTextActive,
                ]}
              >
                {periodLabels[p]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.subtext}>
        {selectedDayData
        ? t('home.widgets.expenseSummary.tapBarAgain')
        : t('home.widgets.expenseSummary.dailyAverage', { amount: formatBRL(dailyAverage) })}
      </Text>

      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {dailyAverage > 0 && (
          <View style={[styles.averageLine, { bottom: averageLineBottom }]}>
            <Text style={styles.averageTag}>{t('home.widgets.expenseSummary.averageTag')}</Text>
          </View>
        )}

        <View style={styles.barsRow}>
          {dailyData.map((item, index) => {
            const isSelected = selectedDayData?.day === item.day;
            const barFillHeight =
              maxAmount > 0 ? (item.amount / maxAmount) * chartHeight : 0;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedDayData(isSelected ? null : item);
                }}
                style={styles.barColumn}
              >
                <View style={[styles.barTrack, { height: trackHeight }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: Math.max(barFillHeight, item.amount > 0 ? 8 : 0),
                        backgroundColor: isSelected ? '#a3e635' : '#0A84FF',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, isSelected && { color: '#FFFFFF', fontWeight: '700' }]}>
                  {item.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  subtext: {
    fontSize: 13,
    color: '#34C759',
    marginTop: 2,
    marginBottom: 16,
    fontWeight: '500',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#121216',
    borderRadius: 8,
    padding: 3,
  },
  periodBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  periodBtnActive: {
    backgroundColor: '#2A2A32',
  },
  periodText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
    justifyContent: 'flex-end',
  },
  averageLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderColor: '#FF9500',
    borderStyle: 'dashed',
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  averageTag: {
    color: '#FF9500',
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: '#1E1E24',
    paddingHorizontal: 4,
    top: -7,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    justifyContent: 'flex-end',
    width: 14,
    backgroundColor: '#2A2A32',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#0A84FF',
    borderRadius: 7,
  },
  barLabel: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 6,
  },
});