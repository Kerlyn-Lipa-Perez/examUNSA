'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BarChart2, PieChart, Settings, Calendar } from 'lucide-react';

const SVGIcon = ({ name, className }: { name: string, className?: string }) => {
  return (
    <svg className={`w-5 h-5 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {name === 'dashboard' && <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />}
      {name === 'cursos' && <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.254 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
      {name === 'ranking' && <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
      {name === 'stats' && <><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></>}
      {name === 'settings' && <><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>}
      {name === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
    </svg>
  );
};

export function Sidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/dashboard' && pathname?.startsWith(path));
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-4 transition-colors font-medium ${
      isActive 
        ? 'bg-neutral-800 text-primary border-primary' 
        : 'text-gray-400 hover:text-white hover:bg-neutral-800 border-transparent'
    }`;
  };

  return (
    <aside className="w-64 border-r border-neutral-border bg-neutral-900 hidden md:flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-6">
        <h3 className="text-xs font-semibold text-gray-500 tracking-wider mb-2 uppercase">Sesión Actual</h3>
        <p className="text-primary font-medium text-sm">Estudiante Nocturno</p>
        <p className="text-gray-500 text-xs mt-1">128 Horas de Estudio</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <Link href="/dashboard" className={getLinkClass('/dashboard')}>
          <SVGIcon name="dashboard" />
          Dashboard
        </Link>
        <Link href="/simulacros" className={getLinkClass('/simulacros')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Simulacros
        </Link>
        <Link href="/flashcards/hoy" className={getLinkClass('/flashcards')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Flashcards
        </Link>
        <Link href="/cursos" className={getLinkClass('/cursos')}>
          <SVGIcon name="cursos" />
          Cursos
        </Link>
        <Link href="/ranking" className={getLinkClass('/ranking')}>
          <SVGIcon name="ranking" />
          Ranking
        </Link>
        <Link href="/estadisticas" className={getLinkClass('/estadisticas')}>
          <SVGIcon name="stats" />
          Estadísticas
        </Link>
        <Link href="/perfil" className={getLinkClass('/perfil')}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mi Perfil
        </Link>
        <Link href="/configuracion" className={getLinkClass('/configuracion')}>
          <SVGIcon name="settings" />
          Configuración
        </Link>
      </nav>

      <div className="p-4 mb-4">
        <Link href="/plan-estudio" className={getLinkClass('/plan-estudio')}>
          <SVGIcon name="calendar" className="w-4 h-4" />
          Plan de Estudio
        </Link>
      </div>
    </aside>
  );
}
