import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { quizService, QuizResult } from "../services/quizService";
import { programService } from "../services/programService";

const loginLogo = require("../assets/images/login_logo.png");

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
    } else {
      // Caso contrário, carregar o resultado mais recente
      loadLatestResult();
    }
  }, [resultId]);

  const loadSpecificResult = async () => {
    try {
      setLoading(true);
      setError(null);

      // Para testes, usar userId padrão se não houver usuário logado
      const userId = user?.id || 1;

      const latestResult = await quizService.getQuizResult(userId);
      setResult(latestResult);
    } catch (err: any) {
      console.error("Erro ao carregar resultado:", err);
      setError("Erro ao carregar resultado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const loadLatestResult = async () => {
    try {
      setLoading(true);
      setError(null);

      // Para testes, usar userId padrão se não houver usuário logado
      const userId = user?.id || 1;

      const latestResult = await quizService.getQuizResult(userId);
      setResult(latestResult);
    } catch (err: any) {
      console.error("Erro ao carregar resultado:", err);
      setError("Nenhum resultado encontrado. Faça o quiz primeiro.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaberMais = () => {
    if (result?.recommendedProgram) {
      // Navegar para a página de detalhes do programa recomendado
      router.push({
        pathname: "/programa-detalhes",
        params: {
          id: result.recommendedProgram.id,
          fromQuiz: "true",
        },
      });
    } else {
      Alert.alert(
        "Programa Recomendado",
        "Não foi possível encontrar detalhes do programa recomendado. Veja todos os programas disponíveis.",
        [
          { text: "Ver Programas", onPress: () => router.push("/programas") },
          { text: "OK" },
        ]
      );
    }
  };

  const handleRefazerQuiz = () => {
    Alert.alert(
      "Refazer Quiz",
      "Você quer refazer o quiz? Isso irá substituir seu resultado atual.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sim, refazer",
          onPress: () => router.push("/quiz"),
        },
      ]
    );
  };

  const handleVerProgramas = () => {
    router.push("/programas");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header} />

        <View style={styles.content}>
          <Text style={styles.welcome}>Resultado do Quiz</Text>

          <Image
            source={require("../assets/images/login_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Carregando resultado...</Text>
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
          <Text style={styles.welcome}>Resultado do Quiz</Text>

          <Image source={loginLogo} style={styles.logo} resizeMode="contain" />

          <View style={styles.errorContainer}>
            <MaterialIcons name="quiz" size={48} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => router.push("/inicio-quiz")}
            >
              <Text style={styles.retryButtonText}>Fazer Quiz</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer} />
      </SafeAreaView>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Resultado do Quiz!</Text>
        </View>

        <View style={styles.resultContainer}>
          {result.recommendedProgram && (
            <>
              <Text style={styles.subtitle}>
                <Text style={styles.highlight}>
                  {result.recommendedProgram.title}
                </Text>{" "}
                {"\n"}é o ideal para você!
              </Text>

              <View style={styles.detailsContainer}>
                <Text style={styles.detailItem}>
                  • Duração:{" "}
                  {programService.formatDuration(
                    result.recommendedProgram.durationWeeks || 0
                  )}
                </Text>
                <Text style={styles.detailItem}>
                  • País: {result.recommendedProgram.country}
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
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleVerProgramas}
            >
              <MaterialIcons name="explore" size={20} color="#DC2626" />
              <Text style={styles.secondaryButtonText}>
                Ver todos os programas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleRefazerQuiz}
            >
              <MaterialIcons name="refresh" size={20} color="#DC2626" />
              <Text style={styles.secondaryButtonText}>Refazer quiz</Text>
            </TouchableOpacity>
          </View>

          {result.completedAt && (
            <Text style={styles.completedText}>
              Quiz realizado em{" "}
              {new Date(result.completedAt).toLocaleDateString("pt-BR")}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    backgroundColor: "#cb2328",
  },
  footer: {
    height: 40,
    backgroundColor: "#cb2328",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#cb2328",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: "80%",
    maxWidth: 300,
    height: 90,
    marginBottom: 30,
  },
  scrollContent: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#DC2626",
    textAlign: "center",
  },
  resultContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  highlight: {
    color: "#DC2626",
    fontWeight: "bold",
  },
  detailsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  detailItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  completedText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#DC2626",
    textAlign: "center",
  },
  resultContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  highlight: {
    color: "#DC2626",
    fontWeight: "bold",
  },
  detailsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  detailItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  secondaryButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  completedText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 8,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 24,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  actionsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "600",
  },
  completedText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#6c757d",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
