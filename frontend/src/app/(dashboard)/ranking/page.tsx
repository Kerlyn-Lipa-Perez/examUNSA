// frontend/src/app/(dashboard)/ranking/page.tsx
import { Metadata } from 'next';
import { RankingClient } from './RankingClient';

export const metadata: Metadata = {
  title: 'Ranking — Combo UNSA',
  description: 'Ranking global de postulantes UNSA',
};

export default function RankingPage() {
  return <RankingClient />;
}
