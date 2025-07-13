import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export class AuthRoutes {
  private router: Router;
  private authController: AuthController;
  private authMiddleware: AuthMiddleware;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.authController = new AuthController(prisma);
    this.authMiddleware = new AuthMiddleware(prisma);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rotas públicas
    this.router.post('/register', (req, res) => this.authController.register(req, res));
    this.router.post('/login', (req, res) => this.authController.login(req, res));
    
    // Rotas protegidas
    this.router.post('/logout', 
      this.authMiddleware.authenticate, 
      (req, res) => this.authController.logout(req, res)
    );
    
    this.router.get('/me', 
      this.authMiddleware.authenticate, 
      (req, res) => this.authController.me(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
