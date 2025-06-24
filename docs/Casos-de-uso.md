# Casos de Uso

## Estudo de Caso 1: PBB - HealthNet

### Product Backlog Building (PBB)

O Product Backlog Building (PBB) foi desenvolvido para o estudo de caso HealthNet, organizando as histórias de usuário de forma visual e estruturada:

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/board/Sv2EcmVULHUxMhvc9XuMxF/Untitled?node-id=0-1&embed-host=share" allowfullscreen></iframe>

[Acesse o PBB completo no Figma](https://www.figma.com/board/Sv2EcmVULHUxMhvc9XuMxF/Untitled?node-id=0-1&t=PQwmdDAlY8JaTPvL-1)

### BDD - HealthNet

#### Critérios de Aceitação Completos para PBIs do HealthNet

Este documento apresenta os critérios de aceitação completos para os Product Backlog Items (PBIs) do sistema HealthNet, seguindo o padrão BDD (Behavior-Driven Development).

[Acesse o documento completo do BDD no Google Docs](https://docs.google.com/document/d/1fwSefeXna3qyijbS4PAOcKDzwHNc-hFtlOh8QT_2yBk/edit?tab=t.0)

---

#### Persona: Maria – Recepcionista
**Feature:** Cadastrar novos pacientes  
**PBI:** Coletar informações pessoais e médicas, gerando um registro inicial, do paciente.

**Critérios de aceitação:**
- O sistema permite preencher todos os dados obrigatórios do paciente (nome, contato, CPF, dados clínicos).
- O cadastro só é salvo se todas as informações essenciais forem preenchidas corretamente.
- Um identificador único é gerado automaticamente para o paciente após o registro.

<details>
<summary><strong>BDDs (clique para expandir)</strong></summary>

```gherkin
Dado que o usuário acessa o formulário de cadastro do paciente,
Quando ele preenche os campos obrigatórios como nome, contato, CPF e dados clínicos,
Então o sistema valida e aceita o cadastro apenas se todos os campos obrigatórios forem preenchidos corretamente.

Dado que o usuário concluiu o cadastro do paciente,
Quando o sistema processa o registro,
Então um identificador único é gerado automaticamente para o paciente.
```

</details>

---

#### Persona: Maria – Recepcionista
**Feature:** Cadastrar novos pacientes  
**PBI:** Confirmar e arquivar o cadastro, garantindo a disponibilidade imediata, dos dados do paciente.

**Critérios de aceitação:**
- O sistema salva o cadastro após confirmação do preenchimento completo.
- Os dados ficam imediatamente disponíveis para consulta por usuários autorizados.
- O cadastro é armazenado de forma segura no banco de dados do sistema.

**BDDs:**
```gherkin
Dado que o usuário confirma que o cadastro do paciente está completo,
Quando ele submete o formulário,
Então o sistema salva o cadastro.

Dado que o cadastro do paciente foi salvo com sucesso,
Quando usuários autorizados acessam o sistema,
Então os dados do paciente ficam imediatamente disponíveis para consulta.

Dado que o cadastro do paciente foi submetido,
Quando o sistema armazena os dados,
Então o cadastro é guardado de forma segura no banco de dados do sistema.
```

---

#### Persona: Maria – Recepcionista
**Feature:** Visualizar histórico de pacientes  
**PBI:** Selecionar o paciente desejado, exibindo os dados clínicos e atendimentos anteriores, no histórico de todas as unidades

**Critérios de aceitação:**
- O sistema exibe corretamente os dados clínicos e as datas de atendimento, independentemente da unidade onde ocorreram.
- O usuário não consegue visualizar o histórico de pacientes se não tiver permissão adequada de acesso.
- Caso não haja atendimentos registrados, o sistema informa que não há histórico disponível.

**BDDs:**
```gherkin
Dado que o paciente possui dados clínicos e atendimentos registrados em várias unidades,
Quando o usuário autorizado acessa o histórico do paciente,
Então o sistema exibe corretamente os dados clínicos e as datas de atendimento, independentemente da unidade onde ocorreram.

Dado que um usuário tenta acessar o histórico de pacientes,
Quando ele não possui permissão adequada de acesso,
Então o sistema impede a visualização do histórico.

Dado que o paciente não possui atendimentos registrados,
Quando o usuário autorizado acessa o histórico,
Então o sistema informa que não há histórico disponível.
```

---

#### Persona: Dr. João – Clínico Geral
**Feature:** Acessar histórico médico  
**PBI:** Entrar no sistema com perfil autorizado, liberando o acesso seguro, ao prontuário do paciente.

**Critérios de aceitação:**
- Apenas usuários com perfil autorizado conseguem fazer login no sistema.
- O acesso ao prontuário é liberado somente após autenticação válida.
- O sistema registra quem acessou o prontuário, com data e hora.

**BDDs:**
```gherkin
Dado que um usuário tenta acessar o sistema,
Quando ele possui perfil autorizado,
Então ele consegue fazer login no sistema.

Dado que um usuário está tentando acessar o prontuário,
Quando ele realiza uma autenticação válida,
Então o acesso ao prontuário é liberado.

Dado que um usuário acessa o prontuário do paciente,
Quando o acesso ocorre,
Então o sistema registra o usuário, a data e a hora do acesso.
```

---

#### Persona: Dr. João – Clínico Geral
**Feature:** Acessar histórico médico  
**PBI:** Abrir o prontuário clínico completo, visualizando dados de consultas, exames e tratamentos, do paciente.

**Critérios de aceitação:**
- O sistema exibe todos os dados clínicos do paciente em um único painel.
- É possível visualizar o histórico de consultas, exames e tratamentos de forma organizada.
- Apenas usuários autorizados conseguem acessar essas informações.

**BDDs:**
```gherkin
Dado que um usuário autorizado acessa o sistema,
Quando ele visualiza o painel do paciente,
Então o sistema exibe todos os dados clínicos do paciente em um único painel.

Dado que o painel do paciente está aberto,
Quando o usuário visualiza o histórico,
Então é possível ver consultas, exames e tratamentos de forma organizada.

Dado que um usuário tenta acessar informações clínicas do paciente,
Quando ele não possui autorização,
Então o sistema bloqueia o acesso a essas informações.
```

---

#### Persona: Dr. João – Clínico Geral
**Feature:** Acessar exames  
**PBI:** Selecionar o paciente na lista de atendimentos, localizando os registros de exames realizados, no prontuário eletrônico.

**Critérios de aceitação:**
- O usuário consegue buscar e selecionar o paciente na lista de atendimentos.
- Os exames realizados aparecem organizados por data no prontuário eletrônico.
- Apenas exames vinculados ao paciente selecionado são exibidos.

**BDDs:**
```gherkin
Dado que o usuário está na lista de atendimentos,
Quando ele busca e seleciona um paciente,
Então o sistema permite que o usuário selecione o paciente desejado.

Dado que o paciente possui exames registrados,
Quando o usuário visualiza o prontuário eletrônico,
Então os exames realizados aparecem organizados por data.

Dado que o usuário está visualizando o prontuário de um paciente específico,
Quando ele acessa os exames,
Então apenas os exames vinculados ao paciente selecionado são exibidos.
```

---

#### Persona: Dr. João – Clínico Geral
**Feature:** Prescrever digitalmente  
**PBI:** Assinar eletronicamente e enviar a receita, liberando o documento de forma segura, para o paciente ou farmácia.

**Critérios de aceitação:**
- O médico autenticado consegue preencher a prescrição digital com dados do paciente, medicamentos, posologia e duração do tratamento.
- A prescrição gerada inclui assinatura eletrônica válida e informações obrigatórias conforme as regulamentações da Anvisa e CFM.
- O sistema não permite salvar ou emitir prescrições incompletas ou sem os campos obrigatórios preenchidos.

**BDDs:**
```gherkin
Dado que o médico está autenticado no sistema,
Quando ele preenche a prescrição digital com dados do paciente, medicamentos, posologia e duração do tratamento,
Então o sistema aceita o preenchimento da prescrição.

Dado que a prescrição digital foi preenchida,
Quando ela é gerada pelo sistema,
Então a prescrição inclui assinatura eletrônica válida e informações obrigatórias conforme as regulamentações da Anvisa e CFM.

Dado que o médico tenta salvar ou emitir uma prescrição,
Quando algum campo obrigatório está incompleto ou ausente,
Então o sistema não permite salvar ou emitir a prescrição.
```

---

#### Persona: Lívia – Farmacêutica
**Feature:** Acessar prescrições  
**PBI:** Abrir e verificar os detalhes da prescrição, garantindo a dispensação correta, dos medicamentos.

**Critérios de aceitação:**
- A farmacêutica autenticada consegue acessar a prescrição digital vinculada ao paciente ou ao código da receita.
- O sistema exibe todas as informações da prescrição: nome do medicamento, dosagem, posologia, data de emissão e validade.
- O sistema impede a dispensação se a receita estiver vencida, inválida ou com dados incompletos.
- Após a verificação, a farmacêutica pode registrar a dispensação parcial ou total no sistema.
- Cada dispensação fica registrada com data, hora e responsável, garantindo rastreabilidade.

**BDDs:**
```gherkin
Dado que a farmacêutica está autenticada no sistema,
Quando ela acessa a prescrição digital vinculada ao paciente ou ao código da receita,
Então o sistema exibe todas as informações da prescrição: nome do medicamento, dosagem, posologia, data de emissão e validade.

Dado que a farmacêutica está visualizando uma prescrição,
Quando a receita está vencida, inválida ou com dados incompletos,
Então o sistema impede a dispensação do medicamento.

Dado que a prescrição está válida,
Quando a farmacêutica realiza a verificação,
Então ela pode registrar a dispensação parcial ou total no sistema.

Dado que a dispensação foi registrada,
Quando a operação é concluída,
Então o sistema registra a data, hora e responsável pela dispensação, garantindo rastreabilidade.
```

---

#### Persona: Lívia – Farmacêutica
**Feature:** Liberar medicamentos  
**PBI:** Conferir informações básicas do paciente e da prescrição física, assegurando a compatibilidade do pedido, com o tratamento.

**Critérios de aceitação:**
- O sistema permite consultar os dados básicos do paciente de forma clara.
- A farmacêutica pode comparar a prescrição física com as informações do prontuário.
- O medicamento só é liberado se houver compatibilidade entre prescrição e tratamento registrado.

**BDDs:**
```gherkin
Dado que a farmacêutica deseja consultar os dados do paciente,
Quando ela acessa o sistema,
Então o sistema permite consultar os dados básicos do paciente de forma clara.

Dado que a farmacêutica possui a prescrição física em mãos,
Quando ela compara a prescrição com as informações do prontuário eletrônico,
Então o sistema permite essa comparação.

Dado que a farmacêutica está dispensando o medicamento,
Quando verifica a compatibilidade entre a prescrição e o tratamento registrado,
Então o medicamento só é liberado se houver compatibilidade.
```

---

#### Persona: Rafael – Coordenador de Agendamento
**Feature:** Confirma consultas próximas com pacientes  
**PBI:** Programar o sistema para enviar lembretes automáticos, disparando notificações por SMS, e-mail ou WhatsApp, aos pacientes com consultas agendadas.

**Critérios de aceitação:**
- O sistema identifica automaticamente as consultas agendadas com pelo menos 24 horas de antecedência.
- O sistema envia lembretes por SMS, e-mail ou WhatsApp conforme o canal preferido informado pelo paciente.
- Os lembretes contêm informações claras sobre data, hora, profissional e local da consulta.
- O paciente recebe apenas um lembrete por canal para cada consulta agendada.

**BDDs:**
```gherkin
Dado que há consultas agendadas com pelo menos 24 horas de antecedência,
Quando o sistema processa os agendamentos,
Então ele identifica automaticamente essas consultas.

Dado que o sistema identificou uma consulta agendada,
Quando envia o lembrete,
Então o envio ocorre pelo canal preferido informado pelo paciente, seja SMS, e-mail ou WhatsApp.

Dado que o paciente recebe um lembrete,
Quando o sistema envia a mensagem,
Então o lembrete contém informações claras sobre data, hora, profissional e local da consulta.

Dado que o paciente possui uma consulta agendada,
Quando o sistema envia lembretes,
Então o paciente recebe apenas um lembrete por canal para cada consulta.
```

---

#### Persona: Clara – Paciente
**Feature:** Fazer agendamentos  
**PBI:** Selecionar data, horário e profissional desejado, criando um agendamento no sistema, da consulta.

**Critérios de aceitação:**
- O paciente logado consegue visualizar os horários disponíveis por profissional e unidade.
- O paciente consegue selecionar uma data, um horário e um profissional específicos para realizar o agendamento.
- O sistema bloqueia automaticamente os horários já preenchidos ou conflitantes com outros agendamentos.

**BDDs:**
```gherkin
Dado que o paciente está logado no sistema,
Quando ele visualiza os horários disponíveis por profissional e unidade,
Então ele consegue ver as opções disponíveis para agendamento.

Dado que o paciente visualiza os horários disponíveis,
Quando ele seleciona uma data, um horário e um profissional específicos,
Então o sistema permite a seleção para realizar o agendamento.

Dado que existem horários já preenchidos ou conflitantes,
Quando o paciente tenta agendar um horário,
Então o sistema bloqueia automaticamente esses horários para evitar conflitos.
```

---

#### Persona: Clara – Paciente
**Feature:** Solicitar histórico médico  
**PBI:** Preencher o formulário ou selecionar a opção de solicitação, gerando um pedido formal, do prontuário.

**Critérios de aceitação:**
- O paciente ou responsável consegue preencher um formulário digital ou selecionar uma opção específica para solicitar o prontuário.
- Ao finalizar o preenchimento, o sistema gera automaticamente um pedido formal contendo os dados do solicitante, data e objetivo da solicitação.
- O pedido é registrado no sistema e pode ser acompanhado pelo solicitante, garantindo rastreabilidade e transparência no processo.

**BDDs:**
```gherkin
Dado que o paciente ou responsável acessa o sistema,
Quando ele preenche um formulário digital ou seleciona uma opção para solicitar o prontuário,
Então o sistema permite a solicitação do prontuário.

Dado que o formulário foi preenchido,
Quando o solicitante finaliza o pedido,
Então o sistema gera automaticamente um pedido formal contendo os dados do solicitante, data e objetivo da solicitação.

Dado que o pedido formal foi gerado,
Quando ele é registrado no sistema,
Então o solicitante pode acompanhar o pedido, garantindo rastreabilidade e transparência no processo.
```

---

#### Persona: Clara – Paciente
**Feature:** Ver resultados de exames  
**PBI:** Acessar o portal ou aplicativo com login autorizado, liberando o acesso ao prontuário eletrônico, do paciente.

**Critérios de aceitação:**
- O paciente consegue acessar o portal ou aplicativo utilizando login e senha previamente cadastrados ou autenticação segura.
- Após a autenticação bem-sucedida, o sistema libera o acesso ao prontuário eletrônico correspondente ao paciente logado.
- O prontuário é exibido de forma segura e organizada, respeitando as normas de proteção de dados e garantindo a confidencialidade das informações.

**BDDs:**
```gherkin
Dado que o paciente possui login e senha cadastrados ou métodos de autenticação segura,
Quando ele acessa o portal ou aplicativo e realiza a autenticação,
Então o sistema libera o acesso ao prontuário eletrônico correspondente ao paciente logado.

Dado que o paciente está autenticado no sistema,
Quando ele acessa o prontuário eletrônico,
Então o prontuário é exibido de forma segura e organizada.

Dado que o prontuário eletrônico está sendo exibido,
Quando o sistema apresenta as informações,
Então ele respeita as normas de proteção de dados e garante a confidencialidade das informações.
```

---

#### Persona: Clara – Paciente
**Feature:** Ver resultados de exames  
**PBI:** Selecionar a aba de exames e escolher o exame desejado, exibindo o laudo digital, do exame realizado.

**Critérios de aceitação:**
- O paciente ou profissional de saúde autenticado consegue acessar a aba de exames no sistema.
- O sistema exibe uma lista organizada dos exames realizados, com data, tipo e status (disponível, pendente etc.).
- Ao selecionar um exame, o laudo digital correspondente é exibido em formato legível (PDF ou visualização embutida).
- Apenas exames já liberados pelo laboratório ficam disponíveis para visualização.

**BDDs:**
```gherkin
Dado que o paciente ou profissional de saúde está autenticado no sistema,
Quando ele acessa a aba de exames,
Então o sistema exibe uma lista organizada dos exames realizados, com data, tipo e status.

Dado que a lista de exames está exibida,
Quando o usuário seleciona um exame,
Então o laudo digital correspondente é exibido em formato legível (PDF ou visualização embutida).

Dado que um exame foi realizado,
Quando o exame foi liberado pelo laboratório,
Então apenas esses exames ficam disponíveis para visualização.
```

---

#### Persona: Clara – Paciente
**Feature:** Ver resultados de exames  
**PBI:** Visualizar ou baixar o documento disponível, permitindo a leitura e o armazenamento, dos resultados de exames.

**Critérios de aceitação:**
- O paciente logado consegue visualizar o documento de resultados de exames diretamente na plataforma, sem necessidade de download imediato.
- O paciente tem a opção de baixar o documento em formato PDF para armazenamento local.
- O documento é exibido de forma legível e organizada, garantindo a leitura clara dos resultados apresentados.

**BDDs:**
```gherkin
Dado que o paciente está logado na plataforma,
Quando ele visualiza o documento de resultados de exames,
Então ele consegue visualizar o documento diretamente, sem necessidade de download imediato.

Dado que o paciente está visualizando o documento,
Quando desejar,
Então ele tem a opção de baixar o documento em formato PDF para armazenamento local.

Dado que o documento de resultados está sendo exibido,
Quando o sistema apresenta as informações,
Então o documento é exibido de forma legível e organizada, garantindo a leitura clara dos resultados.
```

---

#### Persona: Clara – Paciente
**Feature:** Solicitar histórico médico  
**PBI:** Enviar a solicitação para análise e liberação, iniciando o processo de disponibilização, dos dados médicos.

**Critérios de aceitação:**
- O paciente ou responsável legal consegue acessar o sistema utilizando credenciais válidas e seguras.
- Após o login autorizado, o sistema disponibiliza uma opção clara para solicitação do histórico médico do paciente.
- A solicitação é registrada e transmitida de forma segura, garantindo a integridade e a confidencialidade das informações médicas.

**BDDs:**
```gherkin
Dado que o paciente ou responsável legal possui credenciais válidas e seguras,
Quando ele acessa o sistema e realiza o login autorizado,
Então o sistema disponibiliza uma opção clara para solicitação do histórico médico do paciente.

Dado que a opção para solicitação do histórico médico está disponível,
Quando o paciente ou responsável legal realiza a solicitação,
Então o sistema registra a solicitação.

Dado que a solicitação do histórico médico foi registrada,
Quando o sistema transmite as informações,
Então a transmissão ocorre de forma segura, garantindo a integridade e confidencialidade dos dados.
```

---

#### Persona: Roberto – Diretor de Tecnologia
**Feature:** Gerenciar a infraestrutura de tecnologia  
**PBI:** Monitorar servidores, redes e sistemas continuamente, assegurando o funcionamento estável e seguro, da infraestrutura tecnológica.

**Critérios de aceitação:**
- O sistema realiza monitoramento contínuo dos recursos de TI, coletando métricas em tempo real.
- Alertas automáticos são gerados em caso de falhas, indisponibilidade ou uso anormal de recursos.
- A equipe de TI consegue acessar um painel com indicadores atualizados do status da infraestrutura.

**BDDs:**
```gherkin
Dado que o sistema está em operação,
Quando ele realiza monitoramento contínuo dos recursos de TI,
Então ele coleta métricas em tempo real.

Dado que o sistema está monitorando a infraestrutura,
Quando ocorrem falhas, indisponibilidade ou uso anormal de recursos,
Então alertas automáticos são gerados.

Dado que a equipe de TI precisa verificar o status da infraestrutura,
Quando eles acessam o sistema,
Então conseguem acessar um painel com indicadores atualizados do status da infraestrutura.
```

---

#### Persona: Roberto – Diretor de Tecnologia
**Feature:** Gerenciar a infraestrutura de tecnologia  
**PBI:** Implementar as soluções validadas, aumentando a velocidade e estabilidade, da plataforma tecnológica.

**Critérios de aceitação:**
- O sistema segue um cronograma de manutenções e atualizações periódicas previamente definido e documentado.
- As manutenções são executadas com sucesso sem impactar a disponibilidade dos serviços para os usuários finais.
- As atualizações resultam em melhorias perceptíveis de desempenho, segurança ou estabilidade dos recursos de TI.

**BDDs:**
```gherkin
Dado que existe um cronograma de manutenções e atualizações previamente definido e documentado,
Quando o sistema segue esse cronograma,
Então as manutenções e atualizações são executadas conforme planejado.

Dado que as manutenções estão sendo executadas,
Quando elas são realizadas,
Então são executadas com sucesso sem impactar a disponibilidade dos serviços para os usuários finais.

Dado que as atualizações foram implementadas,
Quando são executadas,
Então resultam em melhorias perceptíveis de desempenho, segurança ou estabilidade dos recursos de TI.
```

---

#### Persona: Roberto – Diretor de Tecnologia
**Feature:** Buscar soluções para a eficiência do sistema  
**PBI:** Analisar métricas de desempenho e identificar gargalos, detectando pontos críticos de lentidão ou falha, no sistema.

**Critérios de aceitação:**
- O sistema coleta automaticamente métricas de desempenho em tempo real, como tempo de resposta, uso de CPU, memória e taxa de erros.
- O sistema identifica e sinaliza pontos críticos de lentidão ou falha com base nas métricas coletadas, permitindo a rápida detecção de gargalos.
- O usuário consegue visualizar essas informações de forma clara, com gráficos ou relatórios que destacam os problemas identificados.

**BDDs:**
```gherkin
Dado que o sistema está em operação,
Quando ele coleta métricas de desempenho em tempo real,
Então ele registra dados como tempo de resposta, uso de CPU, memória e taxa de erros.

Dado que as métricas de desempenho foram coletadas,
Quando o sistema identifica pontos críticos de lentidão ou falha,
Então ele sinaliza esses gargalos para rápida detecção.

Dado que os pontos críticos foram identificados,
Quando o usuário acessa as informações,
Então o sistema exibe gráficos ou relatórios claros que destacam os problemas.
```

## Estudo de Caso 2: USM - ComunEventos

### User Story Mapping (USM)

Este USM foi desenvolvido durante a atividade de estudo de caso do sistema ComunEventos:

<iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVInoXe-k=/?embedMode=view_only_without_ui&moveToViewport=-10039,-2606,11852,7466&embedId=463774134693" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

[Acesse o USM do Estudo de Caso completo no Miro](https://miro.com/app/board/uXjVInoXe-k=/)

### BDD - ComunEventos

#### Critérios de Aceitação Completos para User Stories do MVP

Este documento apresenta os critérios de aceitação completos para as 35 User Stories colocadas no MVP do sistema ComunEventos, seguindo o padrão BDD (Behavior-Driven Development).

[Acesse o documento completo no Google Docs](https://docs.google.com/document/d/1pbP3jJbLqM3W5ogY0hJ9ZvA8cGE3Kahbp5ONC6vERX0/edit?tab=t.0)

---

#### 1. Clareza sobre tarefas (Voluntário)
**Critérios de Aceitação:**
1) O voluntário consegue visualizar todas as tarefas atribuídas a ele
2) Cada tarefa exibe descrição completa e passo a passo de execução
3) O sistema mostra o status atual de cada tarefa (pendente/em andamento/concluído)
4) O voluntário consegue solicitar esclarecimentos quando informações estiverem incompletas

**Funcionalidade:** Clareza sobre tarefas e responsabilidades
Como Voluntário, Quero receber clareza sobre as tarefas e responsabilidades que devo desempenhar, Para saber como ajudar efetivamente

**Cenário:** Visualizar minhas tarefas atribuídas
```gherkin
Dado que estou logado como voluntário
Quando acesso a seção "Minhas Tarefas"
Então devo ver uma lista com:
- Descrição clara de cada tarefa
- Prazo para conclusão
- Responsável designado
- Status atual
```

---

#### 2. Busca de eventos (Participante)
**Critérios de Aceitação:**
1) O sistema filtra eventos por categoria selecionada
2) A busca por data retorna apenas eventos no período especificado
3) A busca por localização mostra eventos num raio de distância configurável
4) Os resultados exibem informações essenciais para decisão (data, local, preço)

**Funcionalidade:** Busca de eventos por categoria, data ou localização
Como Participante do Evento, Quero procurar eventos por categoria, data ou localização, Para encontrar opções do meu interesse

**Cenário:** Buscar eventos por categoria
```gherkin
Dado que estou na página de busca de eventos
Quando seleciono a categoria "Música"
Então o sistema deve exibir apenas eventos relacionados à categoria "Música"
E cada resultado deve mostrar:
- Nome do evento
- Data e horário
- Localização
- Breve descrição
```

---

#### 3. Divulgação em redes sociais (Organizador)
**Critérios de Aceitação:**
1) O sistema permite compartilhamento em pelo menos 3 redes sociais diferentes
2) Cada publicação inclui automaticamente imagem, descrição e link do evento
3) O organizador pode personalizar a mensagem para cada rede social
4) O sistema gera relatório de visualizações/cliques por plataforma

**Funcionalidade:** Divulgação do evento em redes sociais
Como Organizador do Evento, Quero divulgar o evento nas redes sociais, Para alcançar um público amplo

**Cenário:** Compartilhar evento automaticamente no Facebook
```gherkin
Dado que estou na página de gerenciamento do evento
Quando seleciono a opção "Compartilhar no Facebook"
E preencho uma mensagem personalizada
Então o sistema deve publicar o evento em minha página do Facebook
E incluir:
- Imagem do evento
- Data e local
- Link para inscrição
```

---

#### 4. Reserva de local (Organizador)
**Critérios de Aceitação:**
1) O sistema mostra apenas locais disponíveis para a data selecionada
2) Cada local exibe capacidade, infraestrutura e valor do aluguel
3) O organizador consegue reservar diretamente pelo sistema
4) O sistema envia confirmação por e-mail com termos de locação

**Funcionalidade:** Escolha e reserva do local do evento
Como Organizador do Evento, Quero escolher e reservar o local do evento, Para garantir um espaço adequado e disponível

**Cenário:** Buscar locais disponíveis por data
```gherkin
Dado que estou planejando um evento
Quando informo a data "15/11/2025"
E o número estimado de participantes "200 pessoas"
Então o sistema deve mostrar uma lista de locais disponíveis
Com as seguintes informações para cada um:
- Nome e endereço
- Capacidade máxima
- Valor do aluguel
- Estrutura oferecida
```

---

#### 5. Atribuição de tarefas (Organizador)
**Critérios de Aceitação:**
1) O organizador pode atribuir tarefas para equipe, fornecedores e voluntários
2) Cada tarefa aceita prazos, prioridades e descrições detalhadas
3) Os responsáveis recebem notificação imediata da atribuição
4) O sistema impede atribuição conflitante de mesma tarefa para múltiplas pessoas

**Funcionalidade:** Atribuição de tarefas para equipe e colaboradores
Como Organizador do Evento, Quero atribuir tarefas para minha equipe, fornecedores e voluntários, Para garantir a execução adequada de todas as atividades

**Cenário:** Atribuir tarefa para membro da equipe
```gherkin
Dado que estou na área de gestão de tarefas do evento
Quando seleciono "Nova Tarefa"
E preencho:
- Título: "Montagem do palco"
- Responsável: "Equipe de Logística"
- Prazo: "20/11/2025 às 14:00"
- Descrição detalhada
Então o sistema deve:
- Registrar a tarefa
- Notificar o responsável por e-mail
- Atualizar o quadro de tarefas
```

---

**Observação:** Este documento contém as 35 User Stories completas com critérios de aceitação e cenários BDD detalhados. As User Stories 6-35 incluem funcionalidades como: Gerenciamento de pagamentos, Reconhecimento de voluntários, Visualização de detalhes do evento, Ingresso digital, Criação de página do evento, Definição do tipo de evento, Pesquisas de feedback, Seleção de data/hora, E-mails de marketing, Pagamento seguro, Instruções para o evento, Formulário de inscrição, Checklist de tarefas, Atualizações para participantes, Configuração de inscrição, Notificações de eventos, Informações para patrocinadores, Coordenação no evento, Busca por patrocínios, Acompanhamento de status, Visualização de patrocínios, Confirmação de inscrição, Definição de agenda, Comunicação com fornecedores, Navegação no local, Orientação para voluntários, Notificações de mudanças, Comunicação com organizadores, Criação de cronograma e Análise de feedback.

Para visualizar todas as User Stories com seus critérios de aceitação e cenários BDD completos, acesse o documento no Google Docs através do link fornecido acima.

---

#### 6. Gerenciamento de pagamentos (Organizador)
**Critérios de Aceitação:**
1) O sistema aceita pelo menos 3 métodos de pagamento diferentes
2) Transações são processadas com segurança (certificado SSL)
3) O organizador pode definir diferentes categorias de ingressos
4) O sistema gera comprovante automático para cada pagamento

**Funcionalidade:** Gerenciamento de opções de pagamento
Como Organizador do Evento, Quero definir e gerenciar as opções de pagamento, Para coletar as taxas de inscrição de forma eficiente

**Cenário:** Configurar métodos de pagamento disponíveis
```gherkin
Dado que estou na área de configurações financeiras do evento
Quando acesso "Opções de Pagamento"
Então posso selecionar e configurar:
- Cartões de crédito (Visa, Mastercard, etc.)
- Pix
- Boleto bancário
- Pagamento presencial
E definir:
- Prazos para cada método
- Possibilidade de parcelamento
- Taxas adicionais (se aplicável)
```

---

#### 7. Reconhecimento de voluntários
**Critérios de Aceitação:**
1) O sistema emite certificado digital após conclusão do evento
2) O certificado inclui horas trabalhadas e atividades realizadas
3) Voluntários aparecem na página de agradecimentos do evento
4) O sistema permite compartilhamento em redes profissionais

**Funcionalidade:** Reconhecimento do tempo e esforço dos voluntários
Como Voluntário, Quero ter meu trabalho reconhecido pelos organizadores e comunidade, Para sentir que minha contribuição foi valorizada

**Cenário:** Receber certificado de participação
```gherkin
Dado que participei como voluntário no evento
Quando o evento é concluído
Então o sistema deve:
- Gerar automaticamente um certificado digital
- Incluir meu nome e horas voluntariadas
- Listar as atividades realizadas
- Permitir download em PDF compartilhável
```

---

#### 8. Visualização de detalhes do evento (Participante)
**Critérios de Aceitação:**
1) A página exibe descrição completa, agenda e localização com mapa
2) Informações do organizador são verificadas e confiáveis
3) O participante consegue visualizar fotos/vídeos de edições anteriores
4) A página possui seção clara de dúvidas frequentes

**Funcionalidade:** Visualização completa de detalhes do evento
Como Participante do Evento, Quero visualizar detalhes completos de um evento, Para decidir se desejo participar

**Cenário:** Acessar página completa do evento
```gherkin
Dado que encontrei um evento de meu interesse
Quando acesso sua página dedicada
Então devo visualizar:
- Descrição completa e objetivos
- Agenda detalhada com horários
- Localização com mapa
- Informações do organizador
- Fotos/vídeos de edições anteriores
```

---

#### 9. Ingresso digital (Participante)
**Critérios de Aceitação:**
1) O ingresso contém QR code válido para entrada
2) O participante consegue acessar pelo celular sem necessidade de impressão
3) O comprovante exibe dados essenciais (nome, evento, data, local)
4) O sistema permite reenvio do ingresso por e-mail quando solicitado

**Funcionalidade:** Ingresso digital do participante
Como Participante do Evento, Quero acessar meu ingresso digital, Para facilitar a entrada no evento

**Cenário:** Visualizar comprovante de inscrição
```gherkin
Dado que me inscrevi em um evento
Quando acesso minha área do participante
Então posso:
- Visualizar ingresso com QR code
- Baixar em formato PDF
- Adicionar à carteira digital (Google/Apple Wallet)
- Reenviar para meu e-mail
```

---

#### 10. Criação de página do evento (Organizador)
**Critérios de Aceitação:**
1) O editor permite formatação rica (texto, imagens, vídeos)
2) O sistema valida campos obrigatórios antes da publicação
3) A URL gerada é amigável e compartilhável
4) O organizador pode fazer edições após publicação

**Funcionalidade:** Publicação da página do evento
Como Organizador do Evento, Quero criar e publicar uma página completa, Para divulgar todas as informações

**Cenário:** Publicar página com sucesso
```gherkin
Dado que completei todas as seções obrigatórias
Quando clico em "Publicar Evento"
Então o sistema deve:
- Validar informações completas
- Gerar URL amigável
- Disponibilizar página publicamente
- Permitir edições posteriores
```

---

#### 11. Definição do tipo de evento (Organizador)
**Critérios de Aceitação:**
1) O sistema oferece pelo menos 5 categorias principais de eventos
2) A seleção altera configurações padrão apropriadas ao tipo
3) O tipo aparece claramente na página pública do evento
4) O organizador pode criar subtipos personalizados quando necessário

**Funcionalidade:** Classificação do tipo de evento
Como Organizador do Evento, Quero definir o tipo de evento, Para classificar sua natureza

**Cenário:** Selecionar categoria principal
```gherkin
Dado que estou criando um novo evento
Quando seleciono o tipo de evento
Então posso escolher entre opções como:
- Feira local
- Workshop educacional
- Evento beneficente
- Conferência profissional
E o sistema deve sugerir configurações padrão conforme o tipo
```

---

#### 12. Pesquisas de feedback (Organizador)
**Critérios de Aceitação:**
1) O sistema envia pesquisa automaticamente após o evento
2) As perguntas podem ser personalizadas pelo organizador
3) Os resultados são compilados em relatórios analíticos
4) O sistema destaca comentários relevantes automaticamente

**Funcionalidade:** Coleta de feedback pós-evento
Como Organizador do Evento, Quero criar e distribuir pesquisas, Para coletar opiniões dos participantes

**Cenário:** Enviar pesquisa automatizada
```gherkin
Dado que o evento foi concluído
Quando ativo a pesquisa de satisfação
Então o sistema deve:
- Enviar e-mail automático aos participantes
- Coletar respostas de forma anônima
- Gerar relatório consolidado
- Alertar sobre comentários importantes
```

---

#### 13. Seleção de data/hora (Organizador)
**Critérios de Aceitação:**
1) O calendário evita marcação em feriados nacionais
2) O sistema alerta sobre conflitos de horário
3) Mudanças na programação disparam notificações
4) O organizador pode definir múltiplos dias para eventos prolongados

**Funcionalidade:** Configuração de data do evento
Como Organizador do Evento, Quero selecionar data e hora, Para que participantes possam planejar

**Cenário:** Definir período principal
```gherkin
Dado que estou configurando o evento
Quando insiro:
- Data de início: 15/11/2025
- Hora: 14:00
- Duração: 3 horas
Então o sistema deve:
- Verificar conflitos com feriados
- Sugerir horários alternativos se necessário
- Atualizar automaticamente todas as comunicações
```

---

#### 14. E-mails de marketing (Organizador)
**Critérios de Aceitação:**
1) O sistema permite segmentação da lista de contatos
2) Os e-mails são responsivos (mobile-friendly)
3) O organizador visualiza taxa de abertura/clique
4) O sistema impede envios em massa não autorizados

**Funcionalidade:** Campanhas de e-mail marketing
Como Organizador do Evento, Quero enviar e-mails direcionados, Para divulgar meu evento

**Cenário:** Enviar convite personalizado
```gherkin
Dado que importei minha lista de contatos
Quando crio uma campanha de divulgação
Então posso:
- Segmentar por interesses
- Personalizar mensagens
- Agendar envios
- Acompanhar taxas de abertura
```

---

#### 15. Pagamento seguro (Participante)
**Critérios de Aceitação:**
1) Dados financeiros são criptografados
2) O sistema valida informações antes do processamento
3) Transações recusadas explicam o motivo
4) O participante recebe comprovante imediato

**Funcionalidade:** Processamento de pagamentos
Como Participante do Evento, Quero pagar meu ingresso com segurança, Para garantir minha participação

**Cenário:** Finalizar compra com cartão
```gherkin
Dado que selecionei um evento pago
Quando preencho os dados do cartão
Então o sistema deve:
- Validar informações em tempo real
- Processar pagamento criptografado
- Enviar comprovante imediato
- Oferecer garantia contra fraudes
```

---

#### 16. Instruções para o evento (Participante)
**Critérios de Aceitação:**
1) As informações chegam pelo menos 24h antes
2) O material inclui mapa, programação e contatos importantes
3) O participante pode acessar offline quando necessário
4) Há versão resumida para consulta rápida no local

**Funcionalidade:** Guia do participante
Como Participante do Evento, Quero receber instruções claras, Para me preparar adequadamente

**Cenário:** Acessar informações do dia
```gherkin
Dado que minha inscrição foi confirmada
Quando faltam 3 dias para o evento
Então recebo e-mail com:
- Programação detalhada
- Mapa de acesso
- Regras de conduta
- Contatos de emergência
```

---

#### 17. Formulário de inscrição (Participante)
**Critérios de Aceitação:**
1) O formulário é completável em menos de 2 minutos
2) Campos obrigatórios são claramente marcados
3) O sistema sugere autocompletar quando possível
4) Dados são salvos automaticamente durante o preenchimento

**Funcionalidade:** Inscrição rápida em eventos
Como Participante do Evento, Quero preencher formulários simples, Para me registrar rapidamente

**Cenário:** Completar inscrição em 2 minutos
```gherkin
Dado que encontrei um evento interessante
Quando acesso o formulário de inscrição
Então posso:
- Preencher campos essenciais apenas
- Usar autopreenchimento
- Salvar dados para próximos eventos
- Receber confirmação imediata
```

---

#### 18. Checklist de tarefas (Organizador)
**Critérios de Aceitação:**
1) O sistema permite criação de tarefas recorrentes
2) Cada item aceita anexos e observações
3) O progresso geral é exibido graficamente
4) Lembretes automáticos são enviados conforme configuração

**Funcionalidade:** Gerenciamento de checklist
Como Organizador do Evento, Quero criar e acompanhar um checklist, Para garantir nada seja esquecido

**Cenário:** Adicionar nova tarefa ao checklist
```gherkin
Dado que estou planejando o evento
Quando adiciono uma tarefa:
- Título: "Contratar buffet"
- Responsável: "Maria"
- Prazo: "10/11/2025"
Então o sistema deve:
- Incluir no checklist geral
- Notificar o responsável
- Atualizar status como "Pendente"
```

---

#### 19. Atualizações para participantes (Organizador)
**Critérios de Aceitação:**
1) Mensagens chegam por e-mail e notificação no app
2) O organizador sabe quantos receberam a comunicação
3) Participantes podem optar por não receber determinados tipos
4) Urgências são destacadas adequadamente

**Funcionalidade:** Comunicação com participantes
Como Organizador do Evento, Quero enviar atualizações e lembretes, Para manter todos informados

**Cenário:** Enviar lembrete pré-evento
```gherkin
Dado que o evento ocorrerá em 3 dias
Quando seleciono "Enviar lembrete"
E escrevo a mensagem
Então o sistema deve:
- Enviar para todos inscritos
- Incluir informações essenciais
- Permitir personalização
- Gerar relatório de entregas
```

---

#### 20. Configuração de inscrição (Organizador)
**Critérios de Aceitação:**
1) O organizador define campos obrigatórios e opcionais
2) O sistema valida formatos de e-mail/telefone
3) Dados podem ser exportados para planilha
4) Há pré-visualização do formulário antes da publicação

**Funcionalidade:** Personalização de formulário
Como Organizador do Evento, Quero configurar o formulário, Para facilitar o registro

**Cenário:** Criar formulário personalizado
```gherkin
Dado que estou na seção de inscrições
Quando adiciono campos:
- Campos obrigatórios: Nome, Email
- Campos opcionais: Empresa, Cargo
- Perguntas específicas do evento
Então o sistema deve:
- Salvar o template
- Mostrar pré-visualização
- Permitir testes antes da publicação
```

---

#### 21. Notificações de eventos (Participante)
**Critérios de Aceitação:**
1) As recomendações são baseadas em histórico de interesses
2) O usuário controla frequência e tipos de notificações
3) Cada alerta contém informações essenciais para decisão
4) Há opção para desativar recomendações específicas

**Funcionalidade:** Notificações personalizadas
Como Participante do Evento, Quero receber recomendações, Para não perder oportunidades

**Cenário:** Receber sugestões relevantes
```gherkin
Dado que participei de eventos anteriores
Quando há novos eventos similares
Então o sistema deve:
- Enviar notificação personalizada
- Basear em meus interesses
- Permitir configuração de frequência
- Oferecer link direto para inscrição
```

---

#### 22. Informações para patrocinadores (Organizador)
**Critérios de Aceitação:**
1) Relatórios incluem métricas de público atualizadas
2) O sistema gera comprovantes de visibilidade (prints, menções)
3) Patrocinadores podem acessar portal com dados exclusivos
4) Alertas automáticos são enviados quando metas são atingidas

**Funcionalidade:** Relacionamento com patrocinadores
Como Organizador do Evento, Quero manter patrocinadores informados, Para honrar acordos estabelecidos

**Cenário:** Enviar relatório de alcance
```gherkin
Dado que o evento está em andamento
Quando preparo atualização para patrocinadores
Então o sistema deve:
- Gerar métricas de público
- Incluir fotos/menções
- Permitir envio segmentado
- Oferecer template profissional
```

---

#### 23. Coordenação no evento (Voluntário)
**Critérios de Aceitação:**
1) O voluntário acessa sua lista de tarefas específicas
2) Há mapa com postos e estações de trabalho
3) Contatos de emergência são facilmente acessíveis
4) O sistema registra check-in/check-out no local

**Funcionalidade:** Atuação no dia do evento
Como Voluntário, Quero ajudar na execução, Para garantir bom funcionamento

**Cenário:** Receber atribuições claras
```gherkin
Dado que sou voluntário credenciado
Quando acesso minha área no dia
Então devo ver:
- Minhas tarefas específicas
- Horários de atuação
- Ponto de encontro
- Contato do supervisor
```

---

#### 24. Busca por patrocínios (Patrocinador)
**Critérios de Aceitação:**
1) Filtros por público-alvo retornam resultados precisos
2) Cada evento mostra dados demográficos verificados
3) O sistema calcula ROI estimado para diferentes níveis
4) Há canal direto com organizadores para negociação

**Funcionalidade:** Busca de eventos para patrocínio
Como Patrocinador, Quero encontrar eventos relevantes, Para maximizar meu investimento

**Cenário:** Filtrar eventos por público-alvo
```gherkin
Dado que estou buscando oportunidades
Quando aplico filtros:
- Público: "Profissionais de TI"
- Região: "Sudeste"
- Tamanho: "500+ participantes"
Então o sistema deve mostrar:
- Eventos compatíveis
- Dados demográficos
- Opções de patrocínio
- ROI estimado
```

---

#### 25. Acompanhamento de status (Organizador)
**Critérios de Aceitação:**
1) O painel mostra porcentagem de conclusão geral
2) Cada tarefa exibe histórico de alterações
3) Alertas são disparados para atrasos
4) O sistema permite reatribuição rápida quando necessário

**Funcionalidade:** Monitoramento de progresso
Como Organizador do Evento, Quero acompanhar status de tarefas, Para gerenciar melhor o evento

**Cenário:** Atualizar status de tarefa
```gherkin
Dado que uma tarefa está em andamento
Quando mudo seu status para "Concluído"
Então o sistema deve:
- Atualizar em tempo real
- Notificar interessados
- Registrar data/hora
- Atualizar métricas de progresso
```

---

#### 26. Visualização de patrocínios (Patrocinador)
**Critérios de Aceitação:**
1) Oportunidades são classificadas por relevância
2) Dados de público incluem faixa etária, gênero e interesses
3) Benefícios são detalhados por nível de investimento
4) Há exemplos de branding em edições anteriores

**Funcionalidade:** Análise de patrocínios
Como Patrocinador, Quero avaliar oportunidades, Para tomar decisões estratégicas

**Cenário:** Visualizar dados de público
```gherkin
Dado que encontrei um evento interessante
Quando acesso os detalhes de patrocínio
Então devo ver:
- Perfil demográfico
- Alcance estimado
- Mídias incluídas
- Investimento necessário
```

---

#### 27. Confirmação de inscrição (Participante)
**Critérios de Aceitação:**
1) O e-mail chega em até 2 minutos após conclusão
2) O comprovante é gerado em formato PDF anexado
3) Há link para adicionar ao calendário pessoal
4) Instruções para cancelamento são claramente exibidas

**Funcionalidade:** Confirmação imediata
Como Participante do Evento, Quero receber confirmação, Para ter certeza do meu registro

**Cenário:** Confirmação automática
```gherkin
Dado que completei minha inscrição
Quando finalizo o processo
Então o sistema deve:
- Enviar e-mail imediato
- Gerar comprovante digital
- Incluir resumo das informações
- Oferecer adicionar ao calendário
```

---

#### 28. Definição de agenda (Organizador)
**Critérios de Aceitação:**
1) O sistema alerta sobre sobreposições de horário
2) Permite arrastar e soltar para reorganização
3) Gera versões pública e interna automaticamente
4) Calcula recursos necessários por período

**Funcionalidade:** Criação de programação
Como Organizador do Evento, Quero definir a agenda detalhada, Para organizar as atividades

**Cenário:** Criar cronograma de palestras
```gherkin
Dado que estou na seção de programação
Quando adiciono uma atividade:
- Título: "Palestra Inovação"
- Horário: "10:00-11:30"
- Palestrante: "Dra. Silva"
- Local: "Auditório Principal"
Então o sistema deve:
- Mostrar visualização temporal
- Alertar sobre conflitos
- Gerar versão para impressão
```

---

#### 29. Comunicação com fornecedores (Organizador)
**Critérios de Aceitação:**
1) O sistema registra confirmação de recebimento
2) Prazos são destacados automaticamente
3) Permite anexar contratos e especificações técnicas
4) Mantém histórico completo de conversas

**Funcionalidade:** Alinhamento com fornecedores
Como Organizador do Evento, Quero comunicar detalhes operacionais, Para garantir cumprimento de prazos

**Cenário:** Enviar briefing para fornecedor
```gherkin
Dado que tenho contratado um serviço
Quando acesso o módulo de fornecedores
Então posso:
- Enviar especificações técnicas
- Anexar contratos
- Definir checkpoints
- Registrar entregas
```

---

#### 30. Navegação no local (Participante)
**Critérios de Aceitação:**
1) O mapa funciona offline após primeiro acesso
2) Mostra localização em tempo real no venue
3) Inclui rotas acessíveis para cadeirantes
4) Permite busca por atividade ou serviço (banheiro, foodtruck)

**Funcionalidade:** Orientação espacial
Como Participante do Evento, Quero navegar facilmente, Para encontrar atividades

**Cenário:** Usar mapa interativo
```gherkin
Dado que estou no local do evento
Quando acesso o mapa digital
Então posso:
- Ver minha localização atual
- Buscar por atividades
- Ver rotas entre espaços
- Salvar locais favoritos
```

---

#### 31. Orientação para voluntários (Organizador)
**Critérios de Aceitação:**
1) Materiais estão disponíveis em formato mobile
2) Inclui FAQ dinâmico atualizável
3) Voluntários confirmam entendimento digitalmente
4) Há canal dedicado para dúvidas operacionais

**Funcionalidade:** Direcionamento de voluntários
Como Organizador do Evento, Quero enviar orientações, Para manter todos alinhados

**Cenário:** Enviar guia completo
```gherkin
Dado que faltam 2 dias para o evento
Quando preparo o material para voluntários
Então o sistema deve permitir:
- Envio em massa
- Confirmação de recebimento
- Anexar documentos importantes
- Incluir FAQ atualizado
```

---

#### 32. Notificações de mudanças (Participante)
**Critérios de Aceitação:**
1) Alertas chegam por múltiplos canais simultaneamente
2) Mudanças são destacadas em vermelho/negrito
3) Oferece opções alternativas quando aplicável
4) O participante pode confirmar recebimento

**Funcionalidade:** Alertas de alterações
Como Participante do Evento, Quero ser informado sobre mudanças, Para me adaptar a tempo

**Cenário:** Receber aviso de mudança
```gherkin
Dado que estou inscrito no evento
Quando há alteração na programação
Então devo receber:
- Notificação imediata
- Detalhes da mudança
- Impacto na minha agenda
- Opções alternativas
```

---

#### 33. Comunicação com organizadores (Voluntário)
**Critérios de Aceitação:**
1) Mensagens têm tempo máximo de resposta de 2 horas
2) Permite anexar fotos e documentos
3) Organiza conversas por evento/tarefa
4) Diferencia comunicações urgentes de rotina

**Funcionalidade:** Canal de comunicação
Como Voluntário, Quero me comunicar eficazmente, Para esclarecer dúvidas

**Cenário:** Enviar mensagem rápida
```gherkin
Dado que tenho uma dúvida
Quando acesso o chat do evento
Então posso:
- Enviar mensagem direta
- Anexar fotos se necessário
- Receber resposta em até 2h
- Ver histórico de conversas
```

---

#### 34. Criação de cronograma (Organizador)
**Critérios de Aceitação:**
1) Blocos de tempo são customizáveis
2) Alertas sobre horários não preenchidos
3) Calcula recursos necessários por período
4) Permite versões alternativas para contingência

**Funcionalidade:** Planejamento temporal
Como Organizador do Evento, Quero criar um cronograma, Para organizar todas as atividades

**Cenário:** Definir horários precisos
```gherkin
Dado que estou na etapa de programação
Quando aloco atividades:
- "Credenciamento" 08:00-09:00
- "Cerimônia Abertura" 09:00-09:30
- "Coffee Break" 10:45-11:15
Então o sistema deve:
- Mostrar linha do tempo visual
- Alertar sobre sobreposições
- Calcular tempo total
```

---

#### 35. Análise de feedback (Organizador)
**Critérios de Aceitação:**
1) Relatórios são gerados automaticamente
2) Identifica tendências em comentários livres
3) Permite filtros por tipo de participante
4) Sugere ações de melhoria baseadas em dados

**Funcionalidade:** Processamento de avaliações
Como Organizador do Evento, Quero analisar feedback, Para melhorar futuros eventos

**Cenário:** Gerar relatório consolidado
```gherkin
Dado que recebi avaliações
Quando acesso a análise de feedback
Então o sistema deve mostrar:
- Nota média geral
- Gráficos por categoria
- Comentários relevantes
- Sugestões de melhoria
```

[Acesse o documento completo no Google Docs](https://docs.google.com/document/d/1pbP3jJbLqM3W5ogY0hJ9ZvA8cGE3Kahbp5ONC6vERX0/edit?tab=t.0)