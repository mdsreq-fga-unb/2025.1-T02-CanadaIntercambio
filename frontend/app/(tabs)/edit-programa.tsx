import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Program, programService } from "@/services/programService";
import { Toast } from "../../components/Toast";

export default function EditarProgramaScreen() {
  const { id } = useLocalSearchParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (id) loadProgram();
  }, [id]);

  const loadProgram = async () => {
    try {
      setLoading(true);
      const data = await programService.getProgramById(Number(id));
      setProgram(data);
    } catch (err) {
      showToast("Erro ao carregar programa", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!program) return;

    try {
      setLoading(true);
      await programService.updateProgram(Number(id), program);
      showToast("Programa atualizado com sucesso!", "success");
    } catch (err) {
      showToast("Erro ao atualizar programa", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Program, value: string) => {
    setProgram((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  if (!program) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando...</Text>
      </View>
    );
  }

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

      {/* Conteúdo principal */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Editar Programa</Text>

        {[
          { label: "Título", key: "title" },
          { label: "Descrição", key: "description", multiline: true },
          { label: "Preço", key: "price", keyboardType: "numeric" },
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
              value={String(program?.[key as keyof Program] || "")}
              onChangeText={(v) => handleChange(key as keyof Program, v)}
              keyboardType={keyboardType as any}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          <MaterialCommunityIcons name="content-save" size={20} color="white" />
          <Text style={styles.saveButtonText}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Navbar inferior */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/programas")}
        >
          <MaterialCommunityIcons name="map-marker" size={24} color="white" />
          <Text style={styles.navText}>Programas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/perfil_principal")}
        >
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/inicio-quiz")}
        >
          <Ionicons name="chatbox" size={24} color="white" />
          <Text style={styles.navText}>Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
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

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "#cb2328",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 12,
  },
  logo: {
    width: 200,
    height: 40,
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    color: "#cb2328",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  field: {
    marginBottom: 16,
  },
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
  loading: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 16,
    color: "#666",
  },
  bottomNavigation: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
  },
});
