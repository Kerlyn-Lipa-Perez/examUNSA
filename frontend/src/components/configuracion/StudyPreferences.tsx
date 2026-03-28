'use client';

import { useState, useEffect } from 'react';
import { useUpdatePreferences, useUserPreferences } from '@/hooks/useConfiguracion';
import { META_DIARIA_OPCIONES, FLASHCARDS_POR_DIA_OPCIONES } from '@/types/configuracion';
import { BookOpen, Target, Loader2, CheckCircle } from 'lucide-react';

export function StudyPreferences() {
  const { data: prefs, isLoading } = useUserPreferences();
  const updatePrefs = useUpdatePreferences();

  const [metaDiariaHoras, setMetaDiariaHoras] = useState(2);
  const [flashcardsNuevasDia, setFlashcardsNuevasDia] = useState(20);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (prefs) {
      setMetaDiariaHoras(prefs.metaDiariaHoras || 2);
      setFlashcardsNuevasDia(prefs.flashcardsNuevasDia || 20);
    }
  }, [prefs]);

  const handleSave = async () => {
    try {
      await updatePrefs.mutateAsync({
        metaDiariaHoras,
        flashcardsNuevasDia,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error al guardar preferencias:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6 animate-pulse">
        <div className="h-6 w-48 bg-neutral-700 rounded mb-4" />
        <div className="h-12 bg-neutral-700 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Preferencias de Estudio
      </h3>

      <div className="space-y-6">
        {/* Meta diaria */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <Target className="w-4 h-4 inline mr-1" />
            Meta diaria de estudio
          </label>
          <select
            value={metaDiariaHoras}
            onChange={(e) => setMetaDiariaHoras(Number(e.target.value))}
            className="w-full md:w-64 bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            {META_DIARIA_OPCIONES.map((op) => (
              <option key={op.value} value={op.value} className="bg-neutral-700">
                {op.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Define cuántas horas quieres estudiar cada día
          </p>
        </div>

        {/* Flashcards nuevas por día */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            <BookOpen className="w-4 h-4 inline mr-1" />
            Flashcards nuevas por día
          </label>
          <select
            value={flashcardsNuevasDia}
            onChange={(e) => setFlashcardsNuevasDia(Number(e.target.value))}
            className="w-full md:w-64 bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
          >
            {FLASHCARDS_POR_DIA_OPCIONES.map((op) => (
              <option key={op.value} value={op.value} className="bg-neutral-700">
                {op.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Cantidad máxima de tarjetas nuevas que estudiarás diariamente
          </p>
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
          {saved ? 'Guardado' : 'Guardar Preferencias'}
        </button>
      </div>
    </div>
  );
}