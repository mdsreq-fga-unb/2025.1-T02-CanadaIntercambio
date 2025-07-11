import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { quizService, Quiz, QuizQuestion, QuizAnswer, QuizResult } from '../services/quizService';

const loginLogo = require("../assets/images/login_logo.png");

interface QuizScreenProps {
  quizType?: string;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ quizType = 'PERFIL' }) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
    loadSavedProgress();
  }, []);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const quizData = await quizService.getQuiz(quizType);
      setQuiz(quizData);
    } catch (err: any) {
      console.error('Erro ao carregar quiz:', err);
      setError('Erro ao carregar quiz. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProgress = async () => {
    try {
      const progress = await quizService.loadProgress();
      if (progress && progress.quizId) {
        setCurrentStep(progress.currentStep);
        setAnswers(progress.answers);
      }
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
    }
  };

  const saveProgress = async () => {
    if (quiz) {
      try {
        await quizService.saveProgress(quiz.id, currentStep, answers);
      } catch (err) {
        console.error('Erro ao salvar progresso:', err);
      }
    }
  };

  const handleAnswer = (questionId: number, selectedOption: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    const newAnswer: QuizAnswer = {
      questionId,
      selectedOption
    };

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = newAnswer;
    } else {
      newAnswers.push(newAnswer);
    }

    setAnswers(newAnswers);
    saveProgress();
  };

  const handleNext = () => {
    if (!quiz) return;

    const currentQuestion = quiz.questions[currentStep];
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

    // Validar resposta obrigatória
    if (currentQuestion.isRequired && !quizService.validateAnswer(currentQuestion, currentAnswer || {} as QuizAnswer)) {
      Alert.alert('Atenção', 'Por favor, responda à pergunta antes de continuar.');
      return;
    }

    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
      saveProgress();
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      saveProgress();
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !user) return;

    try {
      setSubmitting(true);
      const result = await quizService.submitQuiz(quiz.id, user.id, answers);
      
      // Limpar progresso salvo
      await quizService.clearProgress();
      
      // Navegar para resultado
      router.push({
        pathname: '/resultado-quiz',
        params: { resultId: result.id }
      });
    } catch (err: any) {
      console.error('Erro ao submeter quiz:', err);
      Alert.alert('Erro', 'Erro ao salvar respostas. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderProgressBar = () => {
    if (!quiz) return null;

    const progress = quizService.calculateProgress(currentStep + 1, quiz.questions.length);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} de {quiz.questions.length}
        </Text>
      </View>
    );
  };

  const renderQuestion = (question: QuizQuestion) => {
    const currentAnswer = answers.find(a => a.questionId === question.id);

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                currentAnswer?.selectedOption === option && styles.selectedOption
              ]}
              onPress={() => handleAnswer(question.id, option)}
            >
              <Text style={[
                styles.optionText,
                currentAnswer?.selectedOption === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderNavigationButtons = () => {
    if (!quiz) return null;

    const isLastStep = currentStep === quiz.questions.length - 1;
    const currentQuestion = quiz.questions[currentStep];
    const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
    const hasAnswer = currentAnswer && quizService.validateAnswer(currentQuestion, currentAnswer);

    return (
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          <MaterialIcons name="arrow-back" size={24} color={currentStep === 0 ? '#ccc' : '#DC2626'} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
            Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, styles.nextButton, !hasAnswer && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!hasAnswer || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={[styles.navButtonText, styles.nextButtonText]}>
                {isLastStep ? 'Finalizar' : 'Próxima'}
              </Text>
              <MaterialIcons name={isLastStep ? 'check' : 'arrow-forward'} size={24} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header} />
        
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#cb2328" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={styles.welcome}>Quiz</Text>
          
          <Image
            source={loginLogo}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Carregando quiz...</Text>
          </View>
        </View>
        
        <View style={styles.footer} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header} />
        
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#cb2328" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={styles.welcome}>Quiz</Text>
          
          <Image
            source={loginLogo}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={48} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadQuiz}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer} />
      </SafeAreaView>
    );
  }

  if (!quiz) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#cb2328" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Quiz</Text>
        </View>
        
        {renderProgressBar()}
        
        {renderQuestion(quiz.questions[currentStep])}
      </ScrollView>

      {renderNavigationButtons()}
      
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#cb2328',
  },
  footer: {
    height: 40,
    backgroundColor: '#cb2328',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cb2328',
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
    width: '80%',
    maxWidth: 300,
    height: 90,
    marginBottom: 30,
  },
  scrollContent: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#cb2328',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#cb2328',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#6c757d',
  },
  questionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 400,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#DC2626',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
  },
  selectedOptionText: {
    color: '#fff',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  nextButton: {
    backgroundColor: '#DC2626',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  nextButtonText: {
    color: '#fff',
  },
  navButtonTextDisabled: {
    color: '#ccc',
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

export default QuizScreen;
