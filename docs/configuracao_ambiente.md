# Como clonar e rodar o projeto (backend + frontend)

## Pré-requisitos
- Node.js (recomendado: versão 18+)
- npm (geralmente já vem com o Node)
- Docker e Docker Compose
- Expo CLI

## Passos para rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/mdsreq-fga-unb/2025.1-T02-CanadaIntercambio.git
cd 2025.1-T02-CanadaIntercambio
```

### 2. Rode o backend com Docker
Certifique-se de que o Docker está instalado e rodando no seu sistema.

Para iniciar o backend e o banco de dados:
```bash
docker compose up --build -d
```
O backend estará disponível em http://localhost:3000 se tudo ocorrer bem.

### 3. Instale as dependências do frontend
Abra outro terminal e execute:
```bash
cd frontend
npm install
```

### 4. Inicie o frontend
```bash
npm start
# Siga as instruções do Expo para rodar no emulador ou dispositivo físico
```

### 5. Veja o texto vindo da API
Na tela inicial do app, aparecerá o texto vindo do backend ("Texto de exemplo vindo da API!").

## Observações
- Certifique-se de que o backend está rodando via Docker antes de abrir o app.
- Se for rodar em dispositivo físico, troque o endereço `localhost` pelo IP da sua máquina no arquivo `frontend/app/(tabs)/index.tsx` na linha do fetch/axios.
