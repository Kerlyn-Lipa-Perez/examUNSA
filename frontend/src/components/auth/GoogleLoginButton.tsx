'use client';

import { useRouter } from 'next/navigation';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

export function GoogleLoginButton() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('No se recibió el token de Google');
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al iniciar sesión con Google');
      }

      const resolvedToken = data.token || data.access_token;
      const resolvedUser = data.user;

      if (resolvedToken && resolvedUser) {
        setAuth(resolvedUser, resolvedToken);
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión con Google';
      setError(errorMessage);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-3 text-red-500 text-sm bg-red-900/20 p-3 rounded text-center">
          {error}
        </div>
      )}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('Error al conectar con Google')}
          theme="filled_black"
          size="large"
          text="continue_with"
          shape="pill"
          width="320"
        />
      </div>
    </div>
  );
}
