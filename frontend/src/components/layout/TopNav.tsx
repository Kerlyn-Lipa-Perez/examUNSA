import Link from 'next/link';

export function TopNav() {
  return (
    <nav className="h-16 border-b border-neutral-border bg-neutral-900 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          <span className="text-primary">Combo</span> <span className="text-white">UNSA</span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-primary border-b-2 border-primary h-16 flex items-center px-1 text-sm font-medium">
            Dashboard
          </Link>
          <Link href="/simulacros" className="text-gray-400 hover:text-white transition-colors h-16 flex items-center px-1 text-sm font-medium">
            Simulacros
          </Link>
          <Link href="/flashcards" className="text-gray-400 hover:text-white transition-colors h-16 flex items-center px-1 text-sm font-medium">
            Flashcards
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-border">
          <span className="text-primary">🔥</span>
          <span className="text-white font-medium text-sm">12</span>
        </div>
        <button className="bg-primary hover:bg-yellow-600 text-neutral-900 font-bold text-xs px-3 py-1.5 rounded uppercase tracking-wide transition-colors">
          PRO
        </button>
        <div className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-neutral-border">
          <img src="/avatar-placeholder.png" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </nav>
  );
}
