import BaseTemplate from '@/components/template/BaseTemplate';

export default function BottomNavigationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseTemplate>{children}</BaseTemplate>;
}
