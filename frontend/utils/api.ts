import axios from 'axios';
import { router } from 'expo-router'; // <--- LINHA ADICIONADA

// Definir a URL base do backend aqui
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081'; 

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
} );

// Interceptor para adicionar o token de autenticação a cada requisição
api.interceptors.request.use(
  async (config) => {
    // Importar AsyncStorage dinamicamente para evitar problemas de ambiente
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de resposta (ex: token expirado)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Exemplo: se o token expirou e a requisição original não foi uma tentativa de refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.error('Token expirado ou não autorizado. Redirecionando para login...');
      router.replace('/login'); 
    }
    return Promise.reject(error);
  }
);
