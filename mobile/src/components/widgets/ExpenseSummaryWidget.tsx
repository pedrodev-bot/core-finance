import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ExpenseSummaryVariant } from '../../types/widgets';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { useUIStore } from '../../stores/useUIStore';
import { useTranslation, Trans } from 'react-i18next';

interface Props {
  variant?: ExpenseSummaryVariant;
}

export function ExpenseSummaryWidget({ variant = 'chart_screen_time' }: Props) {
  const [selectedBarData, setSelectedBarData] = useState<{ 
    label: string; 
    amount: number; 
    isMonth: boolean; 
    startStr?: string; 
    endStr?: string 
  } | null>(null);
  const [period, setPeriod] = useState<'1S' | '1M'>('1S');
  const currentUserId = useAuthStore((state) => state.user?.id);
  const allTransactions = useTransactionStore((state) => state.transactions);
  const isValuesHidden = useUIStore((state) => state.isValuesHidden);

  const { t } = useTranslation();
  const periodLabels = {
    '1S': t('home.widgets.expenseSummary.periods.oneWeek'),
    '1M': t('home.widgets.expenseSummary.periods.oneMonth'),
  };

  const { chartData, totalSpent, averageValue, maxAmount } = useMemo(() => {
    const isValuesHidden = useUIStore((state) => state.isValuesHidden);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userExpenses = allTransactions.filter(
      (t) => t.userId === currentUserId && t.type === 'expense'
    );

    let calculatedData: { label: string; amount: number; isMonth: boolean; startStr?: string; endStr?: string }[] = [];
    let activeExpenses: typeof userExpenses = [];
    let calculatedAverage = 0;

    if (period === '1S') {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 6);

      activeExpenses = userExpenses.filter((t) => {
        const tDate = new Date(t.date);
        tDate.setHours(0, 0, 0, 0);
        return tDate >= startDate && tDate <= today;
      });

      calculatedData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dayStr = String(d.getDate()).padStart(2, '0');

        const amount = activeExpenses
          .filter((t) => {
            const tDate = new Date(t.date);
            return tDate.getDate() === d.getDate() && tDate.getMonth() === d.getMonth();
          })
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        return { label: dayStr, amount, isMonth: false };
      });

      const total = activeExpenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      calculatedAverage = total / 7;

    } else {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      activeExpenses = userExpenses.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });

      const monthRanges = [
        { start: 1, end: 7 },
        { start: 8, end: 14 },
        { start: 15, end: 21 },
        { start: 22, end: 28 }
      ];
      if (lastDayOfMonth >= 29) {
        monthRanges.push({ start: 29, end: lastDayOfMonth });
      }

      calculatedData = monthRanges.map((range) => {
        const startStr = String(range.start).padStart(2, '0');
        const endStr = String(range.end).padStart(2, '0');
        const label = `${startStr}-${endStr}`;
        
        const amount = activeExpenses
          .filter((t) => {
            const d = new Date(t.date).getDate();
            return d >= range.start && d <= range.end;
          })
          .reduce((sum, t) => sum + Number(t.amount || 0), 0);

        return { label, amount, isMonth: true, startStr, endStr };
      });

      const total = activeExpenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      
      const currentDay = today.getDate();
      const weeksElapsed = Math.min(Math.ceil(currentDay / 7), monthRanges.length);
      calculatedAverage = total / (weeksElapsed || 1);
    }

    const total = activeExpenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const max = Math.max(...calculatedData.map((d) => d.amount), 1);

    return {
      chartData: calculatedData,
      totalSpent: total,
      averageValue: calculatedAverage,
      maxAmount: max,
    };
  }, [allTransactions, currentUserId, period]);

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (variant === 'compact') {
    return (
      <View style={styles.card}>
        <Text style={styles.label}>{t('home.widgets.predictiveInsight.title')}</Text>
        {isValuesHidden ? (
          <View style={styles.hiddenSkeletonLarge} />
        ) : (
          <Text style={styles.totalValue}>
            {formatBRL(variant === 'compact' ? totalSpent : (selectedBarData ? selectedBarData.amount : totalSpent))}
          </Text>
        )}
      </View>
    );
  }

  const chartHeight = 130;
  const trackHeight = 90;
  const averageLineBottom = Math.min(
    (averageValue / maxAmount) * trackHeight + 24,
    chartHeight
  );

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>
            {selectedBarData
            ? (selectedBarData.isMonth 
                ? t('home.widgets.expenseSummary.spentOnPeriod', { 
                    start: selectedBarData.startStr,
                    end: selectedBarData.endStr
                  })
                : t('home.widgets.expenseSummary.spentOnDay', {
                    day: selectedBarData.label,
                    month: String(new Date().getMonth() + 1).padStart(2, '0'),
                  })
              )
            : t('home.widgets.expenseSummary.totalSpent')}
          </Text>
          <Text style={styles.totalValue}>
            {isValuesHidden ? (
              <View style={styles.hiddenSkeletonLarge} />
            ) : (
              <Text style={styles.totalValue}>
                {formatBRL(selectedBarData ? selectedBarData.amount : totalSpent)}
              </Text>
            )}
          </Text>
        </View>

        <View style={styles.periodSelector}>
          {(['1S', '1M'] as const).map((p) => (
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
        {selectedBarData
        ? t('home.widgets.expenseSummary.tapBarAgain')
        : <Trans 
            i18nKey={
              period === '1S' 
                ? 'home.widgets.expenseSummary.dailyAverage' 
                : 'home.widgets.expenseSummary.weeklyAverage'
            }
            values={{
              amount: isValuesHidden ? '' : formatBRL(averageValue)
            }}
            components={{
              val: isValuesHidden ? (
                <View style={styles.hiddenSkeletonTextGreen} />
              ) : (
                <Text style={{}} />
              )
            }}
          />
        }
      </Text>

      <View style={[styles.chartContainer, { height: chartHeight }]}>
        {!isValuesHidden && averageValue > 0 && (
          <View style={[styles.averageLine, { bottom: averageLineBottom }]}>
            <Text style={styles.averageTag}>{t('home.widgets.expenseSummary.averageTag')}</Text>
          </View>
        )}

        <View style={styles.barsRow}>
          {chartData.map((item, index) => {
            const isSelected = selectedBarData?.label === item.label;
            const barFillHeight =
              maxAmount > 0 ? (item.amount / maxAmount) * chartHeight : 0;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedBarData(isSelected ? null : item);
                }}
                style={styles.barColumn}
              >
                <View style={[styles.barTrack, { height: trackHeight }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: isValuesHidden 
                          ? 0 
                          : Math.max(barFillHeight, item.amount > 0 ? 8 : 0),
                        backgroundColor: isSelected ? '#a3e635' : '#0A84FF',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, isSelected && { color: '#FFFFFF', fontWeight: '700' }]}>
                  {item.label}
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
  hiddenSkeletonLarge: {
    height: 26,
    width: 140,
    backgroundColor: '#2A2A32',
    borderRadius: 6,
    marginTop: 6,
  },
  hiddenSkeletonTextGreen: {
    height: 14,
    width: 60,
    backgroundColor: '#22c55e',
    borderRadius: 4,
    marginHorizontal: 4,
    transform: [{ translateY: 2 }], 
  },
});