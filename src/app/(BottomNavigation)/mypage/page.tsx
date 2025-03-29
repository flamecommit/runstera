'use client';

import { signOut } from 'next-auth/react';

export default function MypagePage() {
  return (
    <div>
      <div>Mypage</div>
      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
