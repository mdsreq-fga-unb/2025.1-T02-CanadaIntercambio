// app/cadastrar-programa.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { router } from "expo-router";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Program, programService } from "@/services/programService";
import { Toast } from "../../components/Toast";

export default function CadastrarProgramaScreen() {
  /** --------- estado --------- */
  const [program, setProgram] = useState<Partial<Program>>({
    title: "",
    description: "",
    durationWeeks: undefined,
    country: "",
    focus: "",
    method: "",
    type: "",
    workload: "",
    languageLevel: "",
    requirements: "",
    price: undefined,
  });
  const [loading, setLoading] = useState(false);

  /** --------- toast --------- */
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({ visible: false, message: "", type: "info" });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => setToast({ visible: true, message, type });

  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  /** --------- validação --------- */
  const isFormValid = (): boolean => {
    const required: (keyof Program)[] = [
      "title",
      "description",
      "durationWeeks",
      "country",
      "focus",
      "method",
      "type",
      "workload",
      "languageLevel",
      "requirements",
    ];
    return required.every(
      (f) => program[f] !== undefined && String(program[f]).trim() !== ""
    );
  };

  /** --------- handlers --------- */
  const handleChange = (field: keyof Program, value: string) => {
    setProgram((prev) => {
      if (!prev) return prev;

      const newValue = field === "durationWeeks" ? Number(value) : value;

      return { ...prev, [field]: newValue };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await programService.createProgram(program);
      showToast("Programa criado com sucesso!", "success");
      setTimeout(() => router.replace("/programas"), 1200);
    } catch (err) {
      console.error(err);
      showToast("Erro ao criar programa", "error");
    } finally {
      setLoading(false);
    }
  };

  /** --------- render --------- */
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/login_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Formulário */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastrar Programa</Text>

        {[
          { label: "Título", key: "title" },
          { label: "Descrição", key: "description", multiline: true },
          {
            label: "Duração (semanas)",
            key: "durationWeeks",
            keyboardType: "numeric",
          },
          { label: "País", key: "country" },
          { label: "Foco", key: "focus" },
          { label: "Método", key: "method" },
          { label: "Tipo", key: "type" },
          { label: "Carga horária", key: "workload" },
          { label: "Nível de idioma", key: "languageLevel" },
          { label: "Requisitos", key: "requirements", multiline: true },
        ].map(({ label, key, keyboardType, multiline }) => (
          <View style={styles.field} key={key}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              value={String(program[key as keyof Program] || "")}
              onChangeText={(v) => handleChange(key as keyof Program, v)}
              keyboardType={keyboardType as any}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
            />
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!isFormValid() || loading) && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={!isFormValid() || loading}
        >
          <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>
            {loading ? "Salvando..." : "Criar Programa"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navbar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/programas")}
        >
          <MaterialCommunityIcons name="map-marker" size={24} color="#fff" />
          <Text style={styles.navText}>Programas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/perfil_principal")}
        >
          <FontAwesome name="user" size={24} color="#fff" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/inicio-quiz")}
        >
          <Ionicons name="chatbox" size={24} color="#fff" />
          <Text style={styles.navText}>Quiz</Text>
        </TouchableOpacity>
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        duration={toast.type === "error" ? 5000 : 3000}
      />
    </View>
  );
}

/* ---------- estilos ---------- */
const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "#cb2328",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: { marginRight: 12 },
  logo: { width: 200, height: 40 },
  container: { padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    color: "#cb2328",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  field: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DC2626",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  disabledButton: { opacity: 0.5 },
  bottomNavigation: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navItem: { alignItems: "center" },
  navText: { color: "#fff", fontSize: 10, marginTop: 4 },
});
