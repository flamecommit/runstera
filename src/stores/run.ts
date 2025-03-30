import { IRun } from '@/types/runs';
import request from '@/utils/request';
import { create } from 'zustand';

interface IRunStore {
  data: IRun[];
  pending: boolean;
  fetch: (user_uuid: string) => void;
}

export const useRunStore = create<IRunStore>((set) => ({
  data: [],
  pending: false,
  fetch: async (user_uuid: string) => {
    try {
      set(() => ({ pending: true }));
      const { code, data } = await request<IRun[]>({
        method: 'GET',
        url: `/api/runs`,
        searchParams: {
          user_uuid,
        },
      });

      if (code === 200) {
        set(() => ({ data }));
      }
    } finally {
      set(() => ({ pending: false }));
    }
  },
}));
