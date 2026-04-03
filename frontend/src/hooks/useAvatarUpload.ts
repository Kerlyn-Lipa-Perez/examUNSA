'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export function useAvatarUpload() {
  const queryClient = useQueryClient();
  const { user, setAuth, token } = useAuthStore();
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await api.post<{ avatarUrl: string }>(
        '/upload/avatar',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      // Actualizar el store con la nueva URL del avatar
      if (user && token) {
        setAuth({ ...user, avatarUrl: data.avatarUrl }, token);
      }
      // Invalidar cache del perfil para refrescar
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      // Limpiar preview
      setPreview(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ message: string }>('/upload/avatar');
      return data;
    },
    onSuccess: () => {
      // Actualizar el store
      if (user && token) {
        setAuth({ ...user, avatarUrl: null }, token);
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    },
  });

  const handleFileSelect = (file: File) => {
    // Validar tipo antes de mostrar preview
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return { error: 'Formato no permitido. Usa JPG, PNG o WebP.' };
    }

    // Validar tamaño
    if (file.size > 5 * 1024 * 1024) {
      return { error: 'El archivo es muy grande. Máximo 5MB.' };
    }

    // Generar preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    return { file };
  };

  const confirmUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  const cancelPreview = () => {
    setPreview(null);
  };

  return {
    preview,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadError: uploadMutation.error?.message,
    deleteError: deleteMutation.error?.message,
    handleFileSelect,
    confirmUpload,
    cancelPreview,
    deleteAvatar: () => deleteMutation.mutate(),
  };
}
