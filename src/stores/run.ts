import { IRun } from '@/types/runs';
import request from '@/utils/request';
import { create } from 'zustand';

interface IRunStore {
  data: IRun[];
  pending: boolean;
  initialized: boolean; // 최초 fetch 여부
  fetch: (user_uuid: string) => void;
}

export const useRunStore = create<IRunStore>((set) => ({
  data: [],
  pending: false,
  initialized: false, // 기본값 false
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
        set(() => ({ data, initialized: true }));
      }
    } finally {
      set(() => ({ pending: false }));
    }
  },
}));
