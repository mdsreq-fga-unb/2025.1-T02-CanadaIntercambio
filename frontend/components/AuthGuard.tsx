import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Aguardar verificação de autenticação

    const isOnLoginPage = pathname === '/login' || pathname === '/cadastro_visitante';

    if (!isAuthenticated && !isOnLoginPage) {
      // Se não autenticado e não está na página de login, vai para login
      console.log('Não autenticado, redirecionando para login');
      router.replace('/login');
    } else if (isAuthenticated && isOnLoginPage) {
      // Se autenticado e está na página de login, vai para programas
      console.log('Autenticado, redirecionando para programas');
      router.replace('/programas');
    }
  }, [isAuthenticated, loading, pathname]);

  return <>{children}</>;
}
