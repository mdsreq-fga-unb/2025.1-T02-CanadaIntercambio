import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { router } from "expo-router";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Unit, unitService } from "@/services/unitService";
import { useAuth } from "@/contexts/AuthContext";
import { useRegisterAdminForm } from "@/hooks/userRegisterAdminForm";

export default function CadastroAdmin() {
  const { register } = useAuth();
  const {
    firstName,
    lastName,
    email,
    phone,
    nearestUnitId,
    internalRole,
    password,
    confirmPassword,
    errors,
    validateForm,
    clearErrors,
    getRegisterData,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setNearestUnitId,
    setInternalRole,
    setPassword,
    setConfirmPassword,
  } = useRegisterAdminForm();

  const [aceito, setAceito] = useState(false);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

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

      Alert.alert("Sucesso!", "Cadastro realizado com sucesso!", [
        { text: "OK", onPress: () => router.replace("/programas") },
      ]);
    } catch (error: any) {
      Alert.alert("Erro no Cadastro", error.message || "Erro inesperado.", [
        { text: "OK" },
      ]);
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
        <Text style={styles.title}>Cadastro de Administrador</Text>

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
          placeholder="Email corporativo"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <Input
          placeholder="Telefone com DDD"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
          editable={!loading}
        />
        <Input
          placeholder="Função na empresa"
          value={internalRole}
          onChangeText={setInternalRole}
          error={errors.internalRole}
          editable={!loading}
        />

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

        <TouchableOpacity
          style={styles.selectButtonContainer}
          onPress={() => setModalVisible(true)}
          disabled={loading}
        >
          <Text
            style={nearestUnitId ? styles.selectText : styles.selectPlaceholder}
          >
            {nearestUnitId
              ? units.find((u) => u.id === nearestUnitId)?.name
              : "Selecione uma filial"}
          </Text>
        </TouchableOpacity>
        {errors.nearestUnitId && (
          <Text style={styles.errorText}>{errors.nearestUnitId}</Text>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione a filial</Text>
              <FlatList
                data={units}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setNearestUnitId(item.id);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>

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
  label: { fontSize: 14, color: "#333", marginBottom: 5 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    maxWidth: 350,
  },
  checkboxText: { flex: 1, fontSize: 12, color: "#333", marginLeft: 8 },
  link: { color: "#cb2328", textDecorationLine: "underline" },
  button: { width: "100%", maxWidth: 350, marginVertical: 20 },
  inputContainer: {
    width: "100%",
    maxWidth: 350,
    marginBottom: 15,
    alignSelf: "center",
  },
  selectButtonContainer: {
    width: '100%',
  },
  selectText: {
    color: "#333",
    fontSize: 16,
  },
  selectPlaceholder: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: '#f8f9fa',
    color: '#888888',
    paddingTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginBottom: 15,
    height: 48, 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxHeight: "80%",
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#cb2328",
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
});
