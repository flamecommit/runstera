import { create } from 'zustand';

interface IGlobalSpinnerState {
  pending: boolean;
  setPending: (value: boolean) => void; // 숫자 값을 받아야 함
}

export const useGlobalSpinner = create<IGlobalSpinnerState>((set) => ({
  pending: false,
  setPending: (value) => set(() => ({ pending: value })),
}));
