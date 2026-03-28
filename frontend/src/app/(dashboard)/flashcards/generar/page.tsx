'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useGenerarIA } from '@/hooks/useFlashcards';
import { MATERIAS, MATERIA_LABELS, type GenerarCardsDto } from '@/types/flashcard';
import { Sparkles, Loader2, ArrowLeft, CheckCircle, Lock } from 'lucide-react';

export default function GenerarFlashcardsPage() {
  const { user } = useAuthStore();
  const hasProAccess = user?.plan === 'pro';

  const [tema, setTema] = useState('');
  const [materia, setMateria] = useState<string>('');
  const [isGenerated, setIsGenerated] = useState(false);

  const generarMutate = useGenerarIA();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tema.trim() || !materia) return;

    try {
      await generarMutate.mutateAsync({
        tema: tema.trim(),
        materia,
      } as GenerarCardsDto);
      setIsGenerated(true);
    } catch (err) {
      console.error('Error al generar flashcards:', err);
    }
  }, [tema, materia, generarMutate]);

  // If user doesn't have Pro access, show upgrade prompt
  if (!hasProAccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          href="/flashcards/hoy"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a flashcards
        </Link>

        <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-secondary" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            ¡Necesitas Plan Pro!
          </h2>
          
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            La generación de flashcards con IA es una característica exclusiva del plan Pro.
            ¡Actualiza tu plan para desbloquear esta y otras funciones avanzadas!
          </p>

          <div className="bg-neutral-700 rounded-xl p-6 mb-8">
            <h3 className="text-primary font-bold text-lg mb-4">Funciones del Plan Pro:</h3>
            <ul className="text-left text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Flashcards ilimitadas con IA
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Simulacros sin límites
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Análisis detallado de progreso
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Soporte prioritario
              </li>
            </ul>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
          >
            Mejorar mi Plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/flashcards/hoy"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a flashcards
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Generar Flashcards con IA
            </h1>
            <p className="text-gray-400">
              Crea tarjetas de estudio personalizadas
            </p>
          </div>
        </div>
      </div>

      {/* Success State */}
      {isGenerated && (
        <div className="bg-success/10 border border-success rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-success" />
            <div>
              <h3 className="text-success font-bold">¡Flashcards generadas!</h3>
              <p className="text-gray-400 text-sm">
                Se han creado 10 tarjetas para el tema: {tema}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Generate Form */}
      <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tema input */}
          <div>
            <label htmlFor="tema" className="block text-sm font-medium text-gray-300 mb-2">
              Tema o concepto a estudiar
            </label>
            <input
              type="text"
              id="tema"
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ej: Fotosíntesis, Leyes de Newton, Guerra del Pacífico..."
              className="w-full bg-neutral-700 border border-neutral-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              disabled={generarMutate.isPending}
            />
          </div>

          {/* Materia select */}
          <div>
            <label htmlFor="materia" className="block text-sm font-medium text-gray-300 mb-2">
              Materia
            </label>
            <select
              id="materia"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              className="w-full bg-neutral-700 border border-neutral-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              disabled={generarMutate.isPending}
            >
              <option value="" className="bg-neutral-700">Selecciona una materia</option>
              {MATERIAS.map((m) => (
                <option key={m} value={m} className="bg-neutral-700">
                  {MATERIA_LABELS[m]}
                </option>
              ))}
            </select>
          </div>

          {/* Info box */}
          <div className="bg-neutral-700/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">
              <span className="text-primary font-medium">IA generará 10 tarjetas</span> basadas en el tema y materia seleccionados.
              Las tarjetas se añadirán a tu colección personal.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={generarMutate.isPending || !tema.trim() || !materia}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generarMutate.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generar Flashcards
              </>
            )}
          </button>
        </form>

        {/* Examples */}
        <div className="mt-8 pt-6 border-t border-neutral-border">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Ejemplos de temas populares:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Sistema respiratorio',
              'Álgebra básica',
              'Segunda Guerra Mundial',
              'Circuitos eléctricos',
              'Microeconomía',
            ].map((example) => (
              <button
                key={example}
                onClick={() => setTema(example)}
                className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-full text-sm text-gray-300 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}