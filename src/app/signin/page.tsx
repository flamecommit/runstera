import SigninUI from '@/app/signin/Signin';
import { getProviders } from 'next-auth/react';

export default async function LoginPage() {
  const providers = await getProviders();

  return providers !== null && <SigninUI providers={providers} />;
}
