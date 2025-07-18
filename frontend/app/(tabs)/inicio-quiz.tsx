import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const loginLogo = require("../../assets/images/login_logo.png");

export default function QuizInicial() {
  const handleStartQuiz = () => {
    router.push({
      pathname: "/quiz",
      params: { quizType: "PERFIL" },
    });
  };

  const handleVoltar = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.content}>
        <Text style={styles.welcome}>Quiz de Perfil</Text>

        <Image source={loginLogo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>
          Descubra o programa {"\n"}
          de intercâmbio ideal {"\n"}
          para você!
        </Text>

        <Pressable style={styles.button} onPress={handleStartQuiz}>
          <Text style={styles.buttonText}>Começar</Text>
        </Pressable>

        <Text style={styles.subtext}>
          São apenas 6 perguntinhas, {"\n"}
          prometemos que será bem rapidinho!
        </Text>
      </View>

      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    backgroundColor: "#cb2328",
  },
  footer: {
    height: 40,
    backgroundColor: "#cb2328",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#cb2328",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: "80%",
    maxWidth: 300,
    height: 90,
    marginBottom: 30,
  },
  title: {
    color: "#DC2626",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },
  subtext: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
  },
});
