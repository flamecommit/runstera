import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthCallbackPage() {
  const headersList = await headers(); // ❌ 타입은 Promise<ReadonlyHeaders>
  const accessToken = headersList.get('x-access-token'); // ❌ 에러: get 속성이 없음

  if (!accessToken) {
    return <div>empty token in cookieStore</div>;
  }

  const jwt = accessToken || 'mock.token.value'; // 실제 토큰 추출
  return redirect(`runstera://callback?token=${jwt}`);
}
