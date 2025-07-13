import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Rotas protegidas
    const protectedRoutes = [
      '/programas',
      '/profile',
      '/dashboard',
      '/admin'
    ];
    // Rotas públicas
    const publicRoutes = [
      '/onboard_inicial',
      '/onboard',
      '/login',
      '/cadastro_visitante',
      '/cadastro_adm',
      '/cadastro_visitante_new'
    ];

    const isOnProtectedPage = protectedRoutes.some(route => pathname.startsWith(route));
    const isOnPublicPage = publicRoutes.includes(pathname);

    // Nunca redirecionar se estiver na tela de login
    if (pathname === '/login') return;

    // Se não autenticado e está tentando acessar rota protegida
    if (!isAuthenticated && isOnProtectedPage) {
      router.replace('/onboard_inicial');
    }
    // Se autenticado e está na página de login, redirecionar para programas
    else if (isAuthenticated && pathname === '/login') {
      router.replace('/programas');
    }
    // Se não autenticado e está na página inicial, redirecionar para onboard
    else if (!isAuthenticated && pathname === '/') {
      router.replace('/onboard_inicial');
    }
    // Se autenticado e está na página inicial, redirecionar para programas
    else if (isAuthenticated && pathname === '/') {
      router.replace('/programas');
    }
  }, [isAuthenticated, loading, pathname]);

  return <>{children}</>;
}
