import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { QuizController } from '../controllers/QuizController';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

export class QuizRoutes {
  private router: Router;
  private quizController: QuizController;
  private authMiddleware: AuthMiddleware;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.quizController = new QuizController(prisma);
    this.authMiddleware = new AuthMiddleware(prisma);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Rotas públicas do quiz
    this.router.get('/:type', (req, res) => this.quizController.getQuizByType(req, res));
    this.router.get('/:type/questions', (req, res) => this.quizController.getQuizQuestions(req, res));
    
    // Temporariamente tornando público para testes
    this.router.post('/submit', (req, res) => this.quizController.submitQuiz(req, res));
    
    // Rotas que precisam de autenticação
    this.router.get('/result/:userId', 
      this.authMiddleware.authenticate,
      (req, res) => this.quizController.getQuizResult(req, res)
    );
    
    this.router.get('/history/:userId', 
      this.authMiddleware.authenticate,
      (req, res) => this.quizController.getQuizHistory(req, res)
    );
    
    // Rotas apenas para administradores
    this.router.post('/', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireAdmin,
      (req, res) => this.quizController.createQuiz(req, res)
    );
    
    this.router.put('/:id', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireAdmin,
      (req, res) => this.quizController.updateQuiz(req, res)
    );
    
    this.router.delete('/:id', 
      this.authMiddleware.authenticate,
      this.authMiddleware.requireAdmin,
      (req, res) => this.quizController.deleteQuiz(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
