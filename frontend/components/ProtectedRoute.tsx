import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Lista de rotas públicas que não devem ser redirecionadas
      const publicRoutes = [
        '/onboard_inicial',
        '/onboard',
        '/login',
        '/cadastro_visitante',
        '/cadastro_adm',
        '/cadastro_visitante_new'
      ];

      // Só redirecionar se não estiver em uma rota pública
      if (!publicRoutes.includes(pathname)) {
        router.replace('/onboard_inicial');
      }
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CC2027" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null; // Ou uma tela de loading personalizada
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
