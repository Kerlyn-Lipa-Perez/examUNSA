'use client';

import Link from 'next/link';
import { Sparkles, PartyPopper, ArrowRight } from 'lucide-react';

interface EmptyFlashcardsProps {
  hasProAccess?: boolean;
}

export function EmptyFlashcards({ hasProAccess = false }: EmptyFlashcardsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-6">
        <PartyPopper className="w-10 h-10 text-primary" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">
        ¡Felicitaciones! 🎉
      </h2>
      
      <p className="text-gray-400 max-w-md mb-8">
        No tienes tarjetas pendientes para estudiar hoy. 
        ¡Tu sistema de repetición está al día!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/simulacros"
          className="inline-flex items-center gap-2 bg-primary text-neutral-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          Hacer un Simulacro
        </Link>
        
        {hasProAccess && (
          <Link
            href="/flashcards/generar"
            className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Generar más Flashcards
          </Link>
        )}
        
        {!hasProAccess && (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-neutral-border text-gray-400 px-6 py-3 rounded-lg font-medium hover:text-white transition-colors"
          >
            Mejora tu Plan
          </Link>
        )}
      </div>
    </div>
  );
}