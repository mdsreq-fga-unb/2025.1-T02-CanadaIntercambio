import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { quizService, QuizResult } from '../services/quizService';
import { programService } from '../services/programService';

export default function ResultadoQuiz() {
  const { resultId } = useLocalSearchParams();
  const { user } = useAuth();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resultId) {
      // Se há um resultId específico, carregar esse resultado
      loadSpecificResult();
    } else if (user) {
      // Caso contrário, carregar o resultado mais recente do usuário
      loadLatestResult();
    }
  }, [resultId, user]);

  const loadSpecificResult = async () => {
    try {
      setLoading(true);
      setError(null);
      // Por enquanto, vamos carregar o resultado mais recente
      // TODO: Implementar busca por ID específico quando a API estiver pronta
      if (user) {
        const latestResult = await quizService.getQuizResult(user.id);
        setResult(latestResult);
      }
    } catch (err: any) {
      console.error('Erro ao carregar resultado:', err);
      setError('Erro ao carregar resultado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadLatestResult = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user) {
        const latestResult = await quizService.getQuizResult(user.id);
        setResult(latestResult);
      }
    } catch (err: any) {
      console.error('Erro ao carregar resultado:', err);
      setError('Nenhum resultado encontrado. Faça o quiz primeiro.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaberMais = () => {
    if (result?.recommendedProgram) {
      Alert.alert(
        result.recommendedProgram.title,
        `${result.recommendedProgram.description}\n\n` +
        `Preço: ${programService.formatPrice(result.recommendedProgram.price)}\n` +
        `Duração: ${programService.formatDuration(result.recommendedProgram.durationWeeks || 0)}\n` +
        `País: ${result.recommendedProgram.country}\n\n` +
        `Foco: ${result.recommendedProgram.focus}\n` +
        `Método: ${result.recommendedProgram.method}`,
        [
          {
            text: 'Ver todos os programas',
            onPress: () => router.push('/programas')
          },
          { text: 'OK' }
        ]
      );
    }
  };

  const handleRefazerQuiz = () => {
    Alert.alert(
      'Refazer Quiz',
      'Você quer refazer o quiz? Isso irá substituir seu resultado atual.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sim, refazer',
          onPress: () => router.push('/quiz')
        }
      ]
    );
  };

  const handleVerProgramas = () => {
    router.push('/programas');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder} />
          <Text style={styles.headerText}>
            Canada <Text style={styles.headerLight}>Intercâmbio</Text>
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Carregando resultado...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder} />
          <Text style={styles.headerText}>
            Canada <Text style={styles.headerLight}>Intercâmbio</Text>
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <MaterialIcons name="quiz" size={48} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.push('/inicio-quiz')}>
            <Text style={styles.retryButtonText}>Fazer Quiz</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder} />
        <Text style={styles.headerText}>
          Canada <Text style={styles.headerLight}>Intercâmbio</Text>
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resultContainer}>
          <Text style={styles.title}>Resultado do Quiz!</Text>

          {result.recommendedProgram && (
            <>
              <Text style={styles.subtitle}>
                <Text style={styles.highlight}>{result.recommendedProgram.title}</Text> {'\n'}
                é o ideal para você!
              </Text>

              <View style={styles.detailsContainer}>
                <Text style={styles.detailItem}>
                  • Duração: {programService.formatDuration(result.recommendedProgram.durationWeeks || 0)}
                </Text>
                <Text style={styles.detailItem}>
                  • País: {result.recommendedProgram.country}
                </Text>
                <Text style={styles.detailItem}>
                  • Preço: {programService.formatPrice(result.recommendedProgram.price)}
                </Text>
                {result.recommendedProgram.focus && (
                  <Text style={styles.detailItem}>
                    • Foco: {result.recommendedProgram.focus}
                  </Text>
                )}
                {result.recommendedProgram.languageLevel && (
                  <Text style={styles.detailItem}>
                    • Nível: {result.recommendedProgram.languageLevel}
                  </Text>
                )}
              </View>

              <TouchableOpacity style={styles.button} onPress={handleSaberMais}>
                <Text style={styles.buttonText}>Saber mais sobre esse</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleVerProgramas}>
              <MaterialIcons name="explore" size={20} color="#DC2626" />
              <Text style={styles.secondaryButtonText}>Ver todos os programas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleRefazerQuiz}>
              <MaterialIcons name="refresh" size={20} color="#DC2626" />
              <Text style={styles.secondaryButtonText}>Refazer quiz</Text>
            </TouchableOpacity>
          </View>

          {result.completedAt && (
            <Text style={styles.completedText}>
              Quiz realizado em {new Date(result.completedAt).toLocaleDateString('pt-BR')}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#DC2626',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 40,
  },
  headerLight: {
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  resultContainer: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
  },
  highlight: {
    color: '#DC2626',
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  detailItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
  completedText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
