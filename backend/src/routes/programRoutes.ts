import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProgramController } from '../controllers/ProgramController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export class ProgramRoutes {
  private router: Router;
  private programController: ProgramController;
  private authMiddleware: AuthMiddleware;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.programController = new ProgramController(prisma);
    this.authMiddleware = new AuthMiddleware(prisma);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rotas públicas
    this.router.get('/', (req, res) => this.programController.getPrograms(req, res));
    this.router.get('/:id', (req, res) => this.programController.getProgramById(req, res));
    
    // Tornando temporariamente público para testes
    this.router.get('/recommended/:userId', (req, res) => this.programController.getRecommendedPrograms(req, res));
    
    // Rotas apenas para administradores
    this.router.post('/', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireAdmin,
      (req, res) => this.programController.createProgram(req, res)
    );
    
    this.router.put('/:id', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireAdmin,
      (req, res) => this.programController.updateProgram(req, res)
    );
    
    this.router.delete('/:id', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireAdmin,
      (req, res) => this.programController.deleteProgram(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
