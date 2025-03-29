'use client';

import dynamic from 'next/dynamic';

const TrackerNoSSR = dynamic(() => import('@/components/tracker/Tracker'), {
  ssr: false,
});

export default function TrackerPage() {
  return (
    <div>
      <TrackerNoSSR />
    </div>
  );
}
