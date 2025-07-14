import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useAuth } from "../../contexts/AuthContext";
import { getGravatarUrl } from "../../utils/gravatar";
import { useRouter } from "expo-router";
import { profileService } from "../../services/profileService";

export default function PerfilPrincipal() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const gravatarUrl = user?.email ? getGravatarUrl(user.email, 100) : undefined;

  const [unitPhone, setUnitPhone] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await profileService.getProfile();
        const phone = profile?.nearestUnit?.phone || null;
        setUnitPhone(phone);
      } catch (err) {
        console.error("Erro ao carregar telefone da unidade:", err);
      }
    };

    loadProfile();
  }, []);

  const handleContactPress = () => {
    if (!unitPhone) {
      Alert.alert(
        "Telefone não disponível",
        "A unidade mais próxima não possui um telefone cadastrado."
      );
      return;
    }

    const digitsOnly = unitPhone.replace(/\D/g, "");
    const message =
      "Olá, vim pelo App e gostaria de saber mais sobre os programas de intercâmbio.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/55${digitsOnly}?text=${encodedMessage}`;

    Linking.openURL(whatsappLink).catch(() => {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    });
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

      <View style={styles.profileContainer}>
        <View style={styles.avatarCircle}>
          {gravatarUrl ? (
            <Image
              source={{ uri: gravatarUrl }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
              resizeMode="cover"
            />
          ) : (
            <Feather name="user" size={60} color="#bbb" />
          )}
        </View>
        <View style={styles.profileText}>
          <Text style={styles.profileName}>{user?.firstName || "Usuário"}</Text>
          <Text style={styles.profileType}>
            {user?.userType === "intercambista"
              ? "Intercambista"
              : user?.userType === "admin"
              ? "Administrador"
              : "Interessado"}
          </Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons
            name="person-outline"
            size={22}
            color="#222"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Dados</Text>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather
            name="edit-2"
            size={20}
            color="#222"
            style={styles.menuIcon}
          />
        <TouchableOpacity style={styles.menuText} onPress={() => router.push('/editar_perfil')}>
          <Text >Editar Dados</Text>
        </TouchableOpacity>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Entypo
            name="dots-three-horizontal"
            size={20}
            color="#222"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Trocar Senha</Text>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Feather
            name="trash-2"
            size={20}
            color="#222"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Deletar Conta</Text>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons
            name="settings-outline"
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

        <TouchableOpacity style={styles.menuItem} onPress={handleContactPress}>
          <FontAwesome
            name="envelope-o"
            size={20}
            color="#222"
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Contate-nos</Text>
          <Feather
            name="chevron-right"
            size={22}
            color="#1e1e1e"
            style={styles.menuArrow}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
        await logout();
        router.replace('/onboard_inicial');
      }}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

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
          <Text style={styles.navText}>FAQ</Text>
        </TouchableOpacity>
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
  menuText: { flex: 1, fontSize: 16, color: "#222", fontWeight: "500" },
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
  bottomNavigation: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 20,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
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
