import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  await prisma.unit.deleteMany();

  // Hash das senhas de teste
  const hashedPassword = await bcrypt.hash("123456", 10);

  console.log("👥 Criando usuários de teste...");

  // Usuário visitante simples para teste de login
  const testUser = await prisma.user.create({
    data: {
      firstName: "Teste",
      lastName: "Usuario",
      email: "teste@email.com",
      passwordHash: hashedPassword,
      visitante: {
        create: {},
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

  console.log("🏢 Criando unidades...");

  const brasilia = await prisma.unit.create({
    data: {
      name: "Brasília",
      phone: "61993819393",
      email: "brasilia@canadaintercambio.com",
    },
  });

  await prisma.unit.createMany({
    data: [
      {
        name: "São Paulo - Paulista",
        phone: "11966267173",
        email: "sp4@canadaintercambio.com",
      },
      {
        name: "São Paulo - Higienópolis",
        phone: "11966267173",
        email: "sp@canadaintercambio.com",
      },
      {
        name: "São Paulo - Butantã",
        phone: "11966267173",
        email: "sp4@canadaintercambio.com",
      },
      {
        name: "São Paulo - Jardins",
        phone: "11966267173",
        email: "sp2@canadaintercambio.com",
      },
      {
        name: "São Paulo - Moema",
        phone: "11966267173",
        email: "sp4@canadaintercambio.com",
      },
      {
        name: "São Paulo - Pompeia",
        phone: "11966267173",
        email: "sp@canadaintercambio.com",
      },
      {
        name: "São Paulo - Vila Mariana",
        phone: "11966267173",
        email: "sp4@canadaintercambio.com",
      },
      {
        name: "São Paulo - Ipiranga / Mooca",
        phone: "11966267173",
        email: "abc@canadaintercambio.com",
      },
      {
        name: "São Paulo - Guarulhos",
        phone: "11966267173",
        email: "abc@canadaintercambio.com",
      },
      {
        name: "ABC Paulista",
        phone: "11945756161",
        email: "abc@canadaintercambio.com",
      },
      {
        name: "Vale do Paraíba",
        phone: "12988048888",
        email: "abc@canadaintercambio.com",
      },
      {
        name: "Alphaville - Barueri",
        phone: "11966267173",
        email: "sp@canadaintercambio.com",
      },
      {
        name: "Campinas",
        phone: "11958871929",
        email: "sp2@canadaintercambio.com",
      },
      {
        name: "Rio de Janeiro",
        phone: "11966267173",
        email: "rio2@canadaintercambio.com",
      },
      {
        name: "Belo Horizonte",
        phone: "11966267173",
        email: "vendasbh@canadaintercambio.com",
      },
      {
        name: "Curitiba",
        phone: "41999012396",
        email: "abc@canadaintercambio.com",
      },
      {
        name: "Santa Catarina",
        phone: "48991306494",
        email: "santacatarina@canadaintercambio.com",
      },
      {
        name: "Porto Alegre",
        phone: "51992448528",
        email: "poa@canadaintercambio.com",
      },
      {
        name: "Caxias do Sul, Gramado, Canela e Região",
        phone: "54991673898",
        email: "caxiasdosul@canadaintercambio.com",
      },
      {
        name: "Norte e Nordeste",
        phone: "11966267173",
        email: "pernambuco@canadaintercambio.com",
      },
      {
        name: "Goiânia",
        phone: "11966267173",
        email: "goiania@canadaintercambio.com",
      },
      {
        name: "Campo Grande",
        phone: "11966267173",
        email: "goiania@canadaintercambio.com",
      },
      {
        name: "Vancouver",
        phone: "16043540611",
        email: "info@canadaintercambio.com",
      },
      {
        name: "Toronto",
        phone: "16043540611",
        email: "info@canadaintercambio.com",
      },
    ],
  });

  console.log("🔗 Associando todos os usuários à unidade de Brasília...");

  if (brasilia) {
    await prisma.user.updateMany({
      data: {
        nearestUnitId: brasilia.id,
      },
    });
  }

  console.log("📚 Criando programas...");

  // Curso de Francês (Geral)
  const francesProgram = await prisma.program.create({
    data: {
      title: "Curso de Francês (Geral)",
      description:
        "Curso completo de francês para todos os níveis com foco global no idioma",
      durationWeeks: 12,
      country: "Canadá",
      price: 45000.0,
      requirements: "Nenhum requisito específico",
      isActive: true,

      // Dados detalhados
      focus: "Aprender o idioma de forma global",
      method:
        "Na parte da manhã, desenvolver as quatro habilidades linguísticas – leitura, escrita, audição e conversação e, na parte da tarde, o estudante pode escolher matérias eletivas",
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
      description:
        "Curso de inglês completo com foco nas quatro habilidades linguísticas",
      durationWeeks: 16,
      country: "Canadá",
      price: 55000.0,
      requirements: "Nenhum requisito específico",
      isActive: true,

      // Dados detalhados
      focus: "Aprender o idioma de forma global",
      method:
        "Na parte da manhã, desenvolver as quatro habilidades linguísticas – leitura, escrita, audição e conversação e, na parte da tarde, o estudante pode escolher matérias eletivas",
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
      description:
        "Inglês especializado para profissionais que desejam aprimorar habilidades técnicas",
      durationWeeks: 8,
      country: "Canadá",
      price: 65000.0,
      requirements: "Nível intermediário de inglês",
      isActive: true,

      // Dados detalhados
      focus:
        "Aprimorar as habilidades de comunicação do idioma dentro da sua área de atuação, vivenciando assuntos da indústria",
      method:
        "Aulas focadas em vocabulário específico da área profissional com imersão prática",
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
      description:
        "Programa de 4 a 12 semanas que permite imersão cultural e excelência acadêmica em período mais curto",
      durationWeeks: 8,
      country: "Canadá",
      price: 25000.0,
      requirements:
        "Estar cursando o ensino médio, nível intermediário de inglês ou francês",
      isActive: true,

      // Dados detalhados
      focus:
        "Experiência de imersão cultural e acadêmica no sistema educacional canadense",
      method:
        "Imersão completa no sistema educacional canadense com infraestrutura moderna",
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
      description:
        "Intercâmbio de um semestre no ensino médio canadense - Sistema Semestered",
      durationWeeks: 20,
      country: "Canadá",
      price: 85000.0,
      requirements:
        "Estar cursando o ensino médio, nível intermediário de inglês ou francês",
      isActive: true,

      // Dados detalhados
      focus: "Experiência acadêmica completa no ensino médio canadense",
      method:
        "Os estudantes cursam apenas 4 matérias ao longo do semestre acadêmico. É o sistema adotado pela maioria das escolas",
      type: "Intercâmbio Acadêmico - Semestered",
      workload:
        "Tempo integral com currículo que incentiva prática de esportes e artes",
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
      description:
        "Intercâmbio de um ano completo no ensino médio canadense - Sistema Linear",
      durationWeeks: 40,
      country: "Canadá",
      price: 150000.0,
      requirements:
        "Estar cursando o ensino médio, nível intermediário de inglês ou francês",
      isActive: true,

      // Dados detalhados
      focus:
        "Experiência acadêmica completa com certificação no sistema educacional canadense",
      method:
        "Os alunos têm a oportunidade de cursar até 8 matérias durante o semestre - Sistema Linear",
      type: "Intercâmbio Acadêmico - Linear",
      workload:
        "Tempo integral com currículo que incentiva prática de esportes e artes",
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

  // High School Program
  const highSchoolProgram = await prisma.program.create({
    data: {
      title: "High School no Canadá",
      description:
        "Programa de ensino médio completo para estudantes internacionais entre 14 e 18 anos",
      durationWeeks: 40, // 1 ano acadêmico
      country: "Canadá",
      price: 125000.0,
      requirements:
        "Idade entre 14 e 18 anos, histórico escolar, comprovante de inglês intermediário",
      isActive: true,

      // Dados detalhados
      focus: "Educação secundária completa com imersão cultural",
      method:
        "Currículo canadense completo com esportes, artes e atividades extracurriculares",
      type: "Ensino Médio",
      workload: "Tempo integral (30-35 horas por semana)",
      languageLevel: "Intermediário ao avançado",
      minAge: 14,
      maxAge: 18,
      minDuration: 20, // 1 semestre
      maxDuration: 40, // 1 ano
      priceRange: "Acima de 120.000 reais",

      // Critérios para matching
      targetAgeRange: "menor de 18 anos",
      purpose: "estudar",
      durationRange: "mais de 6 meses",
      companionshipType: "qualquer",
      englishLevel: "intermediario",
    },
  });

  // College Program
  const collegeProgram = await prisma.program.create({
    data: {
      title: "College Técnico no Canadá",
      description:
        "Programas técnicos e profissionalizantes em diversas áreas com possibilidade de imigração",
      durationWeeks: 78, // 1.5 anos
      country: "Canadá",
      price: 180000.0,
      requirements:
        "Ensino médio completo, inglês avançado, carta de motivação",
      isActive: true,

      // Dados detalhados
      focus: "Formação técnica com foco profissional",
      method: "Combinação de teoria e prática com estágios obrigatórios",
      type: "Educação Técnica Superior",
      workload: "Tempo integral (25-30 horas por semana)",
      languageLevel: "Avançado ao fluente",
      minAge: 18,
      maxAge: 35,
      minDuration: 52, // 1 ano
      maxDuration: 156, // 3 anos
      priceRange: "Acima de 120.000 reais",

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
      description:
        "Graduação universitária no Canadá com foco acadêmico e oportunidade de imigração",
      durationWeeks: 156,
      country: "Canadá",
      price: 280000.0,
      requirements:
        "17 anos +, Certificado de conclusão do Ensino Médio, Proficiência em inglês (TOEFL/IELTS) ou francês (TEF)",
      isActive: true,

      // Dados detalhados
      focus:
        "Foco acadêmico em diversas áreas, como ciências, humanidades, artes, engenharia, medicina, finanças, entre outras",
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
      description:
        "Master in Business Administration com foco em desenvolvimento de liderança",
      durationWeeks: 80,
      country: "Canadá",
      price: 250000.0,
      requirements:
        "Graduação completa, experiência profissional comprovada, nível fluente de inglês",
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
      description:
        "Mestrado acadêmico no Canadá com foco em pesquisa e especialização",
      durationWeeks: 80,
      country: "Canadá",
      price: 220000.0,
      requirements:
        "Graduação completa, nível fluente de inglês, projeto de pesquisa",
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
              "40 anos ou mais",
            ],
            isRequired: true,
            order: 1,
          },
          {
            question: "O que você busca no intercâmbio?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Aprender ou melhorar idioma",
              "Estudar",
              "Trabalhar",
              "Ferias",
            ],
            isRequired: true,
            order: 2,
          },
          {
            question: "Qual o máximo de tempo que você tem disponível?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Ate 1 mês",
              "1 a 3 meses",
              "4 a 6 meses",
              "Mais de 6 meses",
            ],
            isRequired: true,
            order: 3,
          },
          {
            question: "Você prefere viajar sozinho ou acompanhado?",
            questionType: "SINGLE_CHOICE",
            options: ["Sozinho", "Amigos", "Grupo", "Familia"],
            isRequired: true,
            order: 4,
          },
          {
            question: "Qual o seu nível de inglês?",
            questionType: "SINGLE_CHOICE",
            options: ["Iniciante", "Intermediario", "Avançado", "Fluente"],
            isRequired: true,
            order: 5,
          },
          {
            question: "Qual a sua faixa de orçamento?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Ate 15.000 reais",
              "Entre 15.000 e 80.000 reais",
              "Entre 80.000 e 120.000 reais",
              "Acima de 120.000 reais",
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
        orcamento: "Entre 30.000 e 80.000 reais",
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

  const quizInformativo = await prisma.quiz.create({
    data: {
      title: "Quiz Informativo sobre o Programa de Intercâmbio",
      type: "SIMULACAO",
      questions: {
        create: [
          {
            question:
              "Qual dos fatores geralmente é necessário para participar deste programa?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Ter cidadania canadense",
              "Possuir proficiência no idioma exigido",
              "Já ter feito outro intercâmbio anteriormente",
              "Ter mais de 30 anos obrigatoriamente",
            ],
            isRequired: true,
            order: 1,
          },
          {
            question: "Qual a média de tempo de duração deste programa?",
            questionType: "SINGLE_CHOICE",
            options: [
              "De 1 a 2 semanas",
              "De 1 a 3 meses",
              "De 3 a 6 meses",
              "1 ano ou mais",
            ],
            isRequired: true,
            order: 2,
          },
          {
            question:
              "Qual das opções melhor descreve o objetivo geral deste programa?",
            questionType: "SINGLE_CHOICE",
            options: [
              "Obter visto de trabalho para imigrar",
              "Alcançar um objetivo específico como aprender, estudar, trabalhar ou vivenciar uma nova cultura",
              "Realizar estágio obrigatório em empresas locais",
              "Preparar-se para concursos públicos no Brasil",
            ],
            isRequired: true,
            order: 3,
          },
          {
            question:
              "Qual é, geralmente, a idade mínima para participar deste programa?",
            questionType: "SINGLE_CHOICE",
            options: [
              "14 anos ou mais",
              "17 anos ou mais",
              "18 anos ou mais",
              "Qualquer idade",
            ],
            isRequired: true,
            order: 4,
          },
          {
            question:
              "Qual das opções abaixo pode influenciar diretamente o valor total deste programa?",
            questionType: "SINGLE_CHOICE",
            options: [
              "O número de seguidores do participante nas redes sociais",
              "A estação do ano em que o aluno pretende viajar",
              "O tempo de duração e o tipo de programa escolhido",
              "O país de origem do participante",
            ],
            isRequired: true,
            order: 5,
          },
        ],
      },
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
