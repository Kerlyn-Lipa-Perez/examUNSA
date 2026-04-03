'use client';

import { useRef } from 'react';
import { UserProfile } from '@/types/perfil';
import { getInitials } from '@/store/authStore';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { Mail, Calendar, Crown, Camera, X, Check, Trash2, Loader2 } from 'lucide-react';

interface UserProfileHeaderProps {
  profile: UserProfile | undefined;
  isLoading: boolean;
}

export function UserProfileHeader({ profile, isLoading }: UserProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);
  const {
    preview,
    isUploading,
    isDeleting,
    handleFileSelect,
    confirmUpload,
    cancelPreview,
    deleteAvatar,
  } = useAvatarUpload();

  if (isLoading || !profile) {
    return (
      <div className="flex flex-col items-center py-8 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-neutral-700" />
        <div className="h-8 w-48 bg-neutral-700 rounded mt-4" />
        <div className="h-5 w-64 bg-neutral-700 rounded mt-2" />
      </div>
    );
  }

  const initials = getInitials(profile.nombre);
  const fechaRegistro = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'N/A';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = handleFileSelect(file);
    if (result.error) {
      alert(result.error);
      return;
    }
    if (result.file) {
      pendingFileRef.current = result.file;
    }

    // Reset input para permitir seleccionar el mismo archivo otra vez
    e.target.value = '';
  };

  const handleConfirm = () => {
    if (pendingFileRef.current) {
      confirmUpload(pendingFileRef.current);
      pendingFileRef.current = null;
    }
  };

  const handleCancel = () => {
    cancelPreview();
    pendingFileRef.current = null;
  };

  return (
    <div className="flex flex-col items-center py-8">
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Avatar */}
      <div className="relative group">
        {preview ? (
          /* Preview antes de subir */
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/50"
            />
            {/* Botones de confirmar/cancelar */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                onClick={handleConfirm}
                disabled={isUploading}
                className="w-8 h-8 rounded-full bg-success flex items-center justify-center hover:bg-green-500 transition-colors disabled:opacity-50"
                title="Confirmar"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Check className="w-4 h-4 text-white" />
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="w-8 h-8 rounded-full bg-error flex items-center justify-center hover:bg-red-500 transition-colors disabled:opacity-50"
                title="Cancelar"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : (
          /* Avatar normal (foto o iniciales) */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 hover:border-primary transition-colors"
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary flex items-center justify-center">
                <span className="text-neutral-900 text-3xl font-bold">{initials}</span>
              </div>
            )}
            {/* Overlay con cámara al hover */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            {/* Loading overlay durante upload */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botón eliminar foto (solo si tiene avatar y no está en preview) */}
      {profile.avatarUrl && !preview && (
        <button
          onClick={deleteAvatar}
          disabled={isDeleting}
          className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-error transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isDeleting ? 'Eliminando...' : 'Eliminar foto'}
        </button>
      )}

      {/* Hint para subir foto (solo si no tiene avatar y no está en preview) */}
      {!profile.avatarUrl && !preview && (
        <p className="mt-2 text-xs text-gray-600">
          Click para subir una foto
        </p>
      )}

      {/* Nombre */}
      <h1 className="text-3xl font-bold text-white mt-4">{profile.nombre}</h1>

      {/* Email */}
      <div className="flex items-center gap-2 text-gray-400 mt-2">
        <Mail className="w-4 h-4" />
        <span className="text-sm">{profile.email}</span>
      </div>

      {/* Plan Badge */}
      <div className="mt-4">
        {profile.plan === 'pro' ? (
          <span className="inline-flex items-center gap-2 bg-primary text-neutral-900 px-4 py-1.5 rounded-full font-bold text-sm">
            <Crown className="w-4 h-4" />
            Plan Pro
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-1.5 rounded-full font-bold text-sm">
            Plan Free
          </span>
        )}
      </div>

      {/* Fecha de registro */}
      <div className="flex items-center gap-2 text-gray-500 mt-3">
        <Calendar className="w-4 h-4" />
        <span className="text-xs">Miembro desde {fechaRegistro}</span>
      </div>
    </div>
  );
}
