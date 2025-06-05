'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useUserStore } from '@/lib/client-only/stores/userStore';
import { logout as logoutAction } from '@/lib/server-only/users/users.actions';

export function useAuth() {
  const router = useRouter();
  const { user, isLoading, error, setUser, setLoading, setError, clearUser } = useUserStore();

  useEffect(() => {
    // Verificar si hay un usuario en el store
    if (!user && !isLoading) {
      setLoading(true);
      // Aquí podrías hacer una llamada al backend para verificar la sesión
      // y actualizar el store si es necesario
      setLoading(false);
    }
  }, [user, isLoading, setLoading]);

  const logout = async () => {
    try {
      setLoading(true);
      await logoutAction();
      clearUser();
      router.push('/login');
    } catch (err) {
      setError('Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
  };
}
