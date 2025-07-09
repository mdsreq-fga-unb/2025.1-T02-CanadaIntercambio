import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/AuthService';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthController {
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    this.authService = new AuthService(prisma);
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const registerData: RegisterRequest = req.body;
      
      const result = await this.authService.register(registerData);
      
      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequest = req.body;
      
      const result = await this.authService.login(loginData);
      
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    // Para JWT, o logout é feito no lado cliente removendo o token
    // Aqui podemos apenas confirmar o logout
    res.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      // O middleware de autenticação já validou o token e anexou o usuário
      const authReq = req as any;
      
      if (!authReq.user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: authReq.user,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
}
