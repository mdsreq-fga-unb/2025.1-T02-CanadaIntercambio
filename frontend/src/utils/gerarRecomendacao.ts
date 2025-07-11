type QuizAnswers = {
  [key: number]: string;
};

type ResultadoQuiz = {
  titulo: string;
  descricao: string[];
};

export function gerarRecomendacao(answers: QuizAnswers): ResultadoQuiz {
  const idade = answers[1];
  const objetivo = answers[2];
  const duracao = answers[3];
  const companhia = answers[4];
  const ingles = answers[5];
  const orcamento = answers[6];

  // --- HIGH SCHOOL ---
  const isHighSchool =
    ['Menor de 18 anos'].includes(idade) &&
    ['Aprender ou melhorar idioma', 'Estudar'].includes(objetivo) &&
    ['1 a 3 meses', '4 a 6 meses', 'Mais de 6 meses'].includes(duracao) &&
    ['Sozinho', 'Amigos', 'Familia'].includes(companhia) &&
    ['Intermediario', 'Avançado', 'Fluente'].includes(ingles) &&
    ['Entre 80.000 e 120.000 reais', 'Acima de 120.000 reais'].includes(orcamento);

  if (isHighSchool) {
    return {
      titulo: 'High School',
      descricao: [
        'Programa completo para adolescentes entre 14 e 18 anos.',
        'Currículo com esportes, artes e imersão cultural.',
        'Duração de 1 semestre a 1 ano acadêmico.',
      ],
    };
  }


  // --- COLLEGE OU UNIVERSIDADE ---
    const isCollegeOuUniversidade =
    ['18 a 29 anos'].includes(idade) &&
    ['Aprender ou melhorar idioma', 'Estudar'].includes(objetivo) &&
    ['Mais de 6 meses'].includes(duracao) &&
    ['Sozinho', 'Amigos', 'Familia'].includes(companhia) &&
    ['Intermediario', 'Avançado', 'Fluente'].includes(ingles) &&
    ['Entre 80.000 e 120.000 reais', 'Acima de 120.000 reais'].includes(orcamento);

    if (isCollegeOuUniversidade) {
    return {
        titulo: 'College ou Universidade',
        descricao: [
        'Você tem o perfil ideal para programas de longa duração no Canadá.',
        'O College oferece cursos técnicos e profissionalizantes (1 a 3 anos).',
        'A Universidade oferece cursos acadêmicos em diversas áreas (3 a 4 anos).',
        'Ambas as opções podem abrir portas para trabalho e imigração.',
        ],
    };
    }


  /*
  // --- COLLEGE ---
  const isCollege =
    ['18 a 29 anos'].includes(idade) &&
    ['Aprender ou melhorar idioma', 'Estudar'].includes(objetivo) &&
    ['Mais de 6 meses'].includes(duracao) &&
    ['Sozinho', 'Amigos', 'Familia'].includes(companhia) &&
    ['Intermediario', 'Avançado', 'Fluente'].includes(ingles) &&
    ['Entre 80.000 e 120.000 reais', 'Acima de 120.000 reais'].includes(orcamento);

  if (isCollege) {
    return {
      titulo: 'College (Público ou Privado)',
      descricao: [
        'Cursos técnicos focados em prática profissional.',
        'Possibilidade de estágio e imigração.',
        'Duração média de 1 a 3 anos.',
      ],
    };
  }

  // --- UNIVERSIDADE ---
  const isUniversidade =
    ['18 a 29 anos'].includes(idade) &&
    ['Aprender ou melhorar idioma', 'Estudar'].includes(objetivo) &&
    ['Mais de 6 meses'].includes(duracao) &&
    ['Sozinho', 'Amigos', 'Familia'].includes(companhia) &&
    ['Intermediario', 'Avançado', 'Fluente'].includes(ingles) &&
    ['Entre 80.000 e 120.000 reais', 'Acima de 120.000 reais'].includes(orcamento);

  if (isUniversidade) {
    return {
      titulo: 'Universidade',
      descricao: [
        'Cursos acadêmicos de longa duração (3 a 4 anos).',
        'Áreas como engenharia, saúde, artes, ciências humanas.',
        'Oportunidade de imigração após a graduação.',
      ],
    };
  }
    */

  // --- FALLBACK ---
  return {
    titulo: 'Programa Acadêmico no Canadá',
    descricao: [
      'Ainda estamos encontrando o melhor programa para você.',
      'Entre em contato para receber uma recomendação personalizada.',
    ],
  };
}
