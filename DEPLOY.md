# Deploy no Render - Canada Intercâmbio Backend

## 📋 Pré-requisitos

- Conta no Render.com
- Repositório no GitHub
- Banco PostgreSQL configurado no Render

## 🚀 Passos para Deploy

### 1. Configuração do Banco de Dados
✅ **Já configurado!**
- Host: `dpg-d1qom0euk2gs73enijj0-a.ohio-postgres.render.com`
- Database: `canada_intercambio_db`
- User: `canada`
- Password: `3MqtxP1OTv7m5vlTz40fjM7VZG3f5My0`

### 2. Deploy no Render

#### Opção A: Deploy Manual
1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build && npx prisma generate`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

#### Opção B: Deploy Automático (recomendado)
1. Fazer push do código para GitHub
2. No Render, usar "Deploy from Git"
3. Selecionar o repositório
4. O arquivo `render.yaml` será detectado automaticamente

### 3. Variáveis de Ambiente

Configure no painel do Render:
```
DATABASE_URL=postgresql://canada:3MqtxP1OTv7m5vlTz40fjM7VZG3f5My0@dpg-d1qom0euk2gs73enijj0-a.ohio-postgres.render.com:5432/canada_intercambio_db
JWT_SECRET=canada_intercambio_super_secret_key_2025
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### 4. Executar Migrações

Após o deploy, execute no terminal do Render:
```bash
npx prisma migrate deploy
```

### 5. Verificar Deploy

Acesse os endpoints:
- **Status**: `https://sua-url.onrender.com/`
- **Health Check**: `https://sua-url.onrender.com/health`
- **Ping**: `https://sua-url.onrender.com/ping`
- **API**: `https://sua-url.onrender.com/api/`

## 🔧 Arquivos Modificados

- ✅ `backend/Dockerfile` - Comando de produção
- ✅ `backend/package.json` - Script start para produção
- ✅ `backend/index.ts` - CORS e health checks
- ✅ `backend/.env.production` - Configuração de produção
- ✅ `render.yaml` - Configuração automática

## 📊 Monitoramento

- Health Check: `/health`
- Logs: Painel do Render
- Métricas: Painel do Render

## 🚨 Solução de Problemas

### Build Falha
1. Verificar se todas as dependências estão no `package.json`
2. Verificar se o TypeScript compila sem erros
3. Verificar logs no painel do Render

### Banco de Dados
1. Verificar se a `DATABASE_URL` está correta
2. Verificar se as migrações foram executadas
3. Testar conexão no endpoint `/health`

### Aplicação Não Inicia
1. Verificar se o arquivo `dist/index.js` foi gerado
2. Verificar variáveis de ambiente
3. Verificar logs de startup

## 🔄 Próximos Passos

1. **Configurar CI/CD** - Deploy automático no push
2. **Configurar domínio customizado**
3. **Configurar SSL** (automático no Render)
4. **Configurar monitoramento**
5. **Configurar backup do banco**

## 📞 Endpoints Importantes

- `GET /` - Status geral
- `GET /health` - Health check
- `GET /ping` - Teste básico
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

## 🔒 Segurança

- ✅ CORS configurado
- ✅ Variáveis de ambiente protegidas
- ✅ JWT para autenticação
- ✅ Conexão SSL com banco
- ✅ Validação de entrada (implementar conforme necessário)

## 📝 Notas

- O plano gratuito do Render tem limitações de CPU e memória
- A aplicação pode "dormir" após 15 minutos de inatividade
- Para produção, considere planos pagos para melhor performance
