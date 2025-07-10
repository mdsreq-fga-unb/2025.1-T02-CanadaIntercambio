import { useState } from 'react';
import { RegisterRequest } from '../services/authService';

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  general?: string;
}

export const useRegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [nearestUnit, setNearestUnit] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const clearErrors = () => {
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validação de nome
    if (!firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    // Validação de sobrenome
    if (!lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

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

    // Validação de confirmação de senha
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    // Validação de telefone (opcional, mas se preenchido deve ter formato válido)
    if (phone && phone.length < 10) {
      newErrors.phone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getRegisterData = (): RegisterRequest => {
    return {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      phone: phone || undefined,
      city: city || undefined,
      nearestUnit: nearestUnit || undefined,
      userType: 'visitante', // Por padrão, cadastra como visitante
    };
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setCity('');
    setNearestUnit('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setLoading(false);
  };

  return {
    // Estados
    firstName,
    lastName,
    email,
    phone,
    city,
    nearestUnit,
    password,
    confirmPassword,
    errors,
    loading,
    
    // Setters
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setCity,
    setNearestUnit,
    setPassword,
    setConfirmPassword,
    setLoading,
    
    // Métodos
    validateForm,
    clearErrors,
    resetForm,
    getRegisterData,
    
    // Computed
    isFormValid: firstName.trim() && lastName.trim() && email.trim() && password.length >= 6 && password === confirmPassword,
  };
};
