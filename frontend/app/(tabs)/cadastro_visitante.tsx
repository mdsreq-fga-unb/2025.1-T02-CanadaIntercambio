import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { TextInputMask } from "react-native-masked-text";
import { Unit, unitService } from "@/services/unitService";

export default function CadastroVisitante() {
  const { register } = useAuth();
  const {
    firstName,
    lastName,
    email,
    phone,
    nearestUnitId,
    password,
    confirmPassword,
    errors,
    loading,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setNearestUnitId,
    setPassword,
    setConfirmPassword,
    setLoading,
    validateForm,
    clearErrors,
    getRegisterData,
  } = useRegisterForm();

  const [aceito, setAceito] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const data = await unitService.getAll();
        setUnits(data);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar as unidades.");
      }
    };

    loadUnits();
  }, []);

  const handleRegister = async () => {
    clearErrors();

    if (!aceito) {
      Alert.alert(
        "Erro",
        "Você deve aceitar os termos e condições para continuar."
      );
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      await register(getRegisterData());

      // Redireciona imediatamente para o quiz
      router.replace("/quiz");
      Alert.alert("Sucesso!", "Cadastro realizado com sucesso! Bem-vindo!");
    } catch (error: any) {
      let errorMsg = "Erro inesperado. Tente novamente.";
      if (
        error?.message?.toLowerCase().includes("email") &&
        error?.message?.toLowerCase().includes("exist")
      ) {
        errorMsg =
          "Este e-mail já está cadastrado. Tente fazer login ou utilize outro e-mail.";
      }
      Alert.alert("Erro no Cadastro", errorMsg, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/login_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Preencha os dados abaixo:</Text>

        <Input
          placeholder="Nome"
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
          editable={!loading}
        />
        <Input
          placeholder="Sobrenome"
          value={lastName}
          onChangeText={setLastName}
          error={errors.lastName}
          editable={!loading}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <View style={styles.TextInputMaskContainer}>
          <TextInputMask
            type={"cel-phone"}
            options={{ maskType: "BRL", withDDD: true, dddMask: "(99) " }}
            value={phone}
            onChangeText={setPhone}
            style={styles.TextInputmask}
            placeholder="Telefone"
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={nearestUnitId}
            onValueChange={(value) => setNearestUnitId(Number(value))}
            style={styles.picker}
            enabled={!loading}
          >
            <Picker.Item label="Selecione a unidade mais próxima" value={0} />
            {units.map((unit) => (
              <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
            ))}
          </Picker>
        </View>

        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          editable={!loading}
        />
        <Input
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={aceito ? "checked" : "unchecked"}
            onPress={() => setAceito(!aceito)}
            disabled={loading}
          />
          <Text style={styles.checkboxText}>
            Eu li e concordo com as{" "}
            <Text style={styles.link}>políticas de privacidade</Text>.
          </Text>
        </View>

        <Button
          title={loading ? "Criando..." : "Criar Conta"}
          onPress={handleRegister}
          loading={loading}
          disabled={loading || !aceito}
          style={styles.button}
        />
      </ScrollView>
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 70,
    backgroundColor: "#cb2328",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 250, height: 60, marginTop: 10 },
  footer: { height: 40, backgroundColor: "#cb2328", marginTop: "auto" },
  content: {
    alignItems: "center",
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#cb2328",
    marginVertical: 20,
    textAlign: "center",
  },
  inputContainer: { width: "100%", maxWidth: 350, marginBottom: 15 },
  label: { fontSize: 14, color: "#333", marginBottom: 5 },
  input: {
    height: 48,
    borderColor: "#dee2e6",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  TextInputMaskContainer: {
    width: "100%",
  },
  TextInputmask: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "#f8f9fa",
    color: "#888888",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    justifyContent: "center",
    marginBottom: 15,
    height: 48,
  },
  pickerContainer: {
    width: "100%",
  },
  picker: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: "#f8f9fa",
    color: "#888888",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 14,
    justifyContent: "center",
    marginBottom: 15,
    height: 48,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    maxWidth: 350,
  },
  checkboxText: { flex: 1, fontSize: 12, color: "#333", marginLeft: 8 },
  link: { color: "#cb2328", textDecorationLine: "underline" },
  button: { width: "100%", maxWidth: 350, marginVertical: 20 },
});
