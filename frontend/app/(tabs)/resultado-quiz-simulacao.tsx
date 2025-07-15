import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const loginLogo = require("../../assets/images/login_logo.png");

export default function ResultadoQuizSimulacao() {
  const score = 6;

  const handleContato = () => {
    const phone = "5511999999999";
    const message = `Olá! Gostaria de conversar sobre meu resultado na simulação.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Resultado da Simulação</Text>
        <Image source={loginLogo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.subtitle}>
          Você obteve <Text style={styles.highlight}>{score} pontos</Text> na
          simulação!
        </Text>

        <Text style={styles.description}>
          Nossa equipe pode te orientar melhor com base nesse resultado.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleContato}>
          <MaterialIcons name="support-agent" size={22} color="#fff" />
          <Text style={styles.buttonText}>Falar com Atendimento</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { height: 60, backgroundColor: "#cb2328" },
  footer: { height: 40, backgroundColor: "#cb2328" },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#cb2328",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
    marginBottom: 16,
  },
  highlight: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 24,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  logo: {
    width: "80%",
    maxWidth: 300,
    height: 90,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});
