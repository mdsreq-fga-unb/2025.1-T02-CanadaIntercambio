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
  internalRole?: string;
}

export function useRegisterAdminForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [internalRole, setInternalRole] = useState("");
  const [nearestUnitId, setNearestUnitId] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const emailRegex = /^[\w.-]+@canadaintercambio\.com$/i;

    if (!firstName.trim()) newErrors.firstName = "Obrigatório";
    if (!lastName.trim()) newErrors.lastName = "Obrigatório";

    if (!email.trim()) {
      newErrors.email = "Obrigatório";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Use um e-mail corporativo válido";
    }

    if (!password) {
      newErrors.password = "Obrigatório";
    } else if (password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Obrigatório";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    if (!internalRole.trim()) {
      newErrors.internalRole = "Obrigatório";
    }

    if (phone && phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone com DDD obrigatório";
    }

    if (!nearestUnitId || nearestUnitId === 0) {
      newErrors.nearestUnitId = "Selecione uma filial";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => setErrors({});

  const getRegisterData = (): RegisterRequest => ({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    password,
    phone: phone || undefined,
    nearestUnitId,
    internalRole,
    userType: "admin",
  });

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    phone,
    setPhone,
    internalRole,
    setInternalRole,
    nearestUnitId,
    setNearestUnitId,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    validateForm,
    clearErrors,
    getRegisterData,
  };
}
