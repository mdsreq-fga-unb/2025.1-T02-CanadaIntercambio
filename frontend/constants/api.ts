// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  TIMEOUT: 10000, // 10 segundos
};

// Chaves para AsyncStorage
export const STORAGE_KEYS = {
  TOKEN: '@canadaintercambio:token',
  USER: '@canadaintercambio:user',
};
