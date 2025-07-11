import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Aguardar verificação de autenticação
    
    if (!isAuthenticated) {
      // Se não autenticado, redirecionar para onboard inicial
      router.replace('/onboard_inicial');
    } else {
      // Se autenticado, redirecionar para programas
      router.replace('/programas');
    }
  }, [isAuthenticated, loading]);

  // Tela de loading enquanto verifica autenticação
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#cb2328" />
      <Text style={styles.loadingText}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#cb2328',
  },
});
