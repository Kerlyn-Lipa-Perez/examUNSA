'use client';

import { useState, useEffect } from 'react';
import { useUpdatePreferences, useUserPreferences } from '@/hooks/useConfiguracion';
import { Volume2, Vibrate, Loader2, CheckCircle } from 'lucide-react';

export function SoundTimerSettings() {
  const { data: prefs, isLoading } = useUserPreferences();
  const updatePrefs = useUpdatePreferences();

  const [sonidosTimer, setSonidosTimer] = useState(true);
  const [vibracion, setVibracion] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefs) {
      setSonidosTimer(prefs.sonidosTimer ?? true);
      setVibracion(prefs.vibracion ?? true);
    }
  }, [prefs]);

  const handleSave = async () => {
    try {
      await updatePrefs.mutateAsync({
        sonidosTimer,
        vibracion,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error al guardar configuración de sonido:', err);
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
        <Volume2 className="w-5 h-5 text-primary" />
        Sonido y Timer
      </h3>

      <div className="space-y-4">
        {/* Sonidos del timer */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-border">
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Sonidos del timer
            </p>
            <p className="text-gray-500 text-sm">Reproducir sonidos al comenzar y terminar el examen</p>
          </div>
          <button
            onClick={() => setSonidosTimer(!sonidosTimer)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              sonidosTimer ? 'bg-primary' : 'bg-neutral-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                sonidosTimer ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Vibración */}
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-white font-medium flex items-center gap-2">
              <Vibrate className="w-4 h-4" />
              Vibración
            </p>
            <p className="text-gray-500 text-sm">Vibrar al %10 y %5 restante del tiempo</p>
          </div>
          <button
            onClick={() => setVibracion(!vibracion)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              vibracion ? 'bg-primary' : 'bg-neutral-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                vibracion ? 'left-7' : 'left-1'
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
          {saved ? 'Guardado' : 'Guardar Configuración'}
        </button>
      </div>
    </div>
  );
}