'use client';

import { useUserProfileData } from '@/hooks/useUserProfile';
import {
  UserProfileHeader,
  PlanCard,
  StatsGrid,
  ProgressMaterias,
  RecentSimulacros,
} from '@/components/perfil';
import { Loader2, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function PerfilPage() {
  const { profile, stats, isLoading, error } = useUserProfileData();
  const { logout } = useAuthStore();

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <p className="text-error text-lg">Error al cargar el perfil</p>
        <p className="text-gray-500 text-sm mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header de la página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
          <p className="text-gray-400 mt-1">Gestiona tu cuenta y ve tu progreso</p>
        </div>
        
        {/* Botones de acciones */}
        <div className="flex items-center gap-2">
          <Link
            href="/configuracion"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-border text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Configuración</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-border text-gray-400 hover:text-error hover:bg-error/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Header del usuario (avatar, nombre, plan) */}
          <div className="bg-neutral-800 rounded-2xl border border-neutral-border">
            <UserProfileHeader profile={profile} isLoading={isLoading} />
          </div>

          {/* Plan Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <PlanCard profile={profile} isLoading={isLoading} />
            </div>
            
            {/* Stats Rápidos */}
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-border">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Hoy
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Simulacros hoy</span>
                  <span className="font-mono text-white">{stats?.simulacrosHoy || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Días de racha</span>
                  <span className="font-mono text-primary">{stats?.diasRacha || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total simulacros</span>
                  <span className="font-mono text-white">{stats?.simulacrosTotales || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid Principal */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Estadísticas</h2>
            <StatsGrid stats={stats} isLoading={isLoading} />
          </div>

          {/* Progreso + Recientes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressMaterias stats={stats} isLoading={isLoading} />
            <RecentSimulacros stats={stats} isLoading={isLoading} />
          </div>
        </>
      )}

      {/* Footer de la página */}
      <div className="text-center text-gray-500 text-xs py-8">
        <p>Combo UNSA © 2026 - Todos los derechos reservados</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link>
          <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
        </div>
      </div>
    </div>
  );
}