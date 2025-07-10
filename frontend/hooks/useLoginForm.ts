import { useState } from 'react';
import { authService } from '../services/authService';

interface ValidationErrors {
  email?: string;
  password?: string;
  general?: string;
}

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const clearErrors = () => {
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validação de email
    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Formato de e-mail inválido';
      }
    }

    // Validação de senha
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrors({});
    setLoading(false);
  };

  return {
    // Estados
    email,
    password,
    errors,
    loading,
    
    // Setters
    setEmail,
    setPassword,
    setLoading,
    
    // Métodos
    validateForm,
    clearErrors,
    resetForm,
    
    // Computed
    isFormValid: email.trim() && password.length >= 6,
  };
};
