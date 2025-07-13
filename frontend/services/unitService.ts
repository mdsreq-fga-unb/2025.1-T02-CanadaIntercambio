import axios from "axios";
import { API_CONFIG } from "../constants/api";

// Tipagem da unidade
export interface Unit {
  id: number;
  name: string;
  city?: string;
  state?: string;
}

export class UnitService {
  async getAll(): Promise<Unit[]> {
    const response = await axios.get<{ success: boolean; data: Unit[] }>(
      "/units",
      {
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
      }
    );

    if (!response.data.success) {
      throw new Error("Erro ao buscar unidades");
    }

    return response.data.data;
  }
}

export const unitService = new UnitService();
