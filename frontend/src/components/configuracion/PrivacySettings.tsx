'use client';

import { useState } from 'react';
import { useExportData, useDeleteAccount } from '@/hooks/useConfiguracion';
import { Download, Trash2, AlertTriangle, Loader2, CheckCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PrivacySettings() {
  const router = useRouter();
  const exportData = useExportData();
  const deleteAccount = useDeleteAccount();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = async () => {
    try {
      await exportData.mutateAsync();
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error al exportar datos:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR CUENTA') return;

    try {
      await deleteAccount.mutateAsync();
      // Redirect to login or home after deletion
      router.push('/login');
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Exportar datos */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-primary" />
          Exportar mis datos
        </h3>

        <p className="text-gray-400 text-sm mb-4">
          Descarga una copia de todos tus datos incluyendo: simulacros completados, flashcards, 
          estadísticas de progreso y configuración de tu cuenta.
        </p>

        <button
          onClick={handleExportData}
          disabled={exportData.isPending}
          className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {exportData.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : exportSuccess ? (
            <CheckCircle className="w-4 h-4 text-success" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {exportSuccess ? 'Enviado a tu email' : 'Solicitar Exportación'}
        </button>
      </div>

      {/* Eliminar cuenta */}
      <div className="bg-neutral-800 rounded-xl border border-error/30 p-6">
        <h3 className="text-lg font-bold text-error mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Eliminar mi cuenta
        </h3>

        {!showDeleteConfirm ? (
          <>
            <p className="text-gray-400 text-sm mb-4">
              Esta acción es permanente. Se eliminarán todos tus datos incluyendo simulacros, 
              flashcards y progreso. Esta acción no se puede deshacer.
            </p>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-error/20 hover:bg-error/30 text-error px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar Cuenta
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-error/10 rounded-lg border border-error/30">
              <AlertTriangle className="w-5 h-5 text-error flex-shrink-0" />
              <p className="text-gray-300 text-sm">
                Escribe <span className="text-error font-bold">ELIMINAR CUENTA</span> para confirmar
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="ELIMINAR CUENTA"
              className="w-full bg-neutral-700 border border-error/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-error"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccount.isPending || deleteConfirmText !== 'ELIMINAR CUENTA'}
                className="bg-error hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {deleteAccount.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Confirmar Eliminación
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Links a políticas */}
      <div className="text-center text-gray-500 text-sm space-y-2">
        <p>Puede que también te interese:</p>
        <div className="flex justify-center gap-4">
          <a href="/privacidad" className="text-tertiary hover:text-blue-400 transition-colors">
            Política de Privacidad
          </a>
          <a href="/terminos" className="text-tertiary hover:text-blue-400 transition-colors">
            Términos y Condiciones
          </a>
        </div>
      </div>
    </div>
  );
}