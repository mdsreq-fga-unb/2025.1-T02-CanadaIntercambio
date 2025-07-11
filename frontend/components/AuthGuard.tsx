import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Aguardar verificação de autenticação

    // Definir rotas públicas que não precisam de autenticação
    const publicRoutes = [
      '/onboard_inicial',
      '/onboard', 
      '/login',
      '/cadastro_visitante',
      '/cadastro_adm',
      '/cadastro_visitante_new'
    ];

    const isOnPublicPage = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isOnPublicPage) {
      // Se não autenticado e não está em uma página pública, vai para onboard inicial
      console.log('Não autenticado, redirecionando para onboard inicial');
      router.replace('/onboard_inicial');
    } else if (isAuthenticated && (pathname === '/login' || pathname === '/cadastro_visitante' || pathname === '/cadastro_adm')) {
      // Se autenticado e está em uma página de login/cadastro, vai para programas
      console.log('Autenticado, redirecionando para programas');
      router.replace('/programas');
    }
  }, [isAuthenticated, loading, pathname]);

  return <>{children}</>;
}
