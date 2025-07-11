import axios, { AxiosInstance } from 'axios';
import { API_CONFIG } from '../constants/api';

// Tipos para Programa
export interface Program {
  id: number;
  title: string;
  description: string;
  durationWeeks: number;
  country: string;
  price: number;
  requirements: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Campos detalhados
  focus?: string;
  method?: string;
  type?: string;
  workload?: string;
  languageLevel?: string;
  minAge?: number;
  maxAge?: number;
  minDuration?: number;
  maxDuration?: number;
  priceRange?: string;
  
  // Critérios para matching
  targetAgeRange?: string;
  purpose?: string;
  durationRange?: string;
  companionshipType?: string;
  englishLevel?: string;
}

export interface ProgramsResponse {
  success: boolean;
  data: Program[];
  message?: string;
}

export interface ProgramResponse {
  success: boolean;
  data: Program;
  message?: string;
}

class ProgramService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Buscar todos os programas
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await this.api.get<ProgramsResponse>('/api/programs');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar programas');
      }
    } catch (error: any) {
      console.error('Erro ao buscar programas:', error);
      throw new Error('Erro ao carregar programas. Tente novamente.');
    }
  }

  // Buscar programa por ID
  async getProgramById(id: number): Promise<Program> {
    try {
      const response = await this.api.get<ProgramResponse>(`/api/programs/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Programa não encontrado');
      }
    } catch (error: any) {
      console.error('Erro ao buscar programa:', error);
      throw new Error('Erro ao carregar programa. Tente novamente.');
    }
  }

  // Buscar programas ativos
  async getActivePrograms(): Promise<Program[]> {
    try {
      const response = await this.api.get<ProgramsResponse>('/api/programs?active=true');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar programas');
      }
    } catch (error: any) {
      console.error('Erro ao buscar programas ativos:', error);
      throw new Error('Erro ao carregar programas. Tente novamente.');
    }
  }

  // Buscar programas recomendados para um usuário
  async getRecommendedPrograms(userId: number): Promise<Program[]> {
    try {
      const response = await this.api.get<ProgramsResponse>(`/api/programs/recommended/${userId}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar recomendações');
      }
    } catch (error: any) {
      console.error('Erro ao buscar programas recomendados:', error);
      throw new Error('Erro ao carregar recomendações. Tente novamente.');
    }
  }

  // Formatador de preço
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  // Formatador de duração
  formatDuration(weeks: number): string {
    if (weeks === 1) return '1 semana';
    if (weeks < 4) return `${weeks} semanas`;
    
    const months = Math.floor(weeks / 4);
    const remainingWeeks = weeks % 4;
    
    if (months === 1 && remainingWeeks === 0) return '1 mês';
    if (remainingWeeks === 0) return `${months} meses`;
    
    return `${months} meses e ${remainingWeeks} semana${remainingWeeks > 1 ? 's' : ''}`;
  }
}

export const programService = new ProgramService();
