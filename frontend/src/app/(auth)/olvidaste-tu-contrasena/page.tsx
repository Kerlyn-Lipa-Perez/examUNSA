"use client";
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al solicitar recuperación');
      }

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al solicitar recuperación';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            {!success ? (
              <>
                <div className="mb-10 text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17h9v-2l-3.149-3.149A6 6 0 0118 9zM12 2L10.149 3.85a6 6 0 01-3.149 3.149L2.343 12.05A1 1 0 013.05 14.05L12 23" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Recuperar Acceso</h1>
                  <p className="text-gray-400 text-sm font-light">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña</p>
                </div>
                
                {error && (
                  <div className="mb-4 text-red-500 text-sm bg-red-900/20 p-3 rounded text-center">
                    {error}
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Input Email */}
                  <div className="relative group">
                    <label className="font-mono text-[11px] uppercase tracking-widest text-gray-400 block mb-1 group-focus-within:text-primary transition-colors">Correo Electrónico</label>
                    <div className="flex items-center border-b-2 border-neutral-border group-focus-within:border-primary transition-all bg-transparent group-focus-within:bg-neutral-700/30 px-1 py-2">
                      <svg className="text-gray-500 group-focus-within:text-primary w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <input 
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 font-medium outline-none" 
                        placeholder="tu@email.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-br from-primary to-[#B8860B] py-4 rounded-lg text-neutral-900 font-bold text-lg tracking-tight hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 text-center group disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ENVIANDO...
                      </>
                    ) : (
                      <>
                        ENVIAR ENLACE DE RECUPERACIÓN
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Correo Enviado</h1>
                  <p className="text-gray-400 text-sm mb-6">
                    Si existe una cuenta con <strong className="text-white">{email}</strong>, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                  </p>
                  <p className="text-gray-500 text-xs mb-8">
                    Revisa tu bandeja de entrada y spam. El enlace expire en 1 hora.
                  </p>
                </div>
              </>
            )}

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-neutral-border text-center">
              <p className="text-gray-400 text-sm">
                ¿Recordaste tu contraseña? 
                <Link href="/login" className="text-primary font-bold hover:underline ml-1">Iniciar sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
