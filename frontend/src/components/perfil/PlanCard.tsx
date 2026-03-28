'use client';

import { UserProfile } from '@/types/perfil';
import { Crown, Calendar, CreditCard, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface PlanCardProps {
  profile: UserProfile | undefined;
  isLoading: boolean;
}

export function PlanCard({ profile, isLoading }: PlanCardProps) {
  if (isLoading || !profile) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border animate-pulse">
        <div className="h-6 w-24 bg-neutral-700 rounded mb-4" />
        <div className="h-16 w-full bg-neutral-700 rounded" />
      </div>
    );
  }

  const isPro = profile.plan === 'pro';

  if (isPro) {
    return (
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6 border border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-bold text-white">Tu Plan</h3>
          </div>
          <span className="bg-primary text-neutral-900 px-3 py-1 rounded-full text-xs font-bold">
            PRO
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-300">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">Tienes acceso completo a todas las funciones IA</span>
          </div>

          <div className="pt-4 border-t border-neutral-border">
            <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Gestionar Suscripción
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Tu Plan</h3>
        </div>
        <span className="bg-secondary text-white px-3 py-1 rounded-full text-xs font-bold">
          FREE
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-gray-400 text-sm">
          Actualiza a Pro para desbloquear todas las funciones avanzadas
        </p>

        {/* Features */}
        <div className="space-y-2">
          {[
            'Flashcards ilimitadas con IA',
            'Simulacros IA ilimitados',
            'Tutor IA integrado',
            'Análisis detallado de progreso',
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-gray-300">
              <span className="text-success">✓</span>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/dashboard"
        className="block w-full bg-primary hover:bg-yellow-600 text-neutral-900 py-3 rounded-lg text-sm font-bold text-center transition-colors"
      >
        Mejorar a Pro
      </Link>
    </div>
  );
}