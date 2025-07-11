import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  console.log("🗑️  Limpando dados existentes...");
  await prisma.quizRecommendation.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.program.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.intercambista.deleteMany();
  await prisma.visitante.deleteMany();
  await prisma.user.deleteMany();

  // Hash das senhas de teste
  const hashedPassword = await bcrypt.hash('123456', 10);

  console.log("👥 Criando usuários de teste...");
  
  // Usuário visitante simples para teste de login
  const testUser = await prisma.user.create({
    data: {
      firstName: "Teste",
      lastName: "Usuario",
      email: "teste@email.com",
      passwordHash: hashedPassword,
      visitante: {
        create: {}
      },
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "Sistema",
      email: "admin@sistema.com",
      passwordHash: hashedPassword,
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
      passwordHash: hashedPassword,
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
      passwordHash: hashedPassword,
      intercambista: {
        create: {
          emergencyContactName: "Mãe da Ana",
          emergencyContactPhone: "(61) 99999-9999",
          contractId: 101,
        },
      },
    },
  });

  console.log("📚 Criando programas...");
  
  // Curso de Francês (Geral)
  const francesProgram = await prisma.program.create({
    data: {
      title: "Curso de Francês (Geral)",
      description: "Curso completo de francês para todos os níveis com foco global no idioma",
      durationWeeks: 12,
      country: "Canadá",
      price: 45000.0,
      requirements: "Nenhum requisito específico",
      isActive: true,
      
      // Dados detalhados
      focus: "Aprender o idioma de forma global",
      method: "Na parte da manhã, desenvolver as quatro habilidades linguísticas – leitura, escrita, audição e conversação e, na parte da tarde, o estudante pode escolher matérias eletivas",
      type: "Curso de Idioma",
      workload: "De 13 a 35 horas/aula por semana",
      languageLevel: "Básico ao avançado",
      minAge: 16,
      maxAge: 65,
      minDuration: 1,
      maxDuration: 52,
      priceRange: "Entre 30.000 e 80.000 reais",
      
      // Critérios para matching - permite todas as faixas etárias
      targetAgeRange: "qualquer",
      purpose: "aprender ou melhorar idioma",
      durationRange: "qualquer",
      companionshipType: "qualquer",
      englishLevel: "qualquer",
    },
  });

  // Curso de Inglês Geral
  const inglesGeralProgram = await prisma.program.create({
    data: {
      title: "Curso de Inglês Geral",
      description: "Curso de inglês completo com foco nas quatro habilidades linguísticas",
      durationWeeks: 16,
      country: "Canadá",
      price: 55000.0,
      requirements: "Nenhum requisito específico",
      isActive: true,
      
      // Dados detalhados
      focus: "Aprender o idioma de forma global",
      method: "Na parte da manhã, desenvolver as quatro habilidades linguísticas – leitura, escrita, audição e conversação e, na parte da tarde, o estudante pode escolher matérias eletivas",
      type: "Inglês Geral, Preparatório para exames de proficiência",
      workload: "Semi-Intensivo, Intensivo",
      languageLevel: "Básico ao avançado",
      minAge: 16,
      maxAge: 65,
      minDuration: 1,
      maxDuration: 52,
      priceRange: "Entre 30.000 e 80.000 reais",
      
      // Critérios para matching - permite todas as faixas etárias
      targetAgeRange: "qualquer",
      purpose: "aprender ou melhorar idioma",
      durationRange: "qualquer",
      companionshipType: "qualquer",
      englishLevel: "qualquer",
    },
  });

  // Inglês com Vocabulário Técnico
  const inglesTecnicoProgram = await prisma.program.create({
    data: {
      title: "Inglês com Vocabulário Técnico",
      description: "Inglês especializado para profissionais que desejam aprimorar habilidades técnicas",
      durationWeeks: 8,
      country: "Canadá",
      price: 65000.0,
      requirements: "Nível intermediário de inglês",
      isActive: true,
      
      // Dados detalhados
      focus: "Aprimorar as habilidades de comunicação do idioma dentro da sua área de atuação, vivenciando assuntos da indústria",
      method: "Aulas focadas em vocabulário específico da área profissional com imersão prática",
      type: "Negócios, Marketing e Vendas, Social Media, Saúde, Comissários de Bordo, Engenharia, entre outros",
      workload: "Semi-Intensivo ou Intensivo",
      languageLevel: "Intermediário ao avançado",
      minAge: 18,
      maxAge: 65,
      minDuration: 2,
      maxDuration: 24,
      priceRange: "Entre 30.000 e 80.000 reais",
      
      // Critérios para matching - preferencialmente para quem quer trabalhar
      targetAgeRange: "qualquer",
      purpose: "trabalhar",
      durationRange: "qualquer",
      companionshipType: "qualquer",
      englishLevel: "intermediário",
    },
  });

  // High School - Mini
  const highSchoolMiniProgram = await prisma.program.create({
    data: {
      title: "High School - Mini",
      description: "Programa de 4 a 12 semanas que permite imersão cultural e excelência acadêmica em período mais curto",
      durationWeeks: 8,
      country: "Canadá",
      price: 25000.0,
      requirements: "Estar cursando o ensino médio, nível intermediário de inglês ou francês",
      isActive: true,
      
      // Dados detalhados
      focus: "Experiência de imersão cultural e acadêmica no sistema educacional canadense",
      method: "Imersão completa no sistema educacional canadense com infraestrutura moderna",
      type: "Intercâmbio Acadêmico - Mini (4 a 12 semanas)",
      workload: "Tempo integral com prática de esportes e artes",
      languageLevel: "Intermediário",
      minAge: 14,
      maxAge: 18,
      minDuration: 4,
      maxDuration: 12,
      priceRange: "Até 15.000 reais",
      
      // Critérios para matching - específico para menores
      targetAgeRange: "Menor de 18 anos",
      purpose: "estudar",
      durationRange: "1 a 3 meses",
      companionshipType: "qualquer",
      englishLevel: "intermediário",
    },
  });

  // High School - 1 Semestre
  const highSchoolSemestreProgram = await prisma.program.create({
    data: {
      title: "High School - 1 Semestre",
      description: "Intercâmbio de um semestre no ensino médio canadense - Sistema Semestered",
      durationWeeks: 20,
      country: "Canadá",
      price: 85000.0,
      requirements: "Estar cursando o ensino médio, nível intermediário de inglês ou francês",
      isActive: true,
      
      // Dados detalhados
      focus: "Experiência acadêmica completa no ensino médio canadense",
      method: "Os estudantes cursam apenas 4 matérias ao longo do semestre acadêmico. É o sistema adotado pela maioria das escolas",
      type: "Intercâmbio Acadêmico - Semestered",
      workload: "Tempo integral com currículo que incentiva prática de esportes e artes",
      languageLevel: "Intermediário",
      minAge: 14,
      maxAge: 18,
      minDuration: 20,
      maxDuration: 20,
      priceRange: "Entre 80.000 e 120.000 reais",
      
      // Critérios para matching
      targetAgeRange: "Menor de 18 anos",
      purpose: "estudar",
      durationRange: "4 a 6 meses",
      companionshipType: "qualquer",
      englishLevel: "intermediário",
    },
  });

  // High School - 1 Ano
  const highSchoolAnoProgram = await prisma.program.create({
    data: {
      title: "High School - 1 Ano",
      description: "Intercâmbio de um ano completo no ensino médio canadense - Sistema Linear",
      durationWeeks: 40,
      country: "Canadá",
      price: 150000.0,
      requirements: "Estar cursando o ensino médio, nível intermediário de inglês ou francês",
      isActive: true,
      
      // Dados detalhados
      focus: "Experiência acadêmica completa com certificação no sistema educacional canadense",
      method: "Os alunos têm a oportunidade de cursar até 8 matérias durante o semestre - Sistema Linear",
      type: "Intercâmbio Acadêmico - Linear",
      workload: "Tempo integral com currículo que incentiva prática de esportes e artes",
      languageLevel: "Intermediário",
      minAge: 14,
      maxAge: 18,
      minDuration: 40,
      maxDuration: 40,
      priceRange: "Acima de 120.000 reais",
      
      // Critérios para matching
      targetAgeRange: "Menor de 18 anos",
      purpose: "estudar",
      durationRange: "mais de 6 meses",
      companionshipType: "qualquer",
      englishLevel: "intermediário",
    },
  });

  // College Privado
  const collegePrivadoProgram = await prisma.program.create({
    data: {
      title: "College Privado",
      description: "Cursos práticos e técnicos em college privado com experiência profissional no Canadá",
      durationWeeks: 80,
      country: "Canadá",
      price: 180000.0,
      requirements: "17 anos +, Ensino médio ou equivalente, Proficiência em inglês por meio de exames como TOEFL e IELTS",
      isActive: true,
      
      // Dados detalhados
      focus: "Foco em habilidades e treinamento práticos em tecnologia, negócios, saúde, turismo, design, culinária e mais",
      method: "Experiência profissional no Canadá e, em alguns casos, oportunidade de imigração",
      type: "Curta ou média duração (1 a 3 anos) - Foco em treinamento prático",
      workload: "Tempo integral com experiência prática",
      languageLevel: "Intermediário ao avançado",
      minAge: 17,
      maxAge: 65,
      minDuration: 52,
      maxDuration: 156,
      priceRange: "Acima de 120.000 reais",
      
      // Critérios para matching
      targetAgeRange: "18 a 29 anos",
      purpose: "estudar",
      durationRange: "mais de 6 meses",
      companionshipType: "qualquer",
      englishLevel: "avançado",
    },
  });

  // College Público
  const collegePublicoProgram = await prisma.program.create({
    data: {
      title: "College Público",
      description: "Cursos práticos e técnicos em college público com experiência profissional no Canadá",
      durationWeeks: 80,
      country: "Canadá",
      price: 120000.0,
      requirements: "17 anos +, Ensino médio ou equivalente, Proficiência em inglês por meio de exames como TOEFL e IELTS",
      isActive: true,
      
      // Dados detalhados
      focus: "Foco em habilidades e treinamento práticos em tecnologia, negócios, saúde, turismo, design, culinária e mais",
      method: "Experiência profissional no Canadá e, em alguns casos, oportunidade de imigração",
      type: "Curta ou média duração (1 a 3 anos) - Foco em treinamento prático",
      workload: "Tempo integral com experiência prática",
      languageLevel: "Intermediário ao avançado",
      minAge: 17,
      maxAge: 65,
      minDuration: 52,
      maxDuration: 156,
      priceRange: "Entre 80.000 e 120.000 reais",
      
      // Critérios para matching
      targetAgeRange: "18 a 29 anos",
      purpose: "estudar",
      durationRange: "mais de 6 meses",
      companionshipType: "qualquer",
      englishLevel: "avançado",
    },
  });

  // Universidade
  const universidadeProgram = await prisma.program.create({
    data: {
      title: "Universidade",
      description: "Graduação universitária no Canadá com foco acadêmico e oportunidade de imigração",
      durationWeeks: 156,
      country: "Canadá",
      price: 280000.0,
      requirements: "17 anos +, Certificado de conclusão do Ensino Médio, Proficiência em inglês (TOEFL/IELTS) ou francês (TEF)",
      isActive: true,
      
      // Dados detalhados
      focus: "Foco acadêmico em diversas áreas, como ciências, humanidades, artes, engenharia, medicina, finanças, entre outras",
      method: "Foco em pesquisa com início em Janeiro, Maio e Setembro",
      type: "Longa duração (3 a 4 anos) - Foco em pesquisa",
      workload: "Tempo integral com oportunidade de imigração",
      languageLevel: "Avançado ao fluente",
      minAge: 17,
      maxAge: 65,
      minDuration: 156,
      maxDuration: 208,
      priceRange: "Acima de 120.000 reais",
      
      // Critérios para matching
      targetAgeRange: "18 a 29 anos",
      purpose: "estudar",
      durationRange: "mais de 6 meses",
      companionshipType: "qualquer",
      englishLevel: "fluente",
    },
  });

  // MBA Program
  const mbaProgram = await prisma.program.create({
    data: {
      title: "MBA",
      description: "Master in Business Administration com foco em desenvolvimento de liderança",
      durationWeeks: 80,
      country: "Canadá",
      price: 250000.0,
      requirements: "Graduação completa, experiência profissional comprovada, nível fluente de inglês",
      isActive: true,
      
      // Dados detalhados
      focus: "Desenvolvimento de liderança e gestão empresarial",
      method: "Aulas teóricas, estudos de caso e projetos práticos",
      type: "MBA - Master in Business Administration",
      workload: "Tempo integral",
      languageLevel: "Fluente",
      minAge: 25,
      maxAge: 50,
      minDuration: 78,
      maxDuration: 104,
      priceRange: "Acima de 120.000 reais",
      
      // Critérios para matching
      targetAgeRange: "30 a 39 anos",
      purpose: "estudar",
      durationRange: "mais de 6 meses",
      companionshipType: "qualquer",
      englishLevel: "fluente",
    },
  });

  // Master Degree
  const masterDegreeProgram = await prisma.program.create({
    data: {
      title: "Master Degree",
      description: "Mestrado acadêmico no Canadá com foco em pesquisa e especialização",
      durationWeeks: 80,
      country: "Canadá",
      price: 220000.0,
      requirements: "Graduação completa, nível fluente de inglês, projeto de pesquisa",
      isActive: true,
      
      // Dados detalhados
      focus: "Especialização acadêmica com foco em pesquisa",
      method: "Pesquisa acadêmica, dissertação e aulas especializadas",
      type: "Master Degree - Mestrado Acadêmico",
      workload: "Tempo integral",
      languageLevel: "Fluente",
      minAge: 22,
      maxAge: 55,
      minDuration: 78,
      maxDuration: 104,
      priceRange: "Acima de 120.000 reais",
      
      // Critérios para matching
      targetAgeRange: "30 a 39 anos",
      purpose: "estudar",
      durationRange: "mais de 6 meses",
      companionshipType: "qualquer",
      englishLevel: "fluente",
    },
  });

  console.log("❓ Criando quiz de perfil...");
  
  const quizPerfil = await prisma.quiz.create({
    data: {
      title: "Quiz de Perfil para Intercâmbio",
      type: "PERFIL",
      questions: {
        create: [
          {
            question: "Qual a sua idade?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Menor de 18 anos",
              "18 a 29 anos", 
              "30 a 39 anos",
              "40 anos ou mais"
            ],
            isRequired: true,
            order: 1,
          },
          {
            question: "O que você busca no intercâmbio?",
            questionType: "SINGLE_CHOICE",
            options: [
              "aprender ou melhorar idioma",
              "estudar",
              "trabalhar",
              "férias"
            ],
            isRequired: true,
            order: 2,
          },
          {
            question: "Qual o máximo de tempo que você tem disponível?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Até 1 mês",
              "1 a 3 meses",
              "4 a 6 meses",
              "mais de 6 meses"
            ],
            isRequired: true,
            order: 3,
          },
          {
            question: "Você prefere viajar sozinho ou acompanhado?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Sozinho",
              "Amigos",
              "Grupo",
              "Familia"
            ],
            isRequired: true,
            order: 4,
          },
          {
            question: "Qual o seu nível de inglês?",
            questionType: "SINGLE_CHOICE",
            options: [
              "iniciante",
              "intermediário",
              "avançado",
              "fluente"
            ],
            isRequired: true,
            order: 5,
          },
          {
            question: "Qual a sua faixa de orçamento?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Até 15.000 reais",
              "Entre 30.000 e 80.000 reais",
              "Entre 80.000 e 120.000 reais",
              "Acima de 120.000 reais"
            ],
            isRequired: true,
            order: 6,
          },
        ],
      },
    },
  });

  console.log("📊 Criando resultado de quiz de exemplo...");
  
  await prisma.quizResult.create({
    data: {
      userId: visitanteUser.id,
      quizId: quizPerfil.id,
      score: 100,
      resultData: {
        idade: "18 a 29 anos",
        proposito: "aprender ou melhorar idioma",
        duracao: "4 a 6 meses",
        companhia: "Amigos",
        ingles: "intermediário",
        orcamento: "Entre 30.000 e 80.000 reais"
      },
      ageRange: "18 a 29 anos",
      purpose: "aprender ou melhorar idioma",
      durationRange: "4 a 6 meses",
      companionship: "Amigos",
      englishLevel: "intermediário",
      priceRange: "Entre 30.000 e 80.000 reais",
      recommendedProgramId: inglesGeralProgram.id,
      recommendationScore: 95.0,
    },
  });

  console.log("✅ Seed finalizado com sucesso!");
  console.log("\n🔑 CREDENCIAIS DE TESTE:");
  console.log("📧 Email: teste@email.com");
  console.log("🔒 Senha: 123456");
  console.log("👤 Tipo: visitante");
  console.log("\n📧 Admin: admin@sistema.com");
  console.log("🔒 Senha: 123456");
  console.log("👤 Tipo: admin");
  console.log("\n📚 Programas criados:");
  console.log("• Curso de Francês (Geral)");
  console.log("• Curso de Inglês Geral");
  console.log("• Inglês com Vocabulário Técnico");
  console.log("• High School - Mini");
  console.log("• High School - 1 Semestre");
  console.log("• High School - 1 Ano");
  console.log("• College Privado");
  console.log("• College Público");
  console.log("• Universidade");
  console.log("• MBA");
  console.log("• Master Degree");
  console.log("\n❓ Quiz de perfil criado com 6 perguntas");
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
