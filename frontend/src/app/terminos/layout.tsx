import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Combo UNSA',
  description: 'Términos y condiciones de uso de Combo UNSA.',
};

export default function TerminosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
