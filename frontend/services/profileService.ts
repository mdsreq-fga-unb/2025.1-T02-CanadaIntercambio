import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_CONFIG, STORAGE_KEYS } from "../constants/api";

// --- Tipagens ---
export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  nearestUnitId?: number;
  nearestUnit?: {
    id: number;
    name: string;
    phone: string;
  };
  birthDate?: string;
  hasPassport?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Serviço ---
class ProfileService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { "Content-Type": "application/json" },
    });

    // ⏩  Interceptor: adiciona o token antes de cada request
    this.api.interceptors.request.use(async (config) => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /* GET /api/profile */
  async getProfile(): Promise<Profile> {
    const { data } = await this.api.get<ApiResponse<Profile>>("/profile");
    if (!data.success) throw new Error(data.message || "Erro ao buscar perfil");
    return data.data;
  }

  /* PATCH /api/profile */

  async updateProfile(payload: Partial<Profile>): Promise<Profile> {
    const { data } = await this.api.patch<ApiResponse<UpdateProfileResponse>>(
      "/profile",
      payload
    );
    if (!data.success)
      throw new Error(data.message || "Erro ao atualizar perfil");

    // Atualizar token se existir
    if (data.data.token) {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.data.token);
    }

    // Atualizar dados do usuário localmente (opcional)
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify(data.data.user)
    );

    return data.data.user;
  }
}

interface UpdateProfileResponse {
  user: Profile;
  token?: string;
}

export const profileService = new ProfileService();
