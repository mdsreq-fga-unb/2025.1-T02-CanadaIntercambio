import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { TestController } from '../controllers/TestController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export class TestRoutes {
  private router: Router;
  private testController: TestController;
  private authMiddleware: AuthMiddleware;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.testController = new TestController();
    this.authMiddleware = new AuthMiddleware(prisma);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rota pública
    this.router.get('/public', (req, res) => this.testController.publicRoute(req, res));
    
    // Rota autenticada (qualquer usuário logado)
    this.router.get('/authenticated', 
      this.authMiddleware.authenticate,
      (req, res) => this.testController.authenticatedRoute(req, res)
    );
    
    // Rota apenas para administradores
    this.router.get('/admin-only', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireAdmin,
      (req, res) => this.testController.adminOnlyRoute(req, res)
    );
    
    // Rota para intercambistas ou administradores
    this.router.get('/intercambista-or-admin', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireRole(['intercambista', 'admin']),
      (req, res) => this.testController.intercambistaOrAdminRoute(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
