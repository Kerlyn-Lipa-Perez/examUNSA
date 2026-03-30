'use client';

import { useAuthStore } from '@/store/authStore';
import { usePagosHistorial } from '@/hooks/usePagos';
import { Crown, CreditCard, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMonto(monto: number): string {
  return `S/ ${(monto / 100).toFixed(2)}`;
}

function calcularExpiracion(pagos: { createdAt: string; estado: string }[]): string | null {
  const pagosExitosos = pagos.filter(p => p.estado === 'completado');
  if (pagosExitosos.length === 0) return null;
  
  const ultimoPago = pagosExitosos.reduce((latest, pago) => 
    new Date(pago.createdAt) > new Date(latest.createdAt) ? pago : latest
  );
  
  const fechaExpiracion = new Date(ultimoPago.createdAt);
  fechaExpiracion.setMonth(fechaExpiracion.getMonth() + 1);
  
  return formatDate(fechaExpiracion.toISOString());
}

export function SubscriptionSettings() {
  const { user, plan } = useAuthStore();
  const isPro = plan === 'pro';
  
  const { data: pagos, isLoading, error } = usePagosHistorial();
  
  const historialPagos = pagos?.map(pago => ({
    fecha: formatDate(pago.createdAt),
    monto: formatMonto(pago.monto),
    estado: pago.estado === 'completado' ? 'Pagado' : pago.estado,
  })) ?? [];
  
  const fechaExpiracion = pagos ? calcularExpiracion(pagos) : null;

  return (
    <div className="space-y-6">
      {/* Plan actual */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Mi Suscripción
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            isPro ? 'bg-primary text-neutral-900' : 'bg-secondary text-white'
          }`}>
            {isPro ? 'PRO' : 'FREE'}
          </span>
        </div>

        {isPro ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/30">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <p className="text-white font-medium">Plan Pro Activo</p>
                <p className="text-gray-400 text-sm">Tienes acceso completo a todas las funciones</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-3 border-b border-neutral-border">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-gray-400 text-sm">Expira el</p>
                <p className="text-white font-medium">
                  {fechaExpiracion ?? 'Consultar en historial'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Gestionar Suscripción
              </button>
              <Link
                href="/configuracion"
                className="flex-1 bg-primary hover:bg-yellow-600 text-neutral-900 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Mejorar Plan
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg border border-secondary/30">
              <Crown className="w-6 h-6 text-secondary" />
              <div>
                <p className="text-white font-medium">Plan Free</p>
                <p className="text-gray-400 text-sm">Mejora tu experiencia con Pro</p>
              </div>
            </div>

            <div className="text-gray-400 text-sm space-y-2">
              <p>Con Pro tendrás acceso a:</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>✓ Flashcards ilimitadas con IA</li>
                <li>✓ Simulacros IA ilimitados</li>
                <li>✓ Tutor IA integrado</li>
                <li>✓ Análisis detallado de progreso</li>
              </ul>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-primary hover:bg-yellow-600 text-neutral-900 px-4 py-3 rounded-lg font-bold text-center"
            >
              ¡Mejorar a Pro por S/29.90/mes!
            </Link>
          </div>
        )}
      </div>

      {/* historial de pagos */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Historial de Pagos
        </h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-gray-400">Cargando historial...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-400">
            <p>Error al cargar el historial</p>
            <p className="text-sm text-gray-500 mt-1">Intenta más tarde</p>
          </div>
        ) : historialPagos.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay pagos registrados</p>
            <p className="text-sm text-gray-500 mt-1">Tu historial de pagos aparecerá aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-border">
                  <th className="text-left py-3 text-gray-400 font-medium">Fecha</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Monto</th>
                  <th className="text-left py-3 text-gray-400 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {historialPagos.map((pago, index) => (
                  <tr key={index} className="border-b border-neutral-border/50">
                    <td className="py-3 text-white">{pago.fecha}</td>
                    <td className="py-3 text-white">{pago.monto}</td>
                    <td className="py-3">
                      <span className="text-success text-xs px-2 py-1 bg-success/20 rounded-full">
                        {pago.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-gray-500 text-xs mt-4 text-center">
          ¿Necesitas ayuda con tu facturación? 
          <a href="mailto:soporte@combo-unsa.com" className="text-tertiary hover:text-blue-400 ml-1">
            Contacta soporte
          </a>
        </p>
      </div>
    </div>
  );
}