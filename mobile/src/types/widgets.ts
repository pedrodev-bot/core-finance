export type WidgetId = 
    'expense_summary' | 
    'predictive_insight' | 
    'recent_transactions';


export type ExpenseSummaryVariant = 'compact' | 'chart_screen_time';


export type WidgetConfig = 
  | {
      id: 'expense_summary';
      visible: boolean;
      variant: ExpenseSummaryVariant;
    }
  | {
      id: 'predictive_insight';
      visible: boolean;
      variant?: 'compact' | 'detailed';
    }
  | {
      id: 'recent_transactions';
      visible: boolean;
      variant?: 'compact';
    };