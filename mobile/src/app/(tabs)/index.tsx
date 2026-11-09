import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeader } from '../../components/home/HomeHeader';
import { ExpenseSummaryWidget } from '../../components/widgets/ExpenseSummaryWidget';
import { PredictiveInsightWidget } from '../../components/widgets/PredictiveInsightWidget';
import { RecentTransactionsWidget } from '../../components/widgets/RecentTransactionsWidget';
import { useWidgetStore } from '../../stores/useWidgetStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();
  const widgets = useWidgetStore((state) => state.widgets);
  const user = useAuthStore((state) => state.user);
  const displayName = user?.name || user?.username || t('common.defaultUserName');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <HomeHeader userName={displayName} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {widgets
          .filter((w) => w.visible)
          .map((widget) => {
            switch (widget.id) {
              case 'expense_summary':
                return <ExpenseSummaryWidget key={widget.id} variant={widget.variant} />;
              case 'predictive_insight':
                return <PredictiveInsightWidget key={widget.id} />;
              case 'recent_transactions':
                return <RecentTransactionsWidget key={widget.id} />;
              default:
                return null;
            }
          })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121216',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
});