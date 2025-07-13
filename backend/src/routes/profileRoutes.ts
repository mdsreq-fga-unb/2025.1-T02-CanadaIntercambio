import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProfileController } from '../controllers/ProfileController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export class ProfileRoutes {
  private router: Router;
  private profileController: ProfileController;
  private authMiddleware: AuthMiddleware;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.profileController = new ProfileController(prisma);
    this.authMiddleware = new AuthMiddleware(prisma);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Obter dados do próprio perfil
    this.router.get('/',
      this.authMiddleware.authenticate,
      (req, res) => this.profileController.getProfile(req, res)
    );

    // Atualizar perfil do usuário autenticado
    this.router.patch(
      '/',
      this.authMiddleware.authenticate,
      (req, res) => this.profileController.updateProfile(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
