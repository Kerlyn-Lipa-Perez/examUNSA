'use client';

import { usePagosHistorial } from '@/hooks/usePagos';
import { CreditCard, Loader2 } from 'lucide-react';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMonto(monto: number): string {
  return `S/ ${(monto / 100).toFixed(2)}`;
}

export function PaymentHistory() {
  const { data: pagos, isLoading, error } = usePagosHistorial();

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Historial de Pagos
        </h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <span className="ml-2 text-gray-400">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Historial de Pagos
        </h3>
        <div className="text-center py-6 text-gray-400">
          <p>No se pudo cargar el historial</p>
        </div>
      </div>
    );
  }

  if (!pagos || pagos.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Historial de Pagos
        </h3>
        <div className="text-center py-8 text-gray-400">
          <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay pagos registrados aún</p>
          <p className="text-sm text-gray-500 mt-1">Cuando realices una compra, aparecerá aquí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-primary" />
        Historial de Pagos
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-border">
              <th className="text-left py-3 text-gray-400 font-medium">Fecha</th>
              <th className="text-left py-3 text-gray-400 font-medium">Plan</th>
              <th className="text-left py-3 text-gray-400 font-medium">Monto</th>
              <th className="text-left py-3 text-gray-400 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.id} className="border-b border-neutral-border/50">
                <td className="py-3 text-white font-mono">{formatDate(pago.createdAt)}</td>
                <td className="py-3 text-gray-300 capitalize">{pago.planId}</td>
                <td className="py-3 text-white font-mono">{formatMonto(pago.monto)}</td>
                <td className="py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pago.estado === 'completado' 
                      ? 'text-success bg-success/20' 
                      : 'text-warning bg-warning/20'
                  }`}>
                    {pago.estado === 'completado' ? 'Pagado' : pago.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
