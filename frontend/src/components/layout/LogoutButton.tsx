"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function LogoutButton() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('access_token');
    router.push('/login');
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-neutral-800"
        title="Cerrar sesión"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          {/* Dialog */}
          <div className="relative bg-neutral-800 border border-neutral-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">¿Cerrar sesión?</h3>
              <p className="text-gray-400 text-sm mb-6">
                Tendrás que volver a iniciar sesión para acceder a tu cuenta.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-border text-gray-300 hover:bg-neutral-700 font-medium text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
