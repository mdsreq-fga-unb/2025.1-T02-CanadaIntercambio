import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { adminService } from "../../services/adminService";
import { Toast } from "../../components/Toast";
import { router } from "expo-router";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  createdAt: string;
  visitante?: { id: number };
  intercambista?: { id: number };
  admin?: { id: number };
  nearestUnit?: {
    id: number;
    name: string;
  };
}

export default function AdminUsuariosScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
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

  // Carregar lista de usuários
  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários baseado na pesquisa
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchText, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        showToast("Erro ao carregar usuários", "error");
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      showToast("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  };

  const getUserType = (user: User): string => {
    if (user.admin) return "Administrador";
    if (user.intercambista) return "Intercambista";
    if (user.visitante) return "Visitante";
    return "Não definido";
  };

  const getUserTypeColor = (user: User): string => {
    if (user.admin) return "#e74c3c";
    if (user.intercambista) return "#3498db";
    if (user.visitante) return "#2ecc71";
    return "#95a5a6";
  };

  const handleEditUser = (userId: number) => {
    router.push(`/admin-editar-perfil?userId=${userId}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Usuários</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar por nome ou email..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <Text style={styles.subtitle}>
        {filteredUsers.length} usuário(s) encontrado(s)
      </Text>

      <ScrollView style={styles.usersList}>
        {filteredUsers.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.userCard}
            onPress={() => handleEditUser(user.id)}
          >
            <View style={styles.userHeader}>
              <Text style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
              <View
                style={[
                  styles.userTypeBadge,
                  { backgroundColor: getUserTypeColor(user) },
                ]}
              >
                <Text style={styles.userTypeText}>{getUserType(user)}</Text>
              </View>
            </View>
            
            <Text style={styles.userEmail}>{user.email}</Text>
            
            {user.phone && (
              <Text style={styles.userPhone}>📞 {user.phone}</Text>
            )}
            
            {user.city && (
              <Text style={styles.userCity}>📍 {user.city}</Text>
            )}
            
            {user.nearestUnit && (
              <Text style={styles.userUnit}>
                🏢 {user.nearestUnit.name}
              </Text>
            )}
            
            <Text style={styles.userDate}>
              Cadastrado em: {formatDate(user.createdAt)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  usersList: {
    flex: 1,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
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
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userCity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userUnit: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
  logo: { width: 250, height: 60, marginTop: 10 },
  footer: { height: 40, backgroundColor: "#cb2328", marginTop: "auto" },
  content: {
    alignItems: "center",
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    height: 70,
    backgroundColor: "#cb2328",
    justifyContent: "center",
    alignItems: "center",
  },
});