'use client';

import { useTrackerStore } from '@/stores/tracker';
import dynamic from 'next/dynamic';

const TrackerNoSSR = dynamic(() => import('@/components/tracker/Tracker'), {
  ssr: false,
});

const RunResultNoSSR = dynamic(() => import('@/components/tracker/RunResult'), {
  ssr: false,
});

export default function TrackerPage() {
  const { trackingStatus } = useTrackerStore();

  return (
    <div>
      {trackingStatus !== 'finished' ? <TrackerNoSSR /> : <RunResultNoSSR />}
    </div>
  );
}
