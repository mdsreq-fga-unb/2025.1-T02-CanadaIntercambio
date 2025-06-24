# Casos de Uso

## PBB e BDD

### Estudo de Caso USM "ComunEventos"

Este documento apresenta os critérios de aceitação para as User Stories colocadas no MVP, seguindo o padrão BDD (Behavior-Driven Development).

[Acesse o documento completo no Google Docs](https://docs.google.com/document/d/1pbP3jJbLqM3W5ogY0hJ9ZvA8cGE3Kahbp5ONC6vERX0/edit?tab=t.0)

#### Exemplo de BDD - Clareza sobre tarefas (Voluntário)

**Funcionalidade:** Clareza sobre tarefas e responsabilidades
Como Voluntário
Quero receber clareza sobre as tarefas e responsabilidades que devo desempenhar
Para saber como ajudar efetivamente

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

#### Exemplo de BDD - Busca de eventos (Participante)

**Funcionalidade:** Busca de eventos por categoria, data ou localização
Como Participante do Evento
Quero procurar eventos por categoria, data ou localização
Para encontrar opções do meu interesse

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

#### Exemplo de BDD - Processamento de pagamentos (Participante)

**Funcionalidade:** Processamento de pagamentos
Como Participante do Evento
Quero pagar meu ingresso com segurança
Para garantir minha participação

**Cenário:** Pagamento via Pix
```gherkin
Dado que selecionei um evento pago
Quando escolho pagar via Pix
Então o sistema deve:
- Gerar QR code imediato
- Validar pagamento em tempo real
- Enviar comprovante automático
- Atualizar status da inscrição
```

**Observação:** O documento completo contém 35 User Stories com seus respectivos critérios de aceitação e cenários BDD detalhados, desenvolvidos como estudo de caso para o sistema ComunEventos.

## USM

## USM do Estudo de Caso - ComunEventos

Este USM foi desenvolvido durante a atividade de estudo de caso do sistema ComunEventos:

<iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVInoXe-k=/?embedMode=view_only_without_ui&moveToViewport=-10039,-2606,11852,7466&embedId=463774134693" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

[Acesse o USM do Estudo de Caso completo no Miro](https://miro.com/app/board/uXjVInoXe-k=/)