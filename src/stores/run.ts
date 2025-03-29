import { IRun } from '@/types/runs';
import { create } from 'zustand';

interface IRunStore {
  data: IRun[];
  setData: (user: IRun[]) => void;
}

export const useRunStore = create<IRunStore>((set) => ({
  data: [],
  setData: (user) => set(() => ({ data: user })),
}));
