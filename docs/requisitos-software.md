# Requisitos de Software

## Lista de Requisitos Funcionais 

O sistema da Canada Intercambio foi projetado para atender três perfis de usuários: **potenciais intercambistas**, **intercambistas contratados** e a **própria empresa**.

- **Potenciais intercambistas** têm acesso a criação e edição de conta, testes de perfil, quizzes, visualização dinâmica de programas, simulador de custos, chatbot e promoções filtráveis.
- **Intercambistas contratados** podem visualizar contratos, cronogramas, contagem regressiva, contatos de emergência e dicas sobre o destino.
- **A empresa** pode gerenciar perfis, visualizar dados dos clientes, administrar contratos, documentos, promoções e programas.

Essas funcionalidades apoiam a **captação de clientes**, reduzem atendimentos repetitivos e oferecem suporte contínuo aos usuários ao longo do processo de intercâmbio.

---

## Tabela de Requisitos Funcionais

| Código | Requisito | Objetivo | Referente a |
|--------|-----------|----------|-------------|
| RF01 | Registrar-se como potencial intercambista, preenchendo dados básicos (nome, sobrenome, email, telefone com DDD, cidade, qual a unidade mais próxima do usuário, senha, confirmar senha) | 1 | Potencial Intercambista |
| RF02 | Fazer login na plataforma como potencial intercambista, intercambista e administrador | 1 | Potencial Intercambista |
| RF03 | Editar perfil na plataforma como potencial intercambista e administrador | 1 | Potencial Intercambista |
| RF04 | Excluir conta da plataforma como potencial intercambista, intercambista e administrador | 1 | Potencial Intercambista |
| RF05 | Responder um teste para identificar o perfil ideal de intercâmbio do usuário com base nas respostas. | 1, 2 | Potencial Intercambista |
| RF06 | Navegar por programas com recursos visuais interativos, filtros e destaques. | 1, 2 | Potencial Intercambista |
| RF07 | Responder um quiz específico sobre os programas da Canada Intercambio para verificar o entendimento do usuário sobre as opções disponíveis. | 1, 2 | Potencial Intercambista |
| RF08 | Responder um quiz de nivelamento de inglês com perguntas objetivas elaboradas para avaliar o domínio da língua. | 1, 2 | Potencial Intercambista |
| RF09 | Responder um quiz sobre aspectos culturais e geográficos do Canadá. | 1, 2 | Potencial Intercambista |
| RF10 | Visualizar sugestão de programa com base nas respostas dos quizzes e testes. | 1, 2 | Potencial Intercambista |
| RF11 | Simular o custo estimado dos programas de intercâmbio | 1, 2 | Potencial Intercambista |
| RF12 | Visualizar respostas para dúvidas frequentes | 1, 2 | Potencial Intercambista |
| RF13 | Acessar uma área com promoções ativas. | 1 | Potencial Intercambista |
| RF14 | Visualizar informações detalhadas de cada programa (duração, país, valor, requisitos) | 1 | Potencial Intercambista |
| RF15 | Solicitar contato com um especialista da Canada Intercambio | 2 | Potencial Intercambista |
| RF16 | Editar perfil na plataforma como intercambista já matriculado (como contato de emergência) | 3 | Intercambista |
| RF17 | Acessar o contrato digital assinado do programa de intercâmbio contratado. | 3 | Intercambista |
| RF18 | Visualizar atividades no cronograma do programa de intercâmbio | 3 | Intercambista |
| RF19 | Criar conta como empresa preenchendo dados básicos (nome, sobrenome, email corporativo, senha, confirmar senha, número, função, filial) | 1, 3 | Empresa |
| RF20 | Alterar tipo de conta de um potencial intercambista para uma conta de intercambista após um fechamento de contrato. | 1, 3 | Empresa |
| RF21 | Consultar informações preenchidas e perfil do potencial intercambista para atendimento. | 2 | Empresa |
| RF22 | Consultar respostas e recomendações do quiz do programa | 1, 2 | Empresa |
| RF23 | Consultar o nível de inglês do aluno baseado no quiz | 1, 2 | Empresa |
| RF24 | Ver desempenho do aluno no quiz cultural | 1, 2 | Empresa |
| RF25 | Cadastrar o contrato do intercambista na plataforma | 3 | Empresa |
| RF26 | Inserir as atividades no cronograma de cada programa | 3 | Empresa |
| RF27 | Editar as atividades no cronograma de cada programa | 3 | Empresa |
| RF28 | Adicionar promoções | 1 | Empresa |
| RF29 | Atualizar informações de programas existentes | 2 | Empresa |
| RF30 | Cadastrar novos programas de intercâmbio | 2 | Empresa |
| RF31 | Inserir dados de novos intercambistas contratados | 3 | Empresa |
| RF32 | Excluir conta do intercambista após a conclusão do programa |

---

## Lista de Requisitos Não-Funcionais 

Os requisitos não funcionais do sistema Canada Intercambio garantem qualidade, segurança e eficiência na experiência do usuário. O sistema é intuitivo e acessível em diferentes dispositivos (smartphones, tablets e PCs), com tempo de aprendizado inferior a 10 minutos. Dados sensíveis são protegidos por criptografia e o sistema segue a LGPD.

O desempenho é otimizado, com respostas em até 3 segundos nas funcionalidades principais e 2 segundos no chatbot. A disponibilidade é de 99% do tempo. O sistema é escalável, compatível com Android e iOS lançados nos últimos 3 anos e preparado para futuras integrações com sistemas internos. Um painel administrativo permite atualização de conteúdos sem necessidade técnica.

- **Classificação URPS+**


| **Código**  | **Descrição**                                                                                                                                                                                                 |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| RNF01   | **Usabilidade (Usability):** Ao menos 90% dos usuários de teste devem conseguir,sem ajuda externa, realizar tarefas essenciais como criar conta na plataforma, realizar quiz de perfil ou programa, visualizar programas disponíveis, acessar a área com curiosidades, notícias e pontos turísticos do destino contratado, e visualizar a contagem regressiva (em dias) para o início do intercâmbio, tudo em até 10 minutos. A interface deve ser responsiva, exibindo corretamente todos os elementos em dispositivos com largura entre 360px (celular), validada por testes em navegadores padrão (Chrome, Firefox e Safari) e compatível com dispositivos Android e iOS lançados nos últimos 3 anos. |
| RNF02   | **Confiabilidade (Reliability):** Os dados de emergência e pessoais devem ser protegidos com criptografia. O sistema deve seguir a LGPD, garantindo consentimento do usuário e possibilidade de exclusão de dados, promovendo segurança e conformidade legal. |
| RNF03   | **Desempenho (Performance):** O sistema deve apresentar tempo de resposta inferior a 3 segundos para simulações e acessos às funcionalidades principais. |
| RNF04   | **Suportabilidade (Supportability):** O sistema deve suportar até 500 usuários ativos simultâneos sem degradação de performance (tempo de resposta ≤ 3s). Deve ser compatível com dispositivos Android e iOS lançados nos últimos 3 anos, garantindo estabilidade e cobertura ampla entre diferentes plataformas. |
