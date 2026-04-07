"use client";
import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Validar que existe token al montar
  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError('Token de recuperación inválido o expirado');
    } else {
      setIsValidToken(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al restablecer contraseña');
      }

      setSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al restablecer contraseña';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Estado: token inválido
  if (isValidToken === false) {
    return (
      <div className="bg-neutral-900 text-white min-h-screen flex flex-col font-sans relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

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

        <main className="flex-grow flex items-center justify-center p-6 relative z-10">
          <div className="w-full max-w-[420px] relative">
            <div className="bg-neutral-800 border border-neutral-border rounded-xl p-8 md:p-10 shadow-2xl relative">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Enlace Inválido</h1>
                <p className="text-gray-400 text-sm mb-6">
                  El enlace de recuperación ha expirado o es inválido. Por favor, solicita uno nuevo.
                </p>
                <Link 
                  href="/olvidaste-tu-contrasena"
                  className="inline-block bg-primary text-neutral-900 py-3 px-6 rounded-lg font-bold hover:brightness-110 transition-all"
                >
                  Solicitar nuevo enlace
                </Link>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-border text-center">
                <p className="text-gray-400 text-sm">
                  ¿Ya recordaste tu contraseña? 
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

  // Estado: token válido pero sin éxito
  if (!success) {
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
              <div className="mb-8 text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17h9v-2l-3.149-3.149A6 6 0 0118 9zM12 2L10.149 3.85a6 6 0 01-3.149 3.149L2.343 12.05A1 1 0 013.05 14.05L12 23" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Nueva Contraseña</h1>
                <p className="text-gray-400 text-sm font-light">Crea una nueva contraseña segura para tu cuenta</p>
              </div>
              
              {error && (
                <div className="mb-4 text-red-500 text-sm bg-red-900/20 p-3 rounded text-center">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Input Password */}
                <div className="relative group">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-gray-400 block mb-1 group-focus-within:text-primary transition-colors">Nueva Contraseña</label>
                  <div className="flex items-center border-b-2 border-neutral-border group-focus-within:border-primary transition-all bg-transparent group-focus-within:bg-neutral-700/30 px-1 py-2">
                    <svg className="text-gray-500 group-focus-within:text-primary w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <input 
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 font-medium outline-none" 
                      placeholder="••••••••" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Input Confirm Password */}
                <div className="relative group">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-gray-400 block mb-1 group-focus-within:text-primary transition-colors">Confirmar Contraseña</label>
                  <div className="flex items-center border-b-2 border-neutral-border group-focus-within:border-primary transition-all bg-transparent group-focus-within:bg-neutral-700/30 px-1 py-2">
                    <svg className="text-gray-500 group-focus-within:text-primary w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <input 
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 font-medium outline-none" 
                      placeholder="••••••••" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading || !token}
                  className="w-full bg-gradient-to-br from-primary to-[#B8860B] py-4 rounded-lg text-neutral-900 font-bold text-lg tracking-tight hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 text-center group disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      GUARDANDO...
                    </>
                  ) : (
                    <>
                      GUARDAR NUEVA CONTRASEÑA
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 pt-6 border-t border-neutral-border text-center">
                <p className="text-gray-400 text-sm">
                  ¿Ya recordaste tu contraseña? 
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

  // Estado: éxito
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

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

      <main className="flex-grow flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-[420px] relative">
          <div className="bg-neutral-800 border border-neutral-border rounded-xl p-8 md:p-10 shadow-2xl relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">¡Contraseña Restablecida!</h1>
              <p className="text-gray-400 text-sm mb-8">
                Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>
              <Link 
                href="/login"
                className="inline-block bg-primary text-neutral-900 py-3 px-6 rounded-lg font-bold hover:brightness-110 transition-all"
              >
                IR A INICIAR SESIÓN
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="bg-neutral-900 text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
