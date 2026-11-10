import { create } from 'zustand';

interface UIStore {
  isValuesHidden: boolean;
  toggleValuesVisibility: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isValuesHidden: true, 
  
  toggleValuesVisibility: () => set((state) => ({ 
    isValuesHidden: !state.isValuesHidden 
  })),
}));