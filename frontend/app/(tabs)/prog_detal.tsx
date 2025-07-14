import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

const torontoSkyline = require("../../assets/images/toronto.jpg");

export default function ProgramaDetalhe() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/login_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Voltar */}
      <TouchableOpacity style={styles.backButton}>
        <Feather name="arrow-left" size={28} color="#cb2328" />
      </TouchableOpacity>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Image source={torontoSkyline} style={styles.programImage} />
        <Text style={styles.title}>High School</Text>

        <View style={styles.list}>
          <Text style={styles.itemTitle}>1- Moeda Mais Barata</Text>
          <Text style={styles.itemText}>
            O dólar canadense é mais barato que o americano, o que torna o custo
            de um intercâmbio mais acessível.
          </Text>

          <Text style={styles.itemTitle}>2- Duração</Text>
          <Text style={styles.itemText}>
            Interagir diariamente com falantes nativos de inglês irá melhorar
            significativamente sua fluência e confiança no uso do idioma.
          </Text>

          <Text style={styles.itemTitle}>3- Diversidade Cultural</Text>
          <Text style={styles.itemText}>
            Além de falar inglês com nativos, você desenvolve o idioma em
            contato com pessoas com diferentes sotaques, já que o Canadá tem
            comunidade multicultural.
          </Text>

          <Text style={styles.itemTitle}>4- Média de Preço</Text>
          <Text style={styles.itemText}>
            Além de ser constantemente classificado como um dos países mais
            seguros do mundo, como estudante internacional você se sentirá
            seguro e bem-vindo. O país tem um friendly environment para
            imigrantes.
          </Text>

          <Text style={styles.itemTitle}>5- Requisitos</Text>
          <Text style={styles.itemText}>
            Ter proficiência em inglês é altamente valorizado no mercado de
            trabalho global. No Canadá você encontra programas de idiomas com
            vocabulário específico para áreas de interesse, como Marketing,
            Jurídico, Saúde e outros.
          </Text>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Fazer quiz sobre o programa</Text>
        </TouchableOpacity>
      </View>

      {/* Navbar */}
      <View style={styles.bottomNavigation}>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="map-marker" size={24} color="white" />
          <Text style={styles.navText}>Programas</Text>
        </View>
        <View style={styles.navItem}>
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navText}>Perfil</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="chatbox" size={24} color="white" />
          <TouchableOpacity onPress={() => router.push("/faq")}>
              <Text style={styles.navText}>FAQ</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  logo: { width: 200, height: 60, marginTop: 10 },
  backButton: { position: "absolute", top: 30, left: 20, zIndex: 2 },
  content: { flex: 1, alignItems: "center", padding: 20, paddingTop: 0 },
  programImage: {
    width: 220,
    height: 140,
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 16,
    resizeMode: "cover",
  },
  title: {
    color: "#cb2328",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 18,
  },
  list: { width: "100%", marginBottom: 24 },
  itemTitle: {
    color: "#cb2328",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 2,
  },
  itemText: {
    color: "#222",
    fontSize: 15,
    marginBottom: 6,
  },
  button: {
    backgroundColor: "#cb2328",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  bottomNavigation: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navItem: { alignItems: "center" },
  navText: { color: "white", fontSize: 10, marginTop: 4 },
});
