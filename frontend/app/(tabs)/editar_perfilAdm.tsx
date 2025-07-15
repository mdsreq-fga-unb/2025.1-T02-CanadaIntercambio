import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";
import { useAuth } from "../../contexts/AuthContext";
import { profileService } from "../../services/profileService";
import { unitService } from "../../services/unitService";
import { TextInputMask } from "react-native-masked-text";
import { useEditProfileForm } from "../../hooks/useEditProfileForm";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function EditarPerfilScreen() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);

  const {
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
  } = useEditProfileForm();

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  useEffect(() => {
    if (!authLoading) {
      loadProfile();
      loadUnits();
    }
  }, [authLoading]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProfile();
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setNearestUnitId(profile.nearestUnitId || 0);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      showToast("Erro ao carregar perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await unitService.getAll();
      setUnits(response);
    } catch (err) {
      console.error("Erro ao carregar unidades:", err);
      showToast("Erro ao carregar unidades", "error");
    }
  };

  const handleSave = async () => {
    clearErrors();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await profileService.updateProfile({
        firstName,
        lastName,
        email,
        phone,
        nearestUnitId,
      });
      showToast("Perfil atualizado com sucesso!", "success");
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      showToast(err.message || "Erro ao salvar perfil", "error");
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/perfil_principal")}
        >
          <MaterialIcons name="arrow-back" size={24} color="#cb2328" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Atualize suas informações:</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <Input
            placeholder="Nome"
            value={firstName}
            onChangeText={setFirstName}
            editable={!loading}
            error={errors.firstName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sobrenome</Text>
          <Input
            placeholder="Sobrenome"
            value={lastName}
            onChangeText={setLastName}
            editable={!loading}
            error={errors.lastName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <Input
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            error={errors.email}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInputMask
            type={"cel-phone"}
            options={{ maskType: "BRL", withDDD: true, dddMask: "(99) " }}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholder="(99) 99999-9999"
            keyboardType="phone-pad"
            editable={!loading}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unidade mais próxima</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={nearestUnitId}
              onValueChange={(itemValue) => setNearestUnitId(Number(itemValue))}
              enabled={!loading}
              style={styles.picker}
            >
              <Picker.Item label="Selecione a unidade mais próxima" value={0} />
              {units.map((unit) => (
                <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
              ))}
            </Picker>
          </View>
          {errors.nearestUnitId && (
            <Text style={styles.errorText}>{errors.nearestUnitId}</Text>
          )}
        </View>

        <Button
          title={loading ? "Salvando..." : "Salvar"}
          onPress={handleSave}
          loading={loading}
          disabled={loading || !isFormValid}
          style={styles.button}
        />
      </ScrollView>

      <View style={styles.footer} />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
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
  content: { alignItems: "center", padding: 20, flexGrow: 1 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#cb2328",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#cb2328",
    marginBottom: 20,
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
  pickerContainer: {
    width: "100%",
  },
  picker: {width: "100%",
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
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  button: { width: "100%", maxWidth: 350, marginTop: 20 },
});
