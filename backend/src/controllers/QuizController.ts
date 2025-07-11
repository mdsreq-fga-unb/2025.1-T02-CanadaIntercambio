import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class QuizController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Buscar quiz por tipo
  async getQuizByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      
      const quiz = await this.prisma.quiz.findFirst({
        where: { type: type as any },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!quiz) {
        res.status(404).json({
          success: false,
          message: 'Quiz não encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      console.error('Erro ao buscar quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Buscar apenas as perguntas de um quiz
  async getQuizQuestions(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      
      const quiz = await this.prisma.quiz.findFirst({
        where: { type: type as any },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      });

      if (!quiz) {
        res.status(404).json({
          success: false,
          message: 'Quiz não encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: quiz.id,
          title: quiz.title,
          questions: quiz.questions
        },
      });
    } catch (error) {
      console.error('Erro ao buscar perguntas do quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Submeter respostas do quiz
  async submitQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId, userId, answers } = req.body;

      // Validar se o quiz existe
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true }
      });

      if (!quiz) {
        res.status(404).json({
          success: false,
          message: 'Quiz não encontrado',
        });
        return;
      }

      // Validar se o usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
        return;
      }

      // Processar respostas e calcular resultado
      const processedAnswers = this.processAnswers(answers);
      const recommendedProgram = await this.calculateRecommendation(processedAnswers);

      // Salvar resultado no banco
      const quizResult = await this.prisma.quizResult.create({
        data: {
          userId,
          quizId,
          resultData: processedAnswers,
          recommendedProgramId: recommendedProgram?.id || null,
          ...this.extractUserProfile(processedAnswers)
        }
      });

      res.status(201).json({
        success: true,
        data: {
          id: quizResult.id,
          recommendedProgram,
          resultData: processedAnswers,
          completedAt: quizResult.createdAt
        },
      });
    } catch (error) {
      console.error('Erro ao submeter quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Buscar resultado do quiz de um usuário
  async getQuizResult(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      const latestResult = await this.prisma.quizResult.findFirst({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' },
        include: {
          quiz: true,
          recommendedProgram: true
        }
      });

      if (!latestResult) {
        res.status(404).json({
          success: false,
          message: 'Resultado do quiz não encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: latestResult.id,
          quiz: latestResult.quiz,
          resultData: latestResult.resultData,
          recommendedProgram: latestResult.recommendedProgram,
          completedAt: latestResult.createdAt
        },
      });
    } catch (error) {
      console.error('Erro ao buscar resultado do quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Buscar histórico de quizzes de um usuário
  async getQuizHistory(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      const history = await this.prisma.quizResult.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: 'desc' },
        include: {
          quiz: true,
          recommendedProgram: true
        }
      });

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error('Erro ao buscar histórico do quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Criar novo quiz (apenas para admins)
  async createQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { title, type, questions } = req.body;
      
      const quiz = await this.prisma.quiz.create({
        data: {
          title,
          type,
          questions: {
            create: questions.map((q: any, index: number) => ({
              question: q.question,
              questionType: q.questionType,
              options: q.options,
              isRequired: q.isRequired || true,
              order: index + 1
            }))
          }
        },
        include: {
          questions: true
        }
      });

      res.status(201).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      console.error('Erro ao criar quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Atualizar quiz (apenas para admins)
  async updateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const quiz = await this.prisma.quiz.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          questions: true
        }
      });

      res.status(200).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      console.error('Erro ao atualizar quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Excluir quiz (apenas para admins)
  async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      await this.prisma.quiz.delete({
        where: { id: parseInt(id) }
      });

      res.status(200).json({
        success: true,
        message: 'Quiz excluído com sucesso',
      });
    } catch (error) {
      console.error('Erro ao excluir quiz:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Método privado para processar respostas
  private processAnswers(answers: any[]): any {
    return answers.reduce((acc, answer) => {
      acc[answer.questionId] = answer.selectedOption || answer.textAnswer;
      return acc;
    }, {});
  }

  // Método privado para extrair perfil do usuário das respostas
  private extractUserProfile(answers: any): any {
    const profile: any = {};
    
    // Mapear respostas para campos do perfil
    Object.keys(answers).forEach(questionId => {
      const answer = answers[questionId];
      
      // Mapear baseado no tipo de pergunta
      switch (questionId) {
        case '1': // Idade
          profile.ageRange = answer;
          break;
        case '2': // Propósito
          profile.purpose = answer;
          break;
        case '3': // Duração
          profile.durationRange = answer;
          break;
        case '4': // Companhia
          profile.companionshipType = answer;
          break;
        case '5': // Nível de inglês
          profile.englishLevel = answer;
          break;
        case '6': // Orçamento
          profile.priceRange = answer;
          break;
      }
    });
    
    return profile;
  }

  // Método privado para calcular recomendação
  private async calculateRecommendation(answers: any): Promise<any> {
    try {
      // Extrair respostas principais
      const ageRange = answers['1'];
      const purpose = answers['2'];
      const durationRange = answers['3'];
      const englishLevel = answers['5'];
      const priceRange = answers['6'];

      // Aplicar regras de recomendação
      const programs = await this.prisma.program.findMany({
        where: { isActive: true }
      });

      // Filtrar programas baseado nas respostas
      const filteredPrograms = programs.filter(program => {
        // Regra 1: Idade
        if (ageRange === 'Menor de 18 anos' && !program.title.includes('High School')) {
          return false;
        }
        
        if (ageRange === '30 anos ou mais' && program.title.includes('High School')) {
          return false;
        }

        // Regra 2: Propósito
        if (purpose === 'aprender ou melhorar idioma' && 
            !program.title.toLowerCase().includes('inglês') && 
            !program.title.toLowerCase().includes('francês')) {
          return false;
        }

        // Regra 3: Duração
        if (durationRange === 'Até 1 mês' && (program.durationWeeks || 0) > 4) {
          return false;
        }

        // Regra 4: Nível de inglês
        if (englishLevel === 'iniciante' && program.languageLevel === 'Avançado ao fluente') {
          return false;
        }

        return true;
      });

      // Retornar o programa com maior pontuação
      return filteredPrograms.length > 0 ? filteredPrograms[0] : programs[0];
    } catch (error) {
      console.error('Erro ao calcular recomendação:', error);
      return null;
    }
  }
}
