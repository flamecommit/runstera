import StyledComponentsRegistry from '@/components/config/registry';
import AuthSession from '@/components/config/Session';
import ClientLayout from '@/components/template/ClientLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Runstera',
  description: '러닝 데이터의 주인은 당신입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preload" href="/images/icons/play.svg" as="image" />
        <link rel="preload" href="/images/icons/lock.svg" as="image" />
        <link rel="preload" href="/images/icons/unlock.svg" as="image" />
        <link rel="preload" href="/images/icons/pause.svg" as="image" />
        <link rel="preload" href="/images/icons/stop.svg" as="image" />
      </head>
      <body>
        <AuthSession>
          <StyledComponentsRegistry>
            <ClientLayout>{children}</ClientLayout>
          </StyledComponentsRegistry>
        </AuthSession>
      </body>
    </html>
  );
}
