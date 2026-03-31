'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md rounded-2xl bg-neutral-800 border border-neutral-border p-8 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <AlertTriangle className="h-7 w-7 text-error" />
        </div>

        <h2 className="text-xl font-bold text-white mb-3">
          Error al cargar
        </h2>
        <p className="text-[#8B949E] mb-2">
          No pudimos cargar esta sección. Intenta de nuevo o vuelve al inicio.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-[#8B949E]/60 mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-primary text-neutral-900 rounded-lg px-5 py-2.5 font-medium hover:bg-yellow-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-neutral-border text-[#8B949E] rounded-lg px-5 py-2.5 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
