import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useRouter, usePathname } from 'expo-router';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { isInLoginProcess, lastLoginAttempt } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Se estamos em processo de login, não redirecionar
    if (isInLoginProcess) return;

    // Se houve uma tentativa de login recente (últimos 5 segundos), não redirecionar
    if (lastLoginAttempt && Date.now() - lastLoginAttempt < 5000) return;

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

    // Nunca redirecionar se estiver na tela de login ou outras rotas públicas
    if (isOnPublicPage) return;

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
  }, [isAuthenticated, loading, pathname, isInLoginProcess, lastLoginAttempt, router]);

  return <>{children}</>;
}
