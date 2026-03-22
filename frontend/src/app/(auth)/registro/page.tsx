import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col font-sans relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Header */}
      <header className="relative z-10 w-full flex justify-between items-center px-6 py-4 border-b border-neutral-border bg-neutral-900/80 backdrop-blur-sm">
        <div className="text-2xl font-bold tracking-tighter text-primary uppercase">
          COMBO UNSA
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-primary transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 pt-12 pb-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 border border-neutral-border rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Únete a la elite académica</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-neutral-800 border border-neutral-border p-8 rounded-2xl shadow-2xl relative">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Registro</h1>
              <p className="text-gray-400 text-sm font-light">Comienza tu camino hacia la vacante hoy.</p>
            </div>
            
            <form className="space-y-6">
              {/* Nombre Completo */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-500" htmlFor="name">Nombre Completo</label>
                <div className="relative">
                  <input className="w-full bg-transparent border-b-2 border-neutral-border focus:border-primary focus:ring-0 px-0 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300" id="name" placeholder="Ej. Mario Vargas Llosa" type="text"/>
                </div>
              </div>
              
              {/* Email */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-500" htmlFor="email">Email</label>
                <div className="relative">
                  <input className="w-full bg-transparent border-b-2 border-neutral-border focus:border-primary focus:ring-0 px-0 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300" id="email" placeholder="estudiante@unsa.edu.pe" type="email"/>
                </div>
              </div>
              
              {/* Celular */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-500" htmlFor="phone">Celular</label>
                <div className="relative">
                  <input className="w-full bg-transparent border-b-2 border-neutral-border focus:border-primary focus:ring-0 px-0 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300" id="phone" placeholder="987 654 321" type="tel"/>
                </div>
              </div>
              
              {/* Contraseña */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-500" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <input className="w-full bg-transparent border-b-2 border-neutral-border focus:border-primary focus:ring-0 px-0 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300" id="password" placeholder="••••••••" type="password"/>
                  <button type="button" className="absolute right-0 top-3 text-gray-500 hover:text-white cursor-pointer select-none">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                     </svg>
                  </button>
                </div>
              </div>
              
              {/* CTA */}
              <div className="pt-4">
                <Link href="/dashboard" className="w-full bg-gradient-to-br from-primary to-[#B8860B] text-neutral-900 font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center">
                  Crear Cuenta
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </form>
            
            {/* Footer Link */}
            <div className="mt-8 text-center">
              <Link href="/login" className="text-sm text-gray-400 hover:text-primary transition-colors duration-200">
                  ¿Ya eres estudiante? <span className="font-bold underline">Inicia sesión</span>
              </Link>
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-neutral-800 rounded-lg border border-neutral-border">
              <div className="font-mono text-primary text-lg font-bold">15k+</div>
              <div className="font-mono text-[8px] uppercase text-gray-500 tracking-tighter">Ingresantes</div>
            </div>
            <div className="text-center p-3 bg-neutral-800 rounded-lg border border-neutral-border">
              <div className="font-mono text-primary text-lg font-bold">98%</div>
              <div className="font-mono text-[8px] uppercase text-gray-500 tracking-tighter">Efectividad</div>
            </div>
            <div className="text-center p-3 bg-neutral-800 rounded-lg border border-neutral-border">
              <div className="font-mono text-primary text-lg font-bold">24/7</div>
              <div className="font-mono text-[8px] uppercase text-gray-500 tracking-tighter">Soporte</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-neutral-border bg-neutral-900 z-10 mt-auto">
        <div className="font-mono text-[11px] uppercase tracking-widest text-primary">
            © 2026 COMBO UNSA. Unknown Company.
        </div>
        <div className="flex gap-6">
          <Link href="#" className="font-mono text-[11px] uppercase tracking-widest text-gray-500 hover:text-primary underline decoration-primary/50">Privacy Policy</Link>
          <Link href="#" className="font-mono text-[11px] uppercase tracking-widest text-gray-500 hover:text-primary underline decoration-primary/50">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
