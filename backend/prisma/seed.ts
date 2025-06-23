import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  console.log("🗑️  Limpando dados existentes...");
  await prisma.quizResult.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.program.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.intercambista.deleteMany();
  await prisma.visitante.deleteMany();
  await prisma.user.deleteMany();

  console.log("👥 Criando usuários de teste...");
  await prisma.user.createMany({
    data: [
      {
        firstName: "João",
        lastName: "Silva",
        email: "joao.silva@email.com",
        passwordHash: "senha123",
      },
      {
        firstName: "Maria",
        lastName: "Santos",
        email: "maria.santos@email.com",
        passwordHash: "senha123",
      },
    ],
  });

  const adminUser = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "Sistema",
      email: "admin@sistema.com",
      passwordHash: "admin123",
      admin: {
        create: {
          internalRole: "SUPERADMIN",
        },
      },
    },
  });

  const visitanteUser = await prisma.user.create({
    data: {
      firstName: "Carlos",
      lastName: "Visitante",
      email: "carlos.visitante@email.com",
      passwordHash: "senha123",
      visitante: {
        create: {
          quizProfileResult: { perfil: "explorador" },
          simulationResult: { pontuacao: 85 },
        },
      },
    },
  });

  const intercambistaUser = await prisma.user.create({
    data: {
      firstName: "Ana",
      lastName: "Inter",
      email: "ana.inter@email.com",
      passwordHash: "senha123",
      intercambista: {
        create: {
          emergencyContactName: "Mãe da Ana",
          emergencyContactPhone: "(61) 99999-9999",
          contractId: 101,
        },
      },
    },
  });

  await prisma.program.create({
    data: {
      title: "Curso de Inglês no Canadá",
      description: "Curso intensivo com duração de 12 semanas",
      durationWeeks: 12,
      country: "Canadá",
      price: 7800.0,
      requirements: "Ensino médio completo",
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: "Teste de Perfil",
      type: "PERFIL",
      questions: {
        create: [
          {
            question: "Você prefere ambientes urbanos ou naturais?",
            options: ["Urbanos", "Naturais"],
            correctOption: null,
          },
          {
            question: "Você tem passaporte?",
            options: ["Sim", "Não"],
          },
        ],
      },
    },
    include: { questions: true },
  });

  await prisma.quizResult.create({
    data: {
      userId: visitanteUser.id,
      quizId: quiz.id,
      score: 95,
      resultData: {
        perfil: "aventureiro",
      },
    },
  });

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
