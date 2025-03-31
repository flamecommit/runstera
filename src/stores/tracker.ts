import { TLatLng, TTrackingStatus } from '@/types/tracker';
import { Dispatch, SetStateAction } from 'react';
import { create } from 'zustand';

type Setter<T> = Dispatch<SetStateAction<T>>;

interface ITrackerStore {
  trackingStatus: TTrackingStatus;
  setTrackingStatus: Setter<TTrackingStatus>;
  startedAt: Date | null;
  setStartedAt: Setter<Date | null>;
  endedAt: Date | null;
  setEndedAt: Setter<Date | null>;
  duration: number;
  setDuration: Setter<number>;
  segments: TLatLng[][];
  setSegments: Setter<TLatLng[][]>;
  currentPosition: TLatLng | null;
  setCurrentPosition: Setter<TLatLng | null>;
}

// 공통 setter 생성기
const createSetter =
  <T>(key: keyof ITrackerStore) =>
  (value: SetStateAction<T>) =>
    set((state: ITrackerStore) => ({
      [key]:
        typeof value === 'function'
          ? (value as (prev: T) => T)(state[key] as T)
          : value,
    }));

let set: (fn: (state: ITrackerStore) => Partial<ITrackerStore>) => void;

export const useTrackerStore = create<ITrackerStore>((_set) => {
  set = _set;
  return {
    trackingStatus: 'idle',
    setTrackingStatus: createSetter<TTrackingStatus>('trackingStatus'),
    startedAt: null,
    setStartedAt: createSetter<Date | null>('startedAt'),
    endedAt: null,
    setEndedAt: createSetter<Date | null>('endedAt'),
    duration: 0,
    setDuration: createSetter<number>('duration'),
    segments: [],
    setSegments: createSetter<TLatLng[][]>('segments'),
    currentPosition: null,
    setCurrentPosition: createSetter<TLatLng | null>('currentPosition'),
  };
});
