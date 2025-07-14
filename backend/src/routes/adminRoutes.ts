import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProfileController } from '../controllers/ProfileController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AdminAuthMiddleware } from '../middleware/AdminAuthMiddleware';

export class AdminRoutes {
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
    // Obter perfil de qualquer usuário (para administradores)
    this.router.get('/profiles/:userId',
      this.authMiddleware.authenticate,
      AdminAuthMiddleware.authorizeAdmin,
      (req, res) => this.profileController.getProfileByAdmin(req, res)
    );

    // Atualizar perfil de qualquer usuário (para administradores)
    this.router.patch('/profiles/:userId',
      this.authMiddleware.authenticate,
      AdminAuthMiddleware.authorizeAdmin,
      (req, res) => this.profileController.updateProfileByAdmin(req, res)
    );

    // Listar todos os usuários (para administradores)
    this.router.get('/users',
      this.authMiddleware.authenticate,
      AdminAuthMiddleware.authorizeAdmin,
      (req, res) => this.profileController.getAllUsers(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
