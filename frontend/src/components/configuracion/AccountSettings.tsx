'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile, useUpdatePassword } from '@/hooks/useConfiguracion';
import { User, Lock, Eye, EyeOff, Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react';

export function AccountSettings() {
  const { user } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  // Profile form
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ nombre, email });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (nuevaPassword !== confirmarPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (nuevaPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await updatePassword.mutateAsync({
        passwordActual,
        nuevaPassword,
        confirmarPassword,
      });
      setPasswordSuccess(true);
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  return (
    <div className="space-y-8">
      {/* Datos de Cuenta */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Datos de Cuenta
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="bg-primary hover:bg-yellow-600 text-neutral-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : profileSaved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {profileSaved ? 'Guardado' : 'Guardar Cambios'}
          </button>
        </form>
      </div>

      {/* Cambiar Contraseña */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-border p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Cambiar Contraseña
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Contraseña actual</label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nueva contraseña</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Confirmar contraseña</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className="w-full bg-neutral-700 border border-neutral-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 text-error text-sm">
              <AlertCircle className="w-4 h-4" />
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-2 text-success text-sm">
              <CheckCircle className="w-4 h-4" />
              Contraseña actualizada correctamente
            </div>
          )}

          <button
            type="submit"
            disabled={updatePassword.isPending || !passwordActual || !nuevaPassword}
            className="bg-secondary hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {updatePassword.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
}