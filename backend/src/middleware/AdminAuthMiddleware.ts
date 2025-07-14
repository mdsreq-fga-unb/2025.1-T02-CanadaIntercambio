import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    userType: 'visitante' | 'intercambista' | 'admin';
  };
}

export class AdminAuthMiddleware {
  static authorizeAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    if (!req.user || req.user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado: Apenas administradores podem realizar esta ação.' 
      });
    }
    next();
  }
}
