'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from './LogoutButton';
import { useAuthStore, getInitials } from '@/store/authStore';

export function TopNav() {
  const pathname = usePathname();
  const { user, plan } = useAuthStore();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/dashboard' && pathname?.startsWith(path));
    return `h-16 flex items-center px-1 text-sm font-medium transition-colors ${
      isActive 
        ? 'text-primary border-b-2 border-primary' 
        : 'text-gray-400 hover:text-white border-b-2 border-transparent'
    }`;
  };

  // Obtener iniciales del usuario
  const initials = user ? getInitials(user.nombre, user.apellido) : '?';
  const streak = user?.streakDias || 0;

  return (
    <nav className="h-16 border-b border-neutral-border bg-neutral-900 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          <span className="text-primary">Combo</span> <span className="text-white">UNSA</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className={getLinkClass('/dashboard')}>
            Dashboard
          </Link>
          <Link href="/simulacros" className={getLinkClass('/simulacros')}>
            Simulacros
          </Link>
          <Link href="/flashcards/hoy" className={getLinkClass('/flashcards/hoy')}>
            Flashcards
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-border">
          <span className="text-primary">🔥</span>
          <span className="text-white font-medium text-sm font-mono">{streak}</span>
        </div>
        
        {/* Plan Badge */}
        {plan === 'pro' ? (
          <Link href="/perfil" className="bg-primary hover:bg-yellow-600 text-neutral-900 font-bold text-xs px-3 py-1.5 rounded uppercase tracking-wide transition-colors">
            PRO
          </Link>
        ) : (
          <Link href="/perfil" className="bg-secondary hover:bg-blue-800 text-white font-bold text-xs px-3 py-1.5 rounded uppercase tracking-wide transition-colors">
            FREE
          </Link>
        )}
        
        {/* Avatar con iniciales - link al perfil */}
        <Link href="/perfil" className="w-8 h-8 rounded-full bg-primary overflow-hidden border border-primary flex items-center justify-center hover:scale-105 transition-transform">
          <span className="text-neutral-900 font-bold text-sm">{initials}</span>
        </Link>
        <LogoutButton />
      </div>
    </nav>
  );
}
