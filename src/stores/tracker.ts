import { TTrackingStatus } from '@/types/tracker';
import { create } from 'zustand';

interface ITrackerStore {
  trackingStatus: TTrackingStatus;
  setTrackingStatus: (value: TTrackingStatus) => void;
}

export const useTrackerStore = create<ITrackerStore>((set) => ({
  trackingStatus: 'idle',
  setTrackingStatus: (trackingStatus) => set(() => ({ trackingStatus })),
}));
