import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, LoginRequest } from '../services/authService';

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
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Erro ao fazer login');
      }
    } catch (error) {
      throw error; // Repassa o erro para o componente
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
