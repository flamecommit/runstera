import { IUser } from '@/types/user';
import { create } from 'zustand';

interface IUserStore {
  data: IUser | null;
  setData: (user: IUser | null) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  data: null,
  setData: (user) => set(() => ({ data: user })),
}));
