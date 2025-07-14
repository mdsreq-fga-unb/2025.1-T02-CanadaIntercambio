import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  MaterialIcons,
  Feather,
  Entypo,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";

export default function PerfilPrincipal() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/login_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={60} color="#bbb" />
        </View>
        <View style={styles.profileText}>
          <Text style={styles.profileName}>Henrique</Text>
          <Text style={styles.profileType}>Administrador</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#222"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Gerenciar perfil</Text>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="people-outline"
            size={20}
            color="#222"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Visualizar usuarios inscritos</Text>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather
            name="settings"
            size={20}
            color="#222"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Configurações</Text>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
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
  logo: { width: 200, height: 60, marginTop: 10 },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
    alignSelf: "center",
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileText: {},
  profileName: { fontSize: 18, fontWeight: "bold", color: "#222" },
  profileType: { fontSize: 14, color: "#555" },
  menuContainer: {
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  menuIcon: { marginRight: 12 },
  menuText: { flex: 1, fontSize: 16, color: "#222", fontWeight: "semibold" },
  menuArrow: {},
  logoutButton: {
    marginTop: 30,
    alignSelf: "center",
  },
  logoutText: {
    color: "#cb2328",
    fontWeight: "bold",
    fontSize: 18,
  },
  footer: { height: 40, backgroundColor: "#cb2328", marginTop: "auto" },
});
