import { useState } from "react";
import { RegisterRequest } from "../services/authService";

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  nearestUnitId?: string;
  general?: string;
}

export const useRegisterForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [nearestUnitId, setNearestUnitId] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const clearErrors = () => {
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!firstName.trim()) newErrors.firstName = "Nome é obrigatório";
    if (!lastName.trim()) newErrors.lastName = "Sobrenome é obrigatório";

    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        newErrors.email = "Formato de e-mail inválido";
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (phone && phone.length < 10) {
      newErrors.phone = "Telefone deve ter pelo menos 10 dígitos";
    }

    if (!nearestUnitId || nearestUnitId === 0) {
      newErrors.nearestUnitId = "Selecione uma unidade";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getRegisterData = (): RegisterRequest => ({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password,
    phone: phone || undefined,
    city: city || undefined,
    nearestUnitId,
    userType: "visitante",
  });

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCity("");
    setNearestUnitId(0);
    setPassword("");
    setConfirmPassword("");
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
    nearestUnitId,
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
    setNearestUnitId,
    setPassword,
    setConfirmPassword,
    setLoading,

    // Métodos
    validateForm,
    clearErrors,
    resetForm,
    getRegisterData,

    // Computed
    isFormValid:
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      password.length >= 6 &&
      password === confirmPassword &&
      nearestUnitId > 0,
  };
};
