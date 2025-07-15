import axios, { AxiosInstance } from "axios";
import { API_CONFIG, STORAGE_KEYS } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipos para Quiz
export interface QuizQuestion {
  id: number;
  question: string;
  questionType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TEXT" | "SCALE";
  options: string[];
  isRequired: boolean;
  order: number;
}

export interface Quiz {
  id: number;
  title: string;
  type: "PERFIL" | "SIMULACAO" | "TESTE";
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionId: number;
  selectedOption?: string;
  selectedOptions?: string[];
  textAnswer?: string;
  scaleValue?: number;
}

export interface QuizResult {
  id: number;
  quiz: Quiz;
  resultData: any;
  recommendedProgram?: any;
  completedAt: string;
  score: number;
}

export interface QuizResponse {
  success: boolean;
  data: Quiz;
  message?: string;
}

export interface QuizResultResponse {
  success: boolean;
  data: QuizResult;
  message?: string;
}

class QuizService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Buscar quiz por tipo
  async getQuiz(type: string): Promise<Quiz> {
    try {
      const response = await this.api.get<QuizResponse>(`/quiz/${type}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Erro ao buscar quiz");
      }
    } catch (error: any) {
      console.error("Erro ao buscar quiz:", error);
      throw new Error("Erro ao carregar quiz. Tente novamente.");
    }
  }

  // Buscar perguntas do quiz
  async getQuizQuestions(type: string): Promise<Quiz> {
    try {
      const response = await this.api.get<QuizResponse>(
        `/quiz/${type}/questions`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Erro ao buscar perguntas");
      }
    } catch (error: any) {
      console.error("Erro ao buscar perguntas:", error);
      throw new Error("Erro ao carregar perguntas. Tente novamente.");
    }
  }

  // Submeter respostas do quiz
  async submitQuiz(
    quizId: number,
    userId: number,
    answers: QuizAnswer[]
  ): Promise<QuizResult> {
    try {
      const response = await this.api.post<QuizResultResponse>("/quiz/submit", {
        quizId,
        userId,
        answers,
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Erro ao submeter quiz");
      }
    } catch (error: any) {
      console.error("Erro ao submeter quiz:", error);
      throw new Error("Erro ao salvar respostas. Tente novamente.");
    }
  }

  async submit(
    quizId: number,
    userId: number,
    answers: QuizAnswer[]
  ): Promise<QuizResult> {
    try {
      const response = await this.api.post<QuizResultResponse>("/quiz/submit", {
        quizId,
        userId,
        answers,
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Erro ao submeter quiz");
      }
    } catch (error: any) {
      console.error("Erro ao submeter quiz:", error);
      throw new Error("Erro ao salvar respostas. Tente novamente.");
    }
  }

  // Buscar resultado do quiz
  async getQuizResult(userId: number): Promise<QuizResult> {
    try {
      const response = await this.api.get<QuizResultResponse>(
        `/quiz/result/${userId}`
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Resultado não encontrado");
      }
    } catch (error: any) {
      console.error("Erro ao buscar resultado:", error);
      throw new Error("Erro ao carregar resultado. Tente novamente.");
    }
  }

  // Buscar histórico de quizzes
  async getQuizHistory(userId: number): Promise<QuizResult[]> {
    try {
      const response = await this.api.get<{
        success: boolean;
        data: QuizResult[];
      }>(`/quiz/history/${userId}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Erro ao buscar histórico");
      }
    } catch (error: any) {
      console.error("Erro ao buscar histórico:", error);
      throw new Error("Erro ao carregar histórico. Tente novamente.");
    }
  }

  // Salvar progresso localmente
  async saveProgress(
    quizId: number,
    currentStep: number,
    answers: QuizAnswer[],
    quizType: string
  ): Promise<void> {
    try {
      const key = `quizProgress_${quizType}`;
      const progressData = {
        quizId,
        currentStep,
        answers,
        timestamp: new Date().toISOString(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(progressData));
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }
  }

  // Carregar progresso salvo
  async loadProgress(quizType: string): Promise<{
    quizId: number;
    currentStep: number;
    answers: QuizAnswer[];
  } | null> {
    try {
      const key = `quizProgress_${quizType}`;
      const progressData = await AsyncStorage.getItem(key);
      if (progressData) {
        return JSON.parse(progressData);
      }
      return null;
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
      return null;
    }
  }

  // Limpar progresso salvo
  async clearProgress(quizType: string): Promise<void> {
    try {
      const key = `quizProgress_${quizType}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Erro ao limpar progresso:", error);
    }
  }

  // Validar resposta obrigatória
  validateAnswer(question: QuizQuestion, answer: QuizAnswer): boolean {
    if (!question.isRequired) return true;

    switch (question.questionType) {
      case "SINGLE_CHOICE":
        return !!answer.selectedOption;
      case "MULTIPLE_CHOICE":
        return !!(answer.selectedOptions && answer.selectedOptions.length > 0);
      case "TEXT":
        return !!(answer.textAnswer && answer.textAnswer.trim());
      case "SCALE":
        return answer.scaleValue !== undefined && answer.scaleValue !== null;
      default:
        return false;
    }
  }

  // Calcular progresso
  calculateProgress(currentStep: number, totalSteps: number): number {
    return Math.round((currentStep / totalSteps) * 100);
  }
}

export const quizService = new QuizService();
