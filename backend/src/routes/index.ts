import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRoutes } from './authRoutes';
import { TestRoutes } from './testRoutes';
import { ProgramRoutes } from './programRoutes';
import { QuizRoutes } from './quizRoutes';
import { ProfileRoutes } from './profileRoutes';

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

    // Rotas de perfil
    const profileRoutes = new ProfileRoutes(this.prisma);
    this.router.use('/profile', profileRoutes.getRouter());

    // Rotas de programas
    const programRoutes = new ProgramRoutes(this.prisma);
    this.router.use('/programs', programRoutes.getRouter());

    // Rotas de quiz
    const quizRoutes = new QuizRoutes(this.prisma);
    this.router.use('/quiz', quizRoutes.getRouter());

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
