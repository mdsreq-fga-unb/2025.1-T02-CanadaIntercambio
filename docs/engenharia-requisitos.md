# Engenharia de Requisitos

## Atividades e Técnicas de ER

A Engenharia de Requisitos (ER) abrange um conjunto de atividades operacionais fundamentais para a construção de software que atenda às reais necessidades dos usuários e objetivos organizacionais. Essas atividades fornecem o alicerce sobre o qual todo o desenvolvimento de software é construído. Existem seis atividades principais da ER (MARSICANO, 2025) : Elicitação e Descoberta, Análise e Consenso, Declaração, Representação, Verificação e Validação, e Organização e Atualização.

**Elicitação e descoberta:**

Essa atividade dá início à Engenharia de Requisitos e busca entender as reais necessidades dos stakeholders. No CanadaWay, a elicitação ocorre de forma iterativa e incremental, característica do modelo **RAD**, com foco em ciclos curtos de validação com o cliente.
As principais fontes de informação são os intercambistas, a equipe da Canada Intercambio e o domínio do negócio. Técnicas como **entrevistas, reuniões com stakeholders e análise de processos atuais são usadas para levantar os requisitos iniciais**.
A cada protótipo apresentado, o feedback recebido gera novos aprendizados, refinando os requisitos antes da codificação. Isso garante alinhamento constante com os objetivos do projeto e agilidade para reagir a mudanças.

**Análise e consenso:**

Após o levantamento inicial, os requisitos brutos são analisados para identificar lacunas, ambiguidade, redundância ou conflitos. No CanadaWay, essa análise é feita de forma colaborativa com a equipe da Canada Intercambio, usando técnicas como **revisões em grupo, discussões técnicas e workshops de priorização.**
Durante essas sessões, os requisitos são refinados com base no feedback obtido nos ciclos de prototipação, promovendo o **consenso entre as partes interessadas** sobre o que é prioritário, viável e necessário.
Essa prática é essencial dentro do RAD, pois permite que o escopo evolua conforme o entendimento do problema amadurece. A equipe avalia impacto, dependências técnicas e esforço estimado a cada iteração, garantindo que as decisões sejam tomadas com base em valor de negócio e viabilidade técnica.

**Declaração de requisitos:**

A declaração no CanadaWay não segue modelos engessados, já que ela é feita de forma leve, fluida e adaptável, como pede o RAD. Utilizamos **histórias de usuário, descrições em linguagem natural e critérios de aceitação**, com diferentes níveis de detalhe dependendo da complexidade da funcionalidade.
Frases como "Como intercambista, quero visualizar meu cronograma para me organizar melhor" são comuns, assim como a complementação dessas histórias com protótipos visuais validados.
Ao invés de depender de documentação extensa, a equipe opta por manter os requisitos claros, compreensíveis e disponíveis dentro das ferramentas de backlog e design (ex: Figma), permitindo alinhamento contínuo com o cliente em tempo real.

**Representação de requisitos:**

A principal forma de representação dos requisitos no CanadaWay é visual: **protótipos navegáveis, wireframes, mockups**, tudo no estilo RAD.
Esses artefatos não só facilitam a validação por parte do cliente, mas também servem como referência direta para o time de desenvolvimento implementar as funcionalidades.
Quando necessário, diagramas complementares (como fluxos de interação ou mapas de navegação) são utilizados para descrever regras mais complexas, especialmente em funcionalidades críticas como o simulador de orçamento e o agendamento de atendimento.
A representação é sempre voltada para facilitar a comunicação e reduzir mal-entendidos — a ideia é ver o sistema ganhando forma e se ajustando com base no uso real.

**Verificação e Validação de Requisitos:**

No processo RAD, validação é constante. A cada entrega de protótipo, a equipe coleta **feedback imediato do cliente**, o que permite ajustar os requisitos de forma iterativa e sem burocracia.
No CanadaWay, a validação acontece nas reuniões quinzenais de sprint review e nos testes de uso com a equipe da Canada Intercambio e usuários reais (quando possível).
Além disso, a equipe também faz **verificações internas** baseadas nos critérios de aceitação definidos previamente, garantindo que os requisitos implementados estejam corretos, consistentes e alinhados com os objetivos do negócio.
Esse ciclo rápido de **testar–ajustar–confirmar** garante que o software entregue seja o mais próximo possível da necessidade real do usuário.

**Organização e Atualização de Requisitos:**

Como o projeto segue o RAD, os requisitos não são fixos — eles evoluem conforme o produto é testado e usado.
Por isso, a equipe organiza tudo em um backlog vivo, priorizado com base no valor entregue a cada iteração. Os itens mais importantes ficam detalhados, enquanto os menos urgentes permanecem em formato mais genérico até sua vez chegar.
As mudanças são bem-vindas e tratadas como parte natural do processo. Sempre que um novo insight surgir, ele entra no backlog, passa por refinamento e entra no ciclo de prototipação.
Ferramentas como o Figma (para protótipos, mapeamento e priorização) ajudam a manter essa organização transparente e colaborativa, tanto para a equipe quanto para o cliente.

## Engenharia de Requisitos e o "Nome do Processo de ESW"

| Fases do processo | Atividades ER             | Prática                      | Técnica                          | Resultado esperado                             |
|-------------------|---------------------------|------------------------------|----------------------------------|------------------------------------------------|
| Requisitos        | Elicitação e descoberta   |                              | Brainstorming                    | Lista de Requisitos RFs e RNFs                 |
|                   |                           |                              |                                  | Proposta de solução                            |
|                   |                           |                              | Análise de Concorrentes          | Tabela comparativa de concorrentes             |
|                   |                           |                              | Análise de stakeholders          | Lista de Personas                              |
|                   |                           |                              |                                  | Descrição do público-alvo                      |
| Requisitos        | Análise e consenso        |                              | Entrevista                       | Lista de Requisitos RFs refinada               |
| Requisitos        | Declaração                |                              | Especificação de requisitos      | Especificação de Requisitos RFs e RNFs         |
|                   |                           |                              | User story mapping               | User story                                     |
| Design            | Representação             |                              | Prototipagem                     | Protótipo de alta fidelidade                   |
| Design            | Verificação e validação   |                              | Feedback                         | Checklist de ajustes                           |
| Design            | Organização e atualização |                              | MoSCoW                           | Backlog priorizado                             |
| Construção        | Verificação e validação   |                              | Feedback                         | Checklist de ajustes                           |
| Construção        | Organização e atualização |                              | Feedback                         | Backlog atualizado                             |
|                   |                           |                              | User story Mapping               |                                                |