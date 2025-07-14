import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Toast } from "../../components/Toast";
import { useAuth } from "../../contexts/AuthContext";
import { adminService } from "../../services/adminService";
import { unitService } from "../../services/unitService";
import { TextInputMask } from "react-native-masked-text";
import { router, useLocalSearchParams } from "expo-router";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  nearestUnitId: number;
  visitante?: { id: number };
  intercambista?: { id: number };
  admin?: { id: number };
  nearestUnit?: {
    id: number;
    name: string;
  };
}

export default function AdminEditarPerfilScreen() {
  const { user } = useAuth();
  const { userId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [units, setUnits] = useState<{ id: number; name: string }[]>([]);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [nearestUnitId, setNearestUnitId] = useState<number>(0);

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

  // Verificar se o usuário é admin
  useEffect(() => {
    if (user && !user.admin) {
      Alert.alert("Acesso Negado", "Você não tem permissão para acessar esta área.");
      router.back();
    }
  }, [user]);

  // Carregar dados do usuário e unidades
  useEffect(() => {
    if (userId) {
      loadUserProfile();
      loadUnits();
    }
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserProfile(Number(userId));
      if (response.success) {
        const profile = response.data;
        setUserProfile(profile);
        setFirstName(profile.firstName || "");
        setLastName(profile.lastName || "");
        setEmail(profile.email || "");
        setPhone(profile.phone || "");
        setCity(profile.city || "");
        setNearestUnitId(profile.nearestUnitId || 0);
      } else {
        showToast("Erro ao carregar perfil do usuário", "error");
        router.back();
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      showToast("Erro ao carregar perfil do usuário", "error");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await unitService.getUnits();
      if (response.success) {
        setUnits(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  };

  const getUserType = (profile: UserProfile): string => {
    if (profile.admin) return "Administrador";
    if (profile.intercambista) return "Intercambista";
    if (profile.visitante) return "Visitante";
    return "Não definido";
  };

  const getUserTypeColor = (profile: UserProfile): string => {
    if (profile.admin) return "#e74c3c";
    if (profile.intercambista) return "#3498db";
    if (profile.visitante) return "#2ecc71";
    return "#95a5a6";
  };

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      showToast("Nome é obrigatório", "error");
      return false;
    }
    if (!lastName.trim()) {
      showToast("Sobrenome é obrigatório", "error");
      return false;
    }
    if (!email.trim()) {
      showToast("Email é obrigatório", "error");
      return false;
    }
    if (!email.includes("@")) {
      showToast("Email inválido", "error");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const updateData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        nearestUnitId: nearestUnitId || undefined,
      };

      const response = await adminService.updateUserProfile(Number(userId), updateData);
      
      if (response.success) {
        showToast("Perfil atualizado com sucesso!", "success");
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        showToast(response.message || "Erro ao atualizar perfil", "error");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      showToast("Erro ao atualizar perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuário não encontrado</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Perfil do Usuário</Text>
      
      <View style={styles.userInfoCard}>
        <Text style={styles.userInfoTitle}>Informações do Usuário</Text>
        <Text style={styles.userInfoText}>ID: {userProfile.id}</Text>
        <Text style={styles.userInfoText}>Email: {userProfile.email}</Text>
        <View style={styles.userTypeContainer}>
          <Text style={styles.userInfoText}>Tipo: </Text>
          <View
            style={[
              styles.userTypeBadge,
              { backgroundColor: getUserTypeColor(userProfile) },
            ]}
          >
            <Text style={styles.userTypeText}>{getUserType(userProfile)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.form}>
        <Input
          label="Nome"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Digite o nome"
          required
        />

        <Input
          label="Sobrenome"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Digite o sobrenome"
          required
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o email"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telefone</Text>
          <TextInputMask
            type="cel-phone"
            options={{
              maskType: "BRL",
              withDDD: true,
              dddMask: "(99) ",
            }}
            value={phone}
            onChangeText={setPhone}
            style={styles.maskedInput}
            placeholder="(00) 00000-0000"
          />
        </View>

        <Input
          label="Cidade"
          value={city}
          onChangeText={setCity}
          placeholder="Digite a cidade"
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Unidade mais próxima</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={nearestUnitId}
              onValueChange={(itemValue) => setNearestUnitId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma unidade" value={0} />
              {units.map((unit) => (
                <Picker.Item
                  key={unit.id}
                  label={unit.name}
                  value={unit.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancelar"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.cancelButton}
          />
          <Button
            title={saving ? "Salvando..." : "Salvar Alterações"}
            onPress={handleSave}
            disabled={saving}
            style={styles.saveButton}
          />
        </View>
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  userInfoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  userTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  userTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  maskedInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 0.45,
  },
  saveButton: {
    flex: 0.45,
  },
});
