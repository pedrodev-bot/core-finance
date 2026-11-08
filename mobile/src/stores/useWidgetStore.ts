import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WidgetConfig, WidgetId } from '../types/widgets';

interface WidgetState {
  widgets: WidgetConfig[];
  toggleVisibility: (id: WidgetId) => void;
  changeVariant: (id: WidgetId, variant: string) => void;
  reorderWidgets: (fromIndex: number, toIndex: number) => void;
}

const DEFAULT_CONFIG: WidgetConfig[] = [
  { id: 'expense_summary', visible: true, variant: 'chart_screen_time' },
  { id: 'predictive_insight', visible: true, variant: 'compact' },
  { id: 'recent_transactions', visible: true, variant: 'compact' },
];

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: DEFAULT_CONFIG,

      toggleVisibility: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, visible: !w.visible } : w
          ) as WidgetConfig[],
        })),

      changeVariant: (id, variant) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, variant: variant as any } : w
          ) as WidgetConfig[],
        })),

      reorderWidgets: (fromIndex, toIndex) =>
        set((state) => {
          const list = [...state.widgets];
          const [moved] = list.splice(fromIndex, 1);
          list.splice(toIndex, 0, moved);
          return { widgets: list };
        }),
    }),
    {
      name: '@core_finance:widgets_v1',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);