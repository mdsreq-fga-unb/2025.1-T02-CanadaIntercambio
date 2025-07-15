// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'https://canada-intercambio-backend.onrender.com/api',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TIMEOUT: 15000, // 15 segundos para produção
};

// Chaves para AsyncStorage
export const STORAGE_KEYS = {
  TOKEN: '@canadaintercambio:token',
  USER: '@canadaintercambio:user',
};
