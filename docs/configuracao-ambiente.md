# Como clonar e rodar o projeto (backend + frontend)

## Pré-requisitos
- Node.js (recomendado: versão 18+)
- npm (geralmente já vem com o Node)
- Docker e Docker Compose
- Expo CLI

---

## 🚀 Script de Desenvolvimento (dev.sh) - RECOMENDADO

O projeto agora possui um **script unificado de desenvolvimento** que automatiza todas as tarefas comuns. Este é o método principal recomendado para desenvolver o projeto.

### Comandos principais:
```bash
# Configuração inicial completa do projeto
./scripts/dev.sh setup

# Iniciar todos os serviços (backend + banco de dados)
./scripts/dev.sh up

# Modo desenvolvimento com hot reload
./scripts/dev.sh watch

# Executar migrations do banco de dados
./scripts/dev.sh db:migrate

# Verificar status do sistema
./scripts/dev.sh health

# Ver todos os comandos disponíveis
./scripts/dev.sh help
```

O script `dev.sh` oferece mais de 20 comandos para:
- 🐳 **Docker**: iniciar, parar, rebuild de containers
- 🗄️ **Banco de dados**: migrations, seed, backup, reset
- 🔧 **Desenvolvimento**: build, test, lint, format
- 📱 **Frontend**: desenvolvimento, build, iOS/Android
- 🛠️ **Utilitários**: limpeza, diagnósticos, shell

---

## Passos para rodar localmente (MÉTODO RECOMENDADO)

### 1. Clone o repositório
```bash
git clone https://github.com/mdsreq-fga-unb/2025.1-T02-CanadaIntercambio.git
cd 2025.1-T02-CanadaIntercambio
```

### 2. Configuração inicial completa
Execute o setup automático que vai configurar tudo:
```bash
./scripts/dev.sh setup
```

### 3. Iniciar o ambiente de desenvolvimento
```bash
# Iniciar backend + banco de dados
./scripts/dev.sh up

# OU usar o modo watch com hot reload (recomendado)
./scripts/dev.sh watch
```

### 4. Instalar e iniciar o frontend
Em outro terminal:
```bash
cd frontend
npm install
npm start
# Siga as instruções do Expo para rodar no emulador ou dispositivo físico
```

### 5. Verificar se tudo está funcionando
```bash
./scripts/dev.sh health
```

---

## Método manual (alternativo)
## Método manual (alternativo)

### 1. Rode o backend com Docker
Certifique-se de que o Docker está instalado e rodando no seu sistema.

Para iniciar o backend e o banco de dados:
```bash
docker compose up --build -d
```
O backend estará disponível em http://localhost:3000 se tudo ocorrer bem.

### 2. Instale as dependências do frontend
Abra outro terminal e execute:
```bash
cd frontend
npm install
```

### 3. Inicie o frontend
```bash
npm start
# Siga as instruções do Expo para rodar no emulador ou dispositivo físico
```

### 4. Veja o texto vindo da API
Na tela inicial do app, aparecerá o texto vindo do backend ("Texto de exemplo vindo da API!").

---

## Observações
- **Recomendamos usar o script `dev.sh`** para uma experiência de desenvolvimento mais fluida
- O script possui verificações automáticas de saúde do sistema e dependências
- Use `./scripts/dev.sh help` para ver todos os comandos disponíveis
- Certifique-se de que o backend está rodando antes de abrir o app
- Se for rodar em dispositivo físico, troque o endereço `localhost` pelo IP da sua máquina no arquivo `frontend/app/(tabs)/index.tsx` na linha do fetch/axios
- Para problemas, execute `./scripts/dev.sh health` para diagnóstico automático
