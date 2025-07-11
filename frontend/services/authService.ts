import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos baseados no backend
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  city?: string;
  nearestUnit?: string;
  userType: 'visitante' | 'intercambista' | 'admin';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  internalRole?: string;
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
      console.log('Tentando login para:', loginData.email);
      
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        loginData
      );

      console.log('Resposta da API:', response.status, response.data);

      if (response.data.success && response.data.data) {
        // Salvar token e dados do usuário
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
        
        console.log('Token e usuário salvos com sucesso');
        return response.data;
      } else {
        // Se a API retornou success: false, lançar erro
        throw new Error(response.data.message || 'Credenciais inválidas');
      }
    } catch (error: any) {
      console.error('Erro no authService.login:', error);
      
      if (error.response) {
        // Erro da API com resposta
        const status = error.response.status;
        const message = error.response.data?.message || 'Erro do servidor';
        
        console.log('Erro da API:', status, message);
        
        if (status === 401) {
          throw new Error('E-mail ou senha incorretos');
        } else if (status === 404) {
          throw new Error('Usuário não encontrado');
        } else if (status === 422) {
          throw new Error(message || 'Dados inválidos');
        } else if (status === 400) {
          throw new Error(message || 'Dados inválidos');
        } else {
          throw new Error(message);
        }
      } else if (error.request) {
        // Erro de rede
        console.log('Erro de rede:', error.request);
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        // Outro tipo de erro ou erro já tratado
        throw new Error(error.message || 'Erro inesperado');
      }
    }
  }

  // Fazer registro
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Tentando registrar usuário:', registerData.email);
      
      const response: AxiosResponse<AuthResponse> = await this.api.post(
        API_CONFIG.ENDPOINTS.REGISTER,
        registerData
      );

      console.log('Resposta da API de registro:', response.status, response.data);

      if (response.data.success && response.data.data) {
        // Salvar token e dados do usuário
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.data.user));
        
        console.log('Token e usuário salvos com sucesso após registro');
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro no authService.register:', error);
      
      if (error.response) {
        // Erro da API com resposta
        const status = error.response.status;
        const message = error.response.data?.message;
        
        console.log('Erro da API de registro:', status, message);
        
        if (status === 400) {
          throw new Error(message || 'Dados de registro inválidos');
        } else if (status === 409) {
          throw new Error('E-mail já está em uso');
        } else if (status === 422) {
          throw new Error(message || 'Dados inválidos');
        } else {
          throw new Error(message || 'Erro do servidor');
        }
      } else if (error.request) {
        // Erro de rede
        console.log('Erro de rede no registro:', error.request);
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        // Outro tipo de erro
        console.log('Erro desconhecido no registro:', error.message);
        throw new Error('Erro inesperado: ' + error.message);
      }
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
