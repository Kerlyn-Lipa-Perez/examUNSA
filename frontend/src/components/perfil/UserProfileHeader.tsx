'use client';

import { UserProfile } from '@/types/perfil';
import { getInitials } from '@/store/authStore';
import { Mail, Calendar, Crown } from 'lucide-react';

interface UserProfileHeaderProps {
  profile: UserProfile | undefined;
  isLoading: boolean;
}

export function UserProfileHeader({ profile, isLoading }: UserProfileHeaderProps) {
  if (isLoading || !profile) {
    return (
      <div className="flex flex-col items-center py-8 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-neutral-700" />
        <div className="h-8 w-48 bg-neutral-700 rounded mt-4" />
        <div className="h-5 w-64 bg-neutral-700 rounded mt-2" />
      </div>
    );
  }

  const initials = getInitials(profile.nombre, profile.apellido || '');
  const fechaRegistro = profile.createdAt 
    ? new Date(profile.createdAt).toLocaleDateString('es-PE', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })
    : 'N/A';

  return (
    <div className="flex flex-col items-center py-8">
      {/* Avatar circular con iniciales */}
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-primary/30">
        <span className="text-neutral-900 text-3xl font-bold">{initials}</span>
      </div>

      {/* Nombre */}
      <h1 className="text-3xl font-bold text-white mt-4">
        {profile.nombre} {profile.apellido || ''}
      </h1>

      {/* Email */}
      <div className="flex items-center gap-2 text-gray-400 mt-2">
        <Mail className="w-4 h-4" />
        <span className="text-sm">{profile.email}</span>
      </div>

      {/* Plan Badge */}
      <div className="mt-4">
        {profile.plan === 'pro' ? (
          <span className="inline-flex items-center gap-2 bg-primary text-neutral-900 px-4 py-1.5 rounded-full font-bold text-sm">
            <Crown className="w-4 h-4" />
            Plan Pro
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-1.5 rounded-full font-bold text-sm">
            Plan Free
          </span>
        )}
      </div>

      {/* Fecha de registro */}
      <div className="flex items-center gap-2 text-gray-500 mt-3">
        <Calendar className="w-4 h-4" />
        <span className="text-xs">Miembro desde {fechaRegistro}</span>
      </div>
    </div>
  );
}