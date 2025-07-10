import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos baseados no backend
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      userType: 'visitante' | 'intercambista' | 'admin';
    };
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token automaticamente
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Validações do frontend (conforme backend)
  private validateEmail(email: string): string | null {
    if (!email) return 'E-mail é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Formato de e-mail inválido';
    return null;
  }

  private validatePassword(password: string): string | null {
    if (!password) return 'Senha é obrigatória';
    if (password.length < 6) return 'Senha deve ter pelo menos 6 caracteres';
    return null;
  }

  // Validar dados de login
  validateLoginData(email: string, password: string): string | null {
    const emailError = this.validateEmail(email);
    if (emailError) return emailError;

    const passwordError = this.validatePassword(password);
    if (passwordError) return passwordError;

    return null;
  }

  // Fazer login
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        loginData
      );

      if (response.data.success && response.data.data) {
        // Salvar token e dados do usuário
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Erro ao fazer login');
      }
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
  }

  // Fazer logout
  async logout(): Promise<void> {
    try {
      await this.api.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      // Mesmo com erro na API, vamos limpar os dados locais
      console.warn('Erro ao fazer logout na API:', error);
    } finally {
      // Limpar dados locais
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  // Verificar se há token salvo
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      return !!token;
    } catch {
      return false;
    }
  }

  // Obter dados do usuário salvos
  async getCurrentUser(): Promise<any | null> {
    try {
      const userString = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userString ? JSON.parse(userString) : null;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
