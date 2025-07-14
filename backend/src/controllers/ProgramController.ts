import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export class ProgramController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Buscar todos os programas
  async getPrograms(req: Request, res: Response): Promise<void> {
    try {
      const { active } = req.query;

      const programs = await this.prisma.program.findMany({
        where: active === "true" ? { isActive: true } : {},
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json({
        success: true,
        data: programs,
      });
    } catch (error) {
      console.error("Erro ao buscar programas:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Buscar programa por ID
  async getProgramById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const program = await this.prisma.program.findUnique({
        where: { id: parseInt(id) },
      });

      if (!program) {
        res.status(404).json({
          success: false,
          message: "Programa não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: program,
      });
    } catch (error) {
      console.error("Erro ao buscar programa:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Buscar programas recomendados para um usuário
  async getRecommendedPrograms(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Buscar resultado mais recente do quiz do usuário
      const quizResult = await this.prisma.quizResult.findFirst({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: "desc" },
      });

      let recommendedPrograms;

      if (quizResult) {
        // Usar os critérios do quiz para filtrar programas
        recommendedPrograms = await this.prisma.program.findMany({
          where: {
            isActive: true,
            AND: [
              quizResult.ageRange
                ? { targetAgeRange: { contains: quizResult.ageRange } }
                : {},
              quizResult.purpose
                ? { purpose: { contains: quizResult.purpose } }
                : {},
              quizResult.durationRange
                ? { durationRange: { contains: quizResult.durationRange } }
                : {},
              quizResult.englishLevel
                ? { englishLevel: { contains: quizResult.englishLevel } }
                : {},
              quizResult.priceRange
                ? { priceRange: { contains: quizResult.priceRange } }
                : {},
            ].filter((condition) => Object.keys(condition).length > 0),
          },
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
        });

        // Se não encontrou programas com os critérios, buscar programas populares
        if (recommendedPrograms.length === 0) {
          recommendedPrograms = await this.prisma.program.findMany({
            where: { isActive: true },
            take: 3,
            orderBy: {
              createdAt: "desc",
            },
          });
        }
      } else {
        // Se não há resultado de quiz, retornar programas populares
        recommendedPrograms = await this.prisma.program.findMany({
          where: { isActive: true },
          take: 3,
          orderBy: {
            createdAt: "desc",
          },
        });
      }

      res.status(200).json({
        success: true,
        data: recommendedPrograms,
      });
    } catch (error) {
      console.error("Erro ao buscar programas recomendados:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Criar novo programa (apenas para admins)
  async createProgram(req: Request, res: Response): Promise<void> {
    try {
      const programData = req.body;

      const program = await this.prisma.program.create({
        data: programData,
      });

      res.status(201).json({
        success: true,
        data: program,
        message: "Programa criado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao criar programa:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Atualizar programa (apenas para admins)
  async updateProgram(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const programData = req.body;

      const program = await this.prisma.program.update({
        where: { id: parseInt(id) },
        data: programData,
      });

      res.status(200).json({
        success: true,
        data: program,
        message: "Programa atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar programa:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Deletar programa (apenas para admins)
  async deleteProgram(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.prisma.program.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });

      res.status(200).json({
        success: true,
        message: "Programa desativado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar programa:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }
}
