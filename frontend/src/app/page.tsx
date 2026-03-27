import Link from 'next/link';
import { 
  BookOpen, 
  BrainCircuit, 
  BarChart3, 
  ChevronRight, 
  Sparkles,
  Zap,
  Target,
  Trophy
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100 selection:bg-primary/30 selection:text-primary">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-neutral-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-neutral-900" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Combo <span className="text-primary">UNSA</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#8B949E]">
            <a href="#simulacros" className="hover:text-primary transition-colors">Simulacros</a>
            <a href="#flashcards" className="hover:text-primary transition-colors">Flashcards</a>
            <a href="#metodologia" className="hover:text-primary transition-colors">Metodología</a>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Ingresar
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2 text-sm font-bold bg-primary text-neutral-900 rounded-lg hover:bg-yellow-600 transition-all shadow-lg shadow-primary/10 active:scale-95"
            >
              Comenzar Ahora
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background Accents (Andean Night Lights) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-info/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800 border border-white/5 text-xs font-bold text-primary mb-6 animate-fade-in">
              <Zap className="w-3 h-3" />
              <span>POTENCIADO POR INTELIGENCIA ARTIFICIAL</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
              Domina el Examen <span className="text-primary italic">UNSA</span> <br />
              con la <span className="bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">Academia del Futuro</span>
            </h1>
            
            <p className="text-xl text-[#8B949E] max-w-2xl mx-auto mb-10 leading-relaxed">
              Olvida los métodos obsoletos. Accede a simulacros personalizados que detectan tus debilidades y flashcards inteligentes con repaso espaciado.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register" 
                className="w-full sm:w-auto px-8 py-4 bg-primary text-neutral-900 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1"
              >
                Crea tu cuenta gratis
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 bg-neutral-800 text-white rounded-xl font-bold text-lg border border-neutral-border hover:bg-neutral-700 transition-all"
              >
                Ver Demo
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto py-10 border-t border-b border-white/5">
              <div className="text-center group">
                <div className="font-mono text-3xl font-bold text-primary group-hover:scale-110 transition-transform">+10,000</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-widest mt-1">Preguntas</div>
              </div>
              <div className="text-center group">
                <div className="font-mono text-3xl font-bold text-primary group-hover:scale-110 transition-transform">98.4%</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-widest mt-1">Precisión IA</div>
              </div>
              <div className="text-center group">
                <div className="font-mono text-3xl font-bold text-primary group-hover:scale-110 transition-transform">1,200+</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-widest mt-1">Ingresantes</div>
              </div>
              <div className="text-center group">
                <div className="font-mono text-3xl font-bold text-primary group-hover:scale-110 transition-transform">5.0</div>
                <div className="text-xs font-medium text-[#8B949E] uppercase tracking-widest mt-1">Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-neutral-900/50" id="simulacros">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Herramientas diseñadas para ganar</h2>
              <p className="text-[#8B949E] max-w-xl mx-auto text-lg leading-relaxed">
                Menos esfuerzo, mejores resultados. Nuestro sistema se adapta a tu ritmo, no al revés.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl bg-neutral-800 border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-all" />
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Simulacros con Redes Neuronales</h3>
                <p className="text-[#8B949E] leading-relaxed text-sm">
                  Nuestra IA analiza tus fallos en tiempo real para generar simulacros que ataquen tus lagunas de conocimiento. Exclusivo para el temario UNSA.
                </p>
                <div className="mt-6 flex items-center text-xs font-bold text-primary tracking-widest uppercase gap-1 group-hover:gap-2 transition-all">
                  Saber más <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl bg-neutral-800 border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden shadow-2xl">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-info/5 blur-2xl rounded-full" />
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-xl font-bold mb-3">Flashcards de Nivel Epistémico</h3>
                <p className="text-[#8B949E] leading-relaxed text-sm">
                  Utilizamos Repaso Espaciado (SRS) para garantizar que los conceptos clave de Biología, Física y Civismo nunca se olviden. Memoria a largo plazo.
                </p>
                <div className="mt-6 flex items-center text-xs font-bold text-info tracking-widest uppercase gap-1 group-hover:gap-2 transition-all">
                  Explorar mazos <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl bg-neutral-800 border border-white/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-success/5 blur-2xl rounded-full" />
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-xl font-bold mb-3">Analítica Predictiva de Ingreso</h3>
                <p className="text-[#8B949E] leading-relaxed text-sm">
                  Mira tu probabilidad real de ingreso según tu puntaje histórico. Datos precisos usando tipografía mono para máxima legibilidad.
                </p>
                <div className="mt-6 flex items-center text-xs font-bold text-success tracking-widest uppercase gap-1 group-hover:gap-2 transition-all">
                  Ver métricas <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-bottom-right" />
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">¿Preparado para tu vacante?</h2>
            <p className="text-xl text-[#8B949E] mb-10">
              Únete a la plataforma que está cambiando la forma de prepararse en Arequipa.
            </p>
            <Link 
              href="/register" 
              className="px-12 py-5 bg-primary text-neutral-900 rounded-2xl font-bold text-xl hover:bg-yellow-600 transition-all shadow-2xl shadow-primary/30 inline-flex items-center gap-3"
            >
              Empezar ahora — Es gratis
              <Trophy className="w-6 h-6" />
            </Link>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[#8B949E]">
              <div className="flex items-center gap-2 italic">
                <Target className="w-4 h-4 text-primary" /> Exclusivo para CEPRUNSA / ORDINARIO
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 grayscale brightness-200 opacity-50">
            <span className="font-bold tracking-tighter">COMBO UNSA</span>
          </div>
          <p className="text-[#8B949E] text-sm">
            © 2026 Combo UNSA Co. Todos los derechos reservados. <br />
            Diseñado para la excelencia académica en la Ciudad Blanca.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 rounded-lg bg-neutral-800 text-[#8B949E] hover:text-white transition-all"><Sparkles className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}