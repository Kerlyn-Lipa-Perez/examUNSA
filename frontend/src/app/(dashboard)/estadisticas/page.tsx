// frontend/src/app/(dashboard)/estadisticas/page.tsx
import { Metadata } from 'next';
import { EstadisticasClient } from './EstadisticasClient';

export const metadata: Metadata = {
  title: 'Estadísticas — Combo UNSA',
  description: 'Análisis detallado de tu rendimiento académico',
};

export default function EstadisticasPage() {
  return <EstadisticasClient />;
}
