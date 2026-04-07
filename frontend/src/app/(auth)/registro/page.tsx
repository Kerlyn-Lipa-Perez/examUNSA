"use client";
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      const resolvedToken = data.token || data.access_token;
      const resolvedUser = data.user;

      if (resolvedToken && resolvedUser) {
        setAuth(resolvedUser, resolvedToken);
        router.push('/dashboard');
      } else if (resolvedToken) {
  
        setAuth({
          id: '',
          nombre,
          email,
          plan: 'free',
        }, resolvedToken);
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el registro';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            
            {error && <div className="mb-4 text-red-500 text-sm bg-red-900/20 p-3 rounded">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Nombre de Usuario */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-500" htmlFor="name">Nombre de Usuario</label>
                <div className="relative">
                  <input 
                    className="w-full bg-transparent border-b-2 border-neutral-border focus:border-primary focus:ring-0 px-0 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300" 
                    id="name" 
                    placeholder="Ej. Mario Vargas Llosa" 
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Email */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-500" htmlFor="email">Email</label>
                <div className="relative">
                  <input 
                    className="w-full bg-transparent border-b-2 border-neutral-border focus:border-primary focus:ring-0 px-0 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300" 
                    id="email" 
                    placeholder="estudiante@unsa.edu.pe" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* Contraseña */}
              <div className="space-y-1">
                <label className="font-mono text-[11px] uppercase tracking-widest text-gray-500" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <input 
                    className="w-full bg-transparent border-b-2 border-neutral-border focus:border-primary focus:ring-0 px-0 py-3 text-white placeholder-gray-600 outline-none transition-all duration-300" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* CTA */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-primary to-[#B8860B] text-neutral-900 font-bold py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-center disabled:opacity-50"
                >
                  {loading ? 'Cargando...' : 'Crear Cuenta'}
                  {!loading && (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {/* Separador */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-neutral-800 px-3 text-gray-500 font-mono uppercase tracking-wider">o regístrate con</span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginButton />
            
            {/* Footer Link */}
            <div className="mt-6 pt-6 border-t border-neutral-border text-center">
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

      <Footer />
    </div>
  );
}
