# Requisitos de Software

## Lista de Requisitos Funcionais 

O sistema da Canada Intercambio foi projetado para atender três perfis de usuários: **potenciais intercambistas**, **intercambistas contratados** e a **própria empresa**.

- **Potenciais intercambistas** têm acesso a criação e edição de conta, testes de perfil, quizzes, visualização dinâmica de programas, simulador de custos, chatbot e promoções filtráveis.
- **Intercambistas contratados** podem visualizar contratos, cronogramas, contagem regressiva, contatos de emergência e dicas sobre o destino.
- **A empresa** pode gerenciar perfis, visualizar dados dos clientes, administrar contratos, documentos, promoções e programas.

Essas funcionalidades apoiam a **captação de clientes**, reduzem atendimentos repetitivos e oferecem suporte contínuo aos usuários ao longo do processo de intercâmbio.

## Tabela de Requisitos Funcionais

| Código  | Requisito                                                                 | Objetivo                  | Referente a               |
|---------|---------------------------------------------------------------------------|---------------------------|---------------------------|
| RF01    | Criar conta na plataforma                                                 | 1                         | Potencial Intercambista   |
| RF02    | Fazer login na plataforma                                                 | 1                         | Potencial Intercambista   |
| RF03    | Editar perfil na plataforma                                               | 1                         | Potencial Intercambista   |
| RF04    | Excluir conta da plataforma                                               | 1                         | Potencial Intercambista   |
| RF05    | Realizar teste de perfil gamificado de intercâmbio                        | 1, 2                      | Potencial Intercambista   |
| RF06    | Visualizar programas de intercâmbio de forma mais dinâmica               | 1, 2                      | Potencial Intercambista   |
| RF07    | Realizar quiz do programa da Canada Intercâmbio                           | 1, 2                      | Potencial Intercambista   |
| RF08    | Realizar quiz de nivelamento de inglês                                    | 1, 2                      | Potencial Intercambista   |
| RF09    | Realizar quiz cultural sobre o Canadá                                     | 1, 2                      | Potencial Intercambista   |
| RF10    | Visualizar programa recomendado com base no quiz                          | 1, 2                      | Potencial Intercambista   |
| RF11    | Simular o custo estimado dos programas de intercâmbio                     | 1, 2                      | Potencial Intercambista   |
| RF12    | Esclarecer dúvidas comuns com chatbot sobre programas de intercâmbio      | 1, 2                      | Potencial Intercambista   |
| RF13    | Visualizar promoções gerais                                               | 1                         | Potencial Intercambista   |
| RF14    | Visualizar informações específicas de cada programa                       | 1                         | Potencial Intercambista   |
| RF15    | Poder falar com o especialista após realizar o quiz de programas específicos| 2                         | Potencial Intercambista   |
| RF16    | Fazer login na plataforma                                                 | 3                         | Intercambista             |
| RF17    | Editar perfil na plataforma                                               | 3                         | Intercambista             |
| RF18    | Visualizar notícias sobre o local de intercâmbio do programa contratado   | 3                         | Intercambista             |
| RF19    | Acompanhar contagem regressiva para o início do intercâmbio              | 3                         | Intercambista             |
| RF20    | Visualizar contrato do programa                                           | 3                         | Intercambista             |
| RF21    | Cadastrar contato de emergência                                           | 3                         | Intercambista             |
| RF22    | Visualizar dicas sobre o local de intercâmbio do programa contratado      | 3                         | Intercambista             |
| RF23    | Visualizar atividades no cronograma do programa de intercâmbio            | 3                         | Intercambista             |
| RF24    | Criar perfil                                                              | 1, 3                      | Empresa                   |
| RF25    | Editar perfil                                                             | 1, 3                      | Empresa                   |
| RF26    | Excluir conta                                                             | 1, 3                      | Empresa                   |
| RF27    | Acessar dados do potencial intercambista para momento do atendimento      | 2                         | Empresa                   |
| RF28    | Acessar resultado do quiz do programa                                     | 1, 2                      | Empresa                   |
| RF29    | Acessar resultado do quiz de nivelamento de inglês                        | 1, 2                      | Empresa                   |
| RF30    | Acessar resultado do quiz cultural sobre o Canadá                         | 1, 2                      | Empresa                   |
| RF31    | Cadastrar contrato                                                        | 3                         | Empresa                   |
| RF32    | Cadastrar atividades no cronograma do programa de intercâmbio             | 3                         | Empresa                   |
| RF33    | Adicionar promoções                                                       | 1                         | Empresa                   |
| RF34    | Editar programas                                                           | 2                         | Empresa                   |
| RF35    | Adicionar programa                                                        | 2                         | Empresa                   |
| RF36    | Cadastrar intercambista                                                   | 3                         | Empresa                   |
| RF37    | Excluir conta do intercambista                                            | 3                         | Empresa                   |


## Lista de Requisitos Não-Funcionais 

Os requisitos não funcionais do sistema Canada Intercambio garantem qualidade, segurança e eficiência na experiência do usuário. O sistema é intuitivo e acessível em diferentes dispositivos (smartphones, tablets e PCs), com tempo de aprendizado inferior a 10 minutos. Dados sensíveis são protegidos por criptografia e o sistema segue a LGPD.

O desempenho é otimizado, com respostas em até 3 segundos nas funcionalidades principais e 2 segundos no chatbot. A disponibilidade é de 99% do tempo. O sistema é escalável, compatível com Android e iOS lançados nos últimos 3 anos e preparado para futuras integrações com sistemas internos. Um painel administrativo permite atualização de conteúdos sem necessidade técnica.

| **Código**  | **Descrição**                                                                                                                                                                                                 |
|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| RNF01   | **Usabilidade (Usability):** O sistema deve ser acessível e fácil de usar por diferentes perfis de usuários. A interface deve ser responsiva (adaptada a celular e tablet) e o tempo de aprendizado para uso básico deve ser inferior a 10 minutos, promovendo uma navegação intuitiva e eficiente. |
| RNF02   | **Confiabilidade (Reliability):** Os dados de emergência e pessoais devem ser protegidos com criptografia. O sistema deve seguir a LGPD, garantindo consentimento do usuário e possibilidade de exclusão de dados, promovendo segurança e conformidade legal. |
| RNF03   | **Desempenho (Performance):** O sistema deve apresentar tempo de resposta inferior a 3 segundos para simulações e acessos às funcionalidades principais. O chatbot deve responder em até 2 segundos, mesmo em horários de pico. |
| RNF04   | **Suportabilidade (Supportability):** O sistema deve ser escalável para suportar o aumento no número de usuários. Deve ser compatível com dispositivos Android e iOS lançados nos últimos 3 anos, garantindo estabilidade e cobertura ampla entre diferentes plataformas. |



| **Tipo**           | **Requisito**                                                                                     |
|----------------|-----------------------------------------------------------------------------------------------|
| Do Produto | O sistema deve ser acessível e fácil de usar por diferentes perfis de usuários.              |
|                | O tempo de aprendizado para uso básico deve ser inferior a 10 minutos.                       |
|                | Interface responsiva (adaptada a celular e tablet).                                          |
|                | Tempo de resposta inferior a 3 segundos para simulações e acessos.                           |
|                | Chatbot deve responder em até 2 segundos.                                                    |
|                | O sistema deve estar disponível 99% do tempo.                                                |
|                | Os dados de emergência e pessoais devem ser protegidos com criptografia.                     |
|                | O sistema deve ser escalável para suportar aumento no número de usuários.                    |
|                | Possibilidade de inserção de conteúdos (cronogramas, dicas, documentos) via painel admin.    |
| Externo    | O app deve seguir a LGPD, com consentimento e opção de exclusão de dados.                    |
| Organizacional | Compatibilidade com Android e iOS lançados nos últimos 3 anos.                         |
|                | Integração futura com CRM ou sistemas internos da empresa.                                   |
