'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-neutral-800 border border-neutral-border p-8 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-error/10">
          <AlertTriangle className="h-7 w-7 text-error" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Algo salió mal
        </h2>
        <p className="text-[#8B949E] mb-2">
          Ocurrió un error inesperado al cargar esta página.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-[#8B949E]/60 mb-6">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-neutral-900 rounded-lg px-6 py-2.5 font-medium hover:bg-yellow-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </button>
      </div>
    </div>
  );
}
