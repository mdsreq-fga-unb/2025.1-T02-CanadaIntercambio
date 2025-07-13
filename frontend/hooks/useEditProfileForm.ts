import { useState } from 'react';

export function useEditProfileForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nearestUnit, setNearestUnit] = useState('');

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    nearestUnit?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 11) {
        newErrors.phone = 'Telefone deve ter DDD e número válido';
      } else if (!/^\d{10,11}$/.test(digits)) {
        newErrors.phone = 'Telefone inválido';
      }
    }

    if (!nearestUnit.trim()) {
      newErrors.nearestUnit = 'Unidade mais próxima é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => setErrors({});

  const isFormValid =
  firstName.trim() !== '' &&
  lastName.trim() !== '' &&
  email.trim() !== '' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
  phone.trim().length >= 10 && // Ex: (11) 91234-5678
  nearestUnit.trim() !== '';


  return {
    firstName,
    lastName,
    email,
    phone,
    nearestUnit,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setNearestUnit,
    validateForm,
    clearErrors,
    errors,
    isFormValid
  };
}
