'use client';

import { useState, useEffect } from 'react';
import { useUpdatePreferences, useUserPreferences } from '@/hooks/useConfiguracion';
import { HORAS_RECORDATORIO } from '@/types/configuracion';
import { Bell, Mail, Clock, Loader2, CheckCircle } from 'lucide-react';

export function NotificationsSettings() {
  const { data: prefs, isLoading } = useUserPreferences();
  const updatePrefs = useUpdatePreferences();

  const [recordatorioActivo, setRecordatorioActivo] = useState(true);
  const [horaRecordatorio, setHoraRecordatorio] = useState('20:00');
  const [notificacionesEmail, setNotificacionesEmail] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefs) {
      setRecordatorioActivo(prefs.recordatorioActivo ?? true);
      setHoraRecordatorio(prefs.horaRecordatorio || '20:00');
      setNotificacionesEmail(prefs.notificacionesEmail ?? true);
    }
  }, [prefs]);

  const handleSave = async () => {
    try {
      await updatePrefs.mutateAsync({
        recordatorioActivo,
        horaRecordatorio,
        notificacionesEmail,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error al guardar notificaciones:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6 animate-pulse">
        <div className="h-6 w-48 bg-neutral-700 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-12 bg-neutral-700 rounded" />
          <div className="h-12 bg-neutral-700 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        Notificaciones
      </h3>

      <div className="space-y-6">
        {/* Recordatorio activo */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-border">
          <div>
            <p className="text-white font-medium">Recordatorio de estudio</p>
            <p className="text-gray-500 text-sm">Recibe un recordatorio diario para estudiar</p>
          </div>
          <button
            onClick={() => setRecordatorioActivo(!recordatorioActivo)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              recordatorioActivo ? 'bg-primary' : 'bg-neutral-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                recordatorioActivo ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Hora del recordatorio */}
        {recordatorioActivo && (
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Hora del recordatorio
            </label>
            <select
              value={horaRecordatorio}
              onChange={(e) => setHoraRecordatorio(e.target.value)}
              className="w-full md:w-64 bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
            >
              {HORAS_RECORDATORIO.map((op) => (
                <option key={op.value} value={op.value} className="bg-neutral-700">
                  {op.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notificaciones por email */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-border">
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Notificaciones por email
            </p>
            <p className="text-gray-500 text-sm">Recibe actualizaciones sobre tu progreso</p>
          </div>
          <button
            onClick={() => setNotificacionesEmail(!notificacionesEmail)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              notificacionesEmail ? 'bg-primary' : 'bg-neutral-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                notificacionesEmail ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          disabled={updatePrefs.isPending}
          className="bg-primary hover:bg-yellow-600 text-neutral-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {updatePrefs.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : null}
          {saved ? 'Guardado' : 'Guardar Notificaciones'}
        </button>
      </div>
    </div>
  );
}