'use client';

import { signIn, useSession } from 'next-auth/react';

export default function RootPage() {
  const { data: session } = useSession();

  console.log('session', session);

  return (
    <div>
      <div>page</div>
      <button className="btn-signin" type="button" onClick={() => signIn()}>
        Sign In
      </button>
    </div>
  );
}
