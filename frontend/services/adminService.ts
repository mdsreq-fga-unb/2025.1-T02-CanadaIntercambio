import { api } from '../utils/api';

export interface AdminUser {
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

export interface AdminUserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
  nearestUnitId: number;
  visitante?: { id: number };
  intercambista?: { id: number };
  admin?: { id: number };
  nearestUnit?: {
    id: number;
    name: string;
    phone: string;
  };
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
  nearestUnitId?: number;
}

class AdminService {
  async getAllUsers(): Promise<{ success: boolean; data: AdminUser[]; message?: string }> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error);
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || 'Erro ao buscar usuários'
      };
    }
  }

  async getUserProfile(userId: number): Promise<{ success: boolean; data: AdminUserProfile; message?: string }> {
    try {
      const response = await api.get(`/admin/profiles/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return {
        success: false,
        data: {} as AdminUserProfile,
        message: error.response?.data?.message || 'Erro ao buscar perfil do usuário'
      };
    }
  }

  async updateUserProfile(
    userId: number, 
    data: UpdateUserProfileData
  ): Promise<{ success: boolean; data?: AdminUserProfile; message?: string }> {
    try {
      const response = await api.patch(`/admin/profiles/${userId}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar perfil do usuário'
      };
    }
  }
}

export const adminService = new AdminService();
