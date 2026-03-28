import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad — Combo UNSA',
  description: 'Política de privacidad y protección de datos de Combo UNSA.',
};

export default function PrivacidadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
