'use client';

import { useUserStore } from '@/stores/user';

export default function DashboardPage() {
  const { data: user } = useUserStore();

  return (
    <div>
      <div>Dashboard</div>
      {user !== null && (
        <div>
          <div>name: {user.name}</div>
          <div>name: {user.email}</div>
          <div>
            <img src={user.image} alt="" />
          </div>
        </div>
      )}
    </div>
  );
}
