import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRoutes } from './authRoutes';
import { TestRoutes } from './testRoutes';

export class AppRoutes {
  private router: Router;
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.prisma = prisma;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rotas de autenticação
    const authRoutes = new AuthRoutes(this.prisma);
    this.router.use('/auth', authRoutes.getRouter());

    // Rotas de teste para verificar autenticação e autorização
    const testRoutes = new TestRoutes(this.prisma);
    this.router.use('/test', testRoutes.getRouter());

    // Rota de teste básica
    this.router.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
  }

  getRouter(): Router {
    return this.router;
  }
}
