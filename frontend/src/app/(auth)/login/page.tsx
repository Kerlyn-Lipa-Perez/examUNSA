import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 w-full flex justify-between items-center px-6 py-4 border-b border-neutral-border bg-neutral-900/80 backdrop-blur-sm">
        <div className="text-2xl font-bold tracking-tighter text-primary uppercase">
          COMBO UNSA
        </div>
        <div className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono text-[10px] tracking-widest uppercase">SOPORTE</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px] relative">
          {/* Card */}
          <div className="bg-neutral-800 border border-neutral-border rounded-xl p-8 md:p-10 shadow-2xl relative">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Ingresar</h1>
              <p className="text-gray-400 text-sm font-light">Portal de Alto Rendimiento Académico</p>
            </div>
            <form className="space-y-8">
              {/* Input Email/Code */}
              <div className="relative group">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-400 block mb-1 group-focus-within:text-primary transition-colors">Email o Código</label>
                <div className="flex items-center border-b-2 border-neutral-border group-focus-within:border-primary transition-all bg-transparent group-focus-within:bg-neutral-700/30 px-1 py-2">
                  <svg className="text-gray-500 group-focus-within:text-primary w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 font-medium outline-none" placeholder="ID Estudiantil o Correo" type="text"/>
                </div>
              </div>
              {/* Input Password */}
              <div className="relative group">
                <div className="flex justify-between items-end mb-1">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-gray-400 group-focus-within:text-primary transition-colors">Contraseña</label>
                  <Link href="#" className="text-[11px] text-gray-400 hover:text-primary transition-colors font-medium">¿Olvidaste tu contraseña?</Link>
                </div>
                <div className="flex items-center border-b-2 border-neutral-border group-focus-within:border-primary transition-all bg-transparent group-focus-within:bg-neutral-700/30 px-1 py-2">
                  <svg className="text-gray-500 group-focus-within:text-primary w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 font-medium outline-none" placeholder="••••••••" type="password"/>
                </div>
              </div>
              {/* Login Button */}
              <Link href="/dashboard" className="w-full bg-gradient-to-br from-primary to-[#B8860B] py-4 rounded-lg text-neutral-900 font-bold text-lg tracking-tight hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 text-center group">
                ACCEDER AL PANEL
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </form>
            <div className="mt-10 pt-8 border-t border-neutral-border text-center">
              <p className="text-gray-400 text-sm">
                ¿No tienes cuenta? 
                <Link href="/registro" className="text-primary font-bold hover:underline ml-1">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-neutral-border bg-neutral-900 z-10">
        <div className="font-mono text-[11px] uppercase tracking-widest text-primary">
            © 2026 COMBO UNSA. Unknown Company.
        </div>
        <nav className="flex gap-6">
          <Link href="#" className="font-mono text-[11px] uppercase tracking-widest text-gray-500 hover:text-primary underline decoration-primary/50">Privacy Policy</Link>
          <Link href="#" className="font-mono text-[11px] uppercase tracking-widest text-gray-500 hover:text-primary underline decoration-primary/50">Terms of Service</Link>
        </nav>
      </footer>
    </div>
  );
}
