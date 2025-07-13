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
  targetFocus?: string;
  targetMethod?: string;
  targetType?: string;
  targetWorkload?: string;
  targetLanguageLevel?: string;
  targetPriceRange?: string;
  targetDuration?: string;
  targetCountry?: string;
  experienceLevel?: string;
  studyGoals?: string;
  preferredLocation?: string;
  budgetRange?: string;
  timeCommitment?: string;
}

// Tipos para resposta da API
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
      const response = await this.api.get<ProgramsResponse>('/programs');
      
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
      const response = await this.api.get<ProgramResponse>(`/programs/${id}`);
      
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
      const response = await this.api.get<ProgramsResponse>('/programs?active=true');
      
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

  // Buscar programas recomendados
  async getRecommendedPrograms(userId: number): Promise<Program[]> {
    try {
      const response = await this.api.get<ProgramsResponse>(`/programs/recommended/${userId}`);
      
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

  // Formatar preço para exibição
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  // Formatar duração para exibição
  formatDuration(weeks: number): string {
    if (weeks === 1) return '1 semana';
    if (weeks < 4) return `${weeks} semanas`;
    
    const months = Math.floor(weeks / 4);
    const remainingWeeks = weeks % 4;
    
    if (months === 1) {
      if (remainingWeeks === 0) return '1 mês';
      return `1 mês e ${remainingWeeks} semana${remainingWeeks > 1 ? 's' : ''}`;
    }
    
    if (remainingWeeks === 0) return `${months} meses`;
    return `${months} meses e ${remainingWeeks} semana${remainingWeeks > 1 ? 's' : ''}`;
  }

  // Validar dados do programa
  validateProgram(program: Partial<Program>): string[] {
    const errors: string[] = [];
    
    if (!program.title || program.title.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }
    
    if (!program.description || program.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }
    
    if (!program.durationWeeks || program.durationWeeks < 1) {
      errors.push('Duração deve ser de pelo menos 1 semana');
    }
    
    if (!program.price || program.price <= 0) {
      errors.push('Preço deve ser maior que zero');
    }
    
    if (!program.country || program.country.trim().length < 2) {
      errors.push('País deve ser informado');
    }
    
    return errors;
  }
}

export const programService = new ProgramService();
