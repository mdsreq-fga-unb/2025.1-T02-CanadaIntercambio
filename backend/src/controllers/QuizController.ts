import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
            orderBy: { order: "asc" },
          },
        },
      });

      if (!quiz) {
        res.status(404).json({
          success: false,
          message: "Quiz não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      console.error("Erro ao buscar quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
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
            orderBy: { order: "asc" },
          },
        },
      });

      if (!quiz) {
        res.status(404).json({
          success: false,
          message: "Quiz não encontrado",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: quiz.id,
          title: quiz.title,
          questions: quiz.questions,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar perguntas do quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  async submitQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { quizId, userId, answers } = req.body;

      console.log("📨 Dados recebidos:", { quizId, userId, answers });

      // Validar quiz
      const quiz = await this.prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true },
      });

      if (!quiz) {
        res
          .status(404)
          .json({ success: false, message: "Quiz não encontrado" });
        return;
      }

      // Validar usuário
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        res
          .status(404)
          .json({ success: false, message: "Usuário não encontrado" });
        return;
      }

      // Variáveis para salvar no banco
      let resultData: any = {};
      let score = 0;
      let recommendedProgram = null;

      // 🧠 Lógica condicional por tipo de quiz
      if (quiz.type === "SIMULACAO") {
        const gabarito: Record<number, string> = {
          19: "B",
          20: "C",
          21: "B",
          22: "C",
          23: "C",
        };

        const total = Object.keys(gabarito).length;
        let acertos = 0;

        for (const resposta of answers) {
          const certa = gabarito[resposta.questionId];
          if (resposta.selectedOption?.toUpperCase() === certa) {
            acertos++;
          }
        }

        score = (acertos / total) * 100;

        resultData = {
          respostas: answers,
          acertos,
          total,
          feedback:
            score === 100
              ? "🎉 Parabéns! Você acertou tudo!"
              : score >= 60
              ? "✅ Muito bem! Você conhece bastante sobre o programa."
              : "📘 Que tal revisar as informações e tentar de novo?",
        };
      } else if (quiz.type === "PERFIL") {
        // Modelo antigo: perguntas de perfil → recomendações
        resultData = answers.reduce((acc: any, answer: any) => {
          acc[`pergunta_${answer.questionId}`] = answer.selectedOption;
          return acc;
        }, {});

        recommendedProgram = await this.getRecommendedProgram(resultData);
        score = 85; // Score simbólico para quizzes de perfil
      } else {
        res
          .status(400)
          .json({ success: false, message: "Tipo de quiz não suportado." });
        return;
      }

      // Criar resultado
      const quizResult = await this.prisma.quizResult.create({
        data: {
          userId,
          quizId,
          resultData,
          score,
          recommendedProgramId: recommendedProgram?.id || null,
        },
      });

      // Retornar resposta completa
      res.status(201).json({
        success: true,
        data: {
          id: quizResult.id,
          quiz: {
            id: quiz.id,
            title: quiz.title,
            type: quiz.type,
          },
          recommendedProgram,
          resultData,
          score,
          completedAt: quizResult.createdAt,
        },
      });
    } catch (error) {
      console.error("Erro ao submeter quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  }

  // Buscar resultado do quiz de um usuário
  async getQuizResult(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const latestResult = await this.prisma.quizResult.findFirst({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: "desc" },
        include: {
          quiz: true,
          recommendedProgram: true,
        },
      });

      if (!latestResult) {
        res.status(404).json({
          success: false,
          message: "Resultado do quiz não encontrado",
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
          completedAt: latestResult.createdAt,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar resultado do quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Buscar histórico de quizzes de um usuário
  async getQuizHistory(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const history = await this.prisma.quizResult.findMany({
        where: { userId: parseInt(userId) },
        orderBy: { createdAt: "desc" },
        include: {
          quiz: true,
          recommendedProgram: true,
        },
      });

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error("Erro ao buscar histórico do quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
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
              order: index + 1,
            })),
          },
        },
        include: {
          questions: true,
        },
      });

      res.status(201).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
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
          questions: true,
        },
      });

      res.status(200).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      console.error("Erro ao atualizar quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // Excluir quiz (apenas para admins)
  async deleteQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.prisma.quiz.delete({
        where: { id: parseInt(id) },
      });

      res.status(200).json({
        success: true,
        message: "Quiz excluído com sucesso",
      });
    } catch (error) {
      console.error("Erro ao excluir quiz:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
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
    Object.keys(answers).forEach((questionId) => {
      const answer = answers[questionId];

      // Mapear baseado no tipo de pergunta
      switch (questionId) {
        case "1": // Idade
          profile.ageRange = answer;
          break;
        case "2": // Propósito
          profile.purpose = answer;
          break;
        case "3": // Duração
          profile.durationRange = answer;
          break;
        case "4": // Companhia
          profile.companionshipType = answer;
          break;
        case "5": // Nível de inglês
          profile.englishLevel = answer;
          break;
        case "6": // Orçamento
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
      const ageRange = answers["1"];
      const purpose = answers["2"];
      const durationRange = answers["3"];
      const companionship = answers["4"];
      const englishLevel = answers["5"];
      const priceRange = answers["6"];

      console.log("Calculando recomendação para:", {
        ageRange,
        purpose,
        durationRange,
        englishLevel,
        priceRange,
      });

      // Aplicar regras de recomendação baseadas no frontend gerarRecomendacao.ts

      // HIGH SCHOOL
      if (
        ageRange === "Menor de 18 anos" &&
        ["Aprender ou melhorar idioma", "Estudar"].includes(purpose) &&
        ["1 a 3 meses", "4 a 6 meses", "Mais de 6 meses"].includes(
          durationRange
        ) &&
        ["Sozinho", "Amigos", "Familia"].includes(companionship) &&
        ["Intermediario", "Avançado", "Fluente"].includes(englishLevel) &&
        ["Entre 80.000 e 120.000 reais", "Acima de 120.000 reais"].includes(
          priceRange
        )
      ) {
        const highSchoolProgram = await this.prisma.program.findFirst({
          where: {
            isActive: true,
            title: { contains: "High School", mode: "insensitive" },
          },
        });

        if (highSchoolProgram) {
          return {
            ...highSchoolProgram,
            recommendationType: "High School",
            recommendationDescription: [
              "Programa completo para adolescentes entre 14 e 18 anos.",
              "Currículo com esportes, artes e imersão cultural.",
              "Duração de 1 semestre a 1 ano acadêmico.",
            ],
          };
        }
      }

      // COLLEGE OU UNIVERSIDADE
      if (
        ageRange === "18 a 29 anos" &&
        ["Aprender ou melhorar idioma", "Estudar"].includes(purpose) &&
        durationRange === "Mais de 6 meses" &&
        ["Sozinho", "Amigos", "Familia"].includes(companionship) &&
        ["Intermediario", "Avançado", "Fluente"].includes(englishLevel) &&
        ["Entre 80.000 e 120.000 reais", "Acima de 120.000 reais"].includes(
          priceRange
        )
      ) {
        const collegeProgram = await this.prisma.program.findFirst({
          where: {
            isActive: true,
            OR: [
              { title: { contains: "College", mode: "insensitive" } },
              { title: { contains: "Universidade", mode: "insensitive" } },
            ],
          },
        });

        if (collegeProgram) {
          return {
            ...collegeProgram,
            recommendationType: "College ou Universidade",
            recommendationDescription: [
              "Você tem o perfil ideal para programas de longa duração no Canadá.",
              "O College oferece cursos técnicos e profissionalizantes (1 a 3 anos).",
              "A Universidade oferece cursos acadêmicos em diversas áreas (3 a 4 anos).",
              "Ambas as opções podem abrir portas para trabalho e imigração.",
            ],
          };
        }
      }

      // CURSO DE IDIOMA - recomendação mais geral
      const languageProgram = await this.prisma.program.findFirst({
        where: {
          isActive: true,
          OR: [
            { title: { contains: "Inglês", mode: "insensitive" } },
            { title: { contains: "Francês", mode: "insensitive" } },
          ],
        },
      });

      if (languageProgram) {
        return {
          ...languageProgram,
          recommendationType: "Curso de Idioma",
          recommendationDescription: [
            "Programa ideal para aperfeiçoar suas habilidades linguísticas.",
            "Flexibilidade de duração e intensidade.",
            "Ótima opção para uma primeira experiência internacional.",
          ],
        };
      }

      // FALLBACK - programa padrão
      const defaultProgram = await this.prisma.program.findFirst({
        where: { isActive: true },
      });

      return {
        ...defaultProgram,
        recommendationType: "Programa Recomendado",
        recommendationDescription: [
          "Ainda estamos encontrando o melhor programa para você.",
          "Entre em contato para receber uma recomendação personalizada.",
        ],
      };
    } catch (error) {
      console.error("Erro ao calcular recomendação:", error);
      return null;
    }
  }

  // Método inteligente para recomendar programa
  private async getRecommendedProgram(answers: any): Promise<any> {
    try {
      const idade = answers.pergunta_1;
      const objetivo = answers.pergunta_2;
      const duracao = answers.pergunta_3;
      const companhia = answers.pergunta_4;
      const ingles = answers.pergunta_5;
      const orcamento = answers.pergunta_6;

      console.log("Analisando respostas:", {
        idade,
        objetivo,
        duracao,
        companhia,
        ingles,
        orcamento,
      });

      // HIGH SCHOOL para menores de 18 anos
      if (idade === "Menor de 18 anos") {
        const highSchoolProgram = await this.prisma.program.findFirst({
          where: {
            isActive: true,
            title: { contains: "High School", mode: "insensitive" },
          },
        });

        if (highSchoolProgram) {
          return {
            ...highSchoolProgram,
            recommendationType: "High School",
            recommendationDescription: [
              "Programa ideal para sua idade!",
              "Ensino médio completo no Canadá com imersão cultural.",
              "Inclui esportes, artes e desenvolvimento pessoal.",
            ],
          };
        }
      }

      // COLLEGE/UNIVERSIDADE para 18-29 anos com objetivo de estudar
      if (
        idade === "18 a 29 anos" &&
        ["estudar", "Estudar"].includes(objetivo) &&
        ["Mais de 6 meses", "mais de 6 meses"].includes(duracao)
      ) {
        const collegeProgram = await this.prisma.program.findFirst({
          where: {
            isActive: true,
            OR: [
              { title: { contains: "College", mode: "insensitive" } },
              { title: { contains: "Universidade", mode: "insensitive" } },
            ],
          },
        });

        if (collegeProgram) {
          return {
            ...collegeProgram,
            recommendationType: "College/Universidade",
            recommendationDescription: [
              "Perfeito para seus objetivos acadêmicos!",
              "Formação profissional reconhecida internacionalmente.",
              "Oportunidades de trabalho e imigração.",
            ],
          };
        }
      }

      // CURSO DE INGLÊS para quem quer aprender idioma
      if (
        ["aprender ou melhorar idioma", "Aprender ou melhorar idioma"].includes(
          objetivo
        )
      ) {
        const englishProgram = await this.prisma.program.findFirst({
          where: {
            isActive: true,
            title: { contains: "Inglês", mode: "insensitive" },
          },
        });

        if (englishProgram) {
          return {
            ...englishProgram,
            recommendationType: "Curso de Inglês",
            recommendationDescription: [
              "Ideal para aperfeiçoar seu inglês!",
              "Metodologia focada nas 4 habilidades linguísticas.",
              "Flexibilidade de duração e intensidade.",
            ],
          };
        }
      }

      // TRABALHO para quem busca trabalhar
      if (["trabalhar", "Trabalhar"].includes(objetivo)) {
        const workProgram = await this.prisma.program.findFirst({
          where: {
            isActive: true,
            OR: [
              { title: { contains: "Work", mode: "insensitive" } },
              { title: { contains: "Trabalho", mode: "insensitive" } },
            ],
          },
        });

        if (workProgram) {
          return {
            ...workProgram,
            recommendationType: "Programa de Trabalho",
            recommendationDescription: [
              "Oportunidade para trabalhar no Canadá!",
              "Experiência profissional internacional.",
              "Desenvolvimento de carreira.",
            ],
          };
        }
      }

      // PROGRAMA PADRÃO - retorna primeiro programa ativo
      const defaultProgram = await this.prisma.program.findFirst({
        where: { isActive: true },
      });

      if (defaultProgram) {
        return {
          ...defaultProgram,
          recommendationType: "Programa Recomendado",
          recommendationDescription: [
            "Baseado no seu perfil, este programa pode ser interessante.",
            "Entre em contato para uma consulta personalizada.",
            "Temos várias opções que podem se adequar ao seu objetivo.",
          ],
        };
      }

      return null;
    } catch (error) {
      console.error("Erro ao buscar programa recomendado:", error);
      return null;
    }
  }
}
