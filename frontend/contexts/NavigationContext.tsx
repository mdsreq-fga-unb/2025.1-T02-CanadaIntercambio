import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextData {
  isInLoginProcess: boolean;
  setIsInLoginProcess: (value: boolean) => void;
  lastLoginAttempt: number | null;
  setLastLoginAttempt: (timestamp: number | null) => void;
}

const NavigationContext = createContext<NavigationContextData>({} as NavigationContextData);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isInLoginProcess, setIsInLoginProcess] = useState(false);
  const [lastLoginAttempt, setLastLoginAttempt] = useState<number | null>(null);

  const value: NavigationContextData = {
    isInLoginProcess,
    setIsInLoginProcess,
    lastLoginAttempt,
    setLastLoginAttempt,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextData => {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error('useNavigation deve ser usado dentro de um NavigationProvider');
  }
  
  return context;
};
