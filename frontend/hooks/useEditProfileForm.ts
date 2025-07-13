import { useState, useEffect } from "react";

export function useEditProfileForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nearestUnitId, setNearestUnitId] = useState(0);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    nearestUnitId?: string;
  }>({});

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneDigits = phone.replace(/\D/g, "");

    setIsFormValid(
      firstName.trim() !== "" &&
        lastName.trim() !== "" &&
        email.trim() !== "" &&
        emailValid &&
        phoneDigits.length >= 10 &&
        nearestUnitId !== 0
    );
  }, [firstName, lastName, email, phone, nearestUnitId]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Nome é obrigatório";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 11) {
        newErrors.phone = "Telefone deve ter DDD e número válido";
      }
    }

    if (!nearestUnitId || nearestUnitId === 0) {
      newErrors.nearestUnitId = "Unidade mais próxima é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => setErrors({});

  return {
    firstName,
    lastName,
    email,
    phone,
    nearestUnitId,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setNearestUnitId,
    validateForm,
    clearErrors,
    errors,
    isFormValid,
  };
}
