import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/AuthService';
import { JwtPayload } from '../types/auth';
import { AuthenticatedRequest } from '../types/express';

export class AuthMiddleware {
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    this.authService = new AuthService(prisma);
  }

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: 'Token de acesso requerido',
        });
        return;
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token de acesso inválido',
        });
        return;
      }

      const decoded = await this.authService.verifyToken(token);
      req.user = decoded;
      
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado',
      });
    }
  };

  requireRole = (roles: Array<'visitante' | 'intercambista' | 'admin'>) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
        });
        return;
      }

      if (!roles.includes(req.user.userType)) {
        res.status(403).json({
          success: false,
          message: 'Acesso negado - Permissão insuficiente',
        });
        return;
      }

      next();
    };
  };

  requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado',
      });
      return;
    }

    if (req.user.userType !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Acesso negado - Apenas administradores',
      });
      return;
    }

    next();
  };
}
