import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, LoginRequest, RegisterRequest } from '../services/authService';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: 'visitante' | 'intercambista' | 'admin';
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (registerData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      setLoading(true);
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        const storedUser = await authService.getCurrentUser();
        setUser(storedUser);
      }
    } catch (error) {
      console.warn('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        console.log('Login realizado com sucesso:', response.data.user.email);
      } else {
        throw new Error(response.message || 'Erro ao fazer login');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      // Melhorar as mensagens de erro
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('E-mail ou senha incorretos');
      } else if (error.message.includes('404')) {
        throw new Error('Usuário não encontrado');
      } else if (error.message.includes('connection') || error.message.includes('network')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: RegisterRequest) => {
    try {
      setLoading(true);
      const response = await authService.register(registerData);
      
      if (response.success && response.data) {
        setUser(response.data.user);
        console.log('Registro realizado com sucesso:', response.data.user.email);
      } else {
        throw new Error(response.message || 'Erro ao fazer registro');
      }
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      // Melhorar as mensagens de erro
      if (error.message.includes('409') || error.message.includes('E-mail já está em uso')) {
        throw new Error('E-mail já está em uso');
      } else if (error.message.includes('400') || error.message.includes('inválidos')) {
        throw new Error('Dados inválidos. Verifique as informações.');
      } else if (error.message.includes('connection') || error.message.includes('network')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      } else {
        throw new Error(error.message || 'Erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.warn('Erro ao fazer logout:', error);
      // Mesmo com erro, limpa o estado local
      setUser(null);
    }
  };

  const value: AuthContextData = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
