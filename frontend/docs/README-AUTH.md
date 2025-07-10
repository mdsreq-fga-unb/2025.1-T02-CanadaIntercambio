# Sistema de Autenticação - Canada Intercâmbio

Este documento descreve a implementação do sistema de autenticação integrado entre frontend (React Native/Expo) e backend (Node.js/Express).

## 📋 Funcionalidades Implementadas

### ✅ Frontend
- **Tela de login** integrada com validação em tempo real
- **Componentes reutilizáveis**: Input e Button customizados
- **Contexto de autenticação** global (AuthContext)
- **Hook personalizado** para gerenciamento de formulário (useLoginForm)
- **Validação de campos** conforme regras do backend
- **Feedback visual** com loading states e mensagens de erro
- **Armazenamento seguro** de token e dados do usuário (AsyncStorage)

### ✅ Backend
- **Rotas de autenticação**: `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`
- **Validação robusta** de email e senha
- **JWT tokens** para autenticação
- **Middleware de autenticação** para rotas protegidas
- **Hash de senhas** com bcryptjs

## 🔧 Estrutura de Arquivos

### Frontend
```
frontend/
├── constants/
│   └── api.ts                 # Configurações da API
├── services/
│   └── authService.ts         # Service para comunicação com API
├── contexts/
│   └── AuthContext.tsx        # Contexto global de autenticação
├── hooks/
│   └── useLoginForm.ts        # Hook para gerenciar formulário
├── components/
│   ├── Input.tsx              # Componente de input reutilizável
│   └── Button.tsx             # Componente de botão reutilizável
└── app/
    ├── _layout.tsx            # Layout com AuthProvider
    └── (tabs)/
        └── login.tsx          # Tela de login integrada
```

### Backend
```
backend/src/
├── controllers/
│   └── AuthController.ts      # Controller de autenticação
├── services/
│   └── AuthService.ts         # Lógica de negócio
├── routes/
│   └── authRoutes.ts          # Rotas de autenticação
├── middleware/
│   └── AuthMiddleware.ts      # Middleware de autenticação
└── types/
    └── auth.ts                # Tipos TypeScript
```

## 🚀 Como Usar

### 1. Iniciar o Backend
```bash
cd backend
npm run dev
```
O backend rodará em `http://localhost:3000`

### 2. Iniciar o Frontend
```bash
cd frontend
npm start
```

### 3. Testando o Login
1. Abra a tela de login no app
2. Digite um email válido e senha (mín. 6 caracteres)
3. As validações acontecem em tempo real
4. Após login bem-sucedido, é redirecionado para `/programas`

## 📱 Validações Implementadas

### Email
- ✅ Campo obrigatório
- ✅ Formato válido (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)

### Senha
- ✅ Campo obrigatório
- ✅ Mínimo 6 caracteres

### Estados Visuais
- ✅ Loading durante requisição
- ✅ Campos desabilitados durante carregamento
- ✅ Mensagens de erro específicas
- ✅ Feedback de sucesso/erro

## 🔐 Segurança

- **Tokens JWT** com expiração
- **Senhas hasheadas** com bcryptjs (salt rounds: 10)
- **Validação tanto no frontend quanto backend**
- **Headers de autorização** automáticos via interceptor do axios
- **Limpeza de dados** sensíveis no logout

## 🛠️ Tecnologias Utilizadas

### Frontend
- React Native + Expo
- TypeScript
- Axios (HTTP client)
- AsyncStorage (armazenamento local)
- Context API (gerenciamento de estado)

### Backend
- Node.js + Express
- TypeScript
- Prisma (ORM)
- JWT (jsonwebtoken)
- bcryptjs (hash de senhas)
- CORS habilitado

## 📝 Próximos Passos

1. **Implementar tela de cadastro** com validações similares
2. **Adicionar recuperação de senha**
3. **Implementar refresh tokens**
4. **Adicionar biometria** (Touch ID/Face ID)
5. **Melhorar feedback visual** (toasts customizados)

## 🐛 Troubleshooting

### Erro de conexão
- Verifique se o backend está rodando na porta 3000
- Confirme que o IP está correto no `constants/api.ts`

### Erro de autenticação
- Verifique se o usuário está cadastrado no banco
- Confirme que a senha tem pelo menos 6 caracteres

### Erro de validação
- As validações seguem as mesmas regras do backend
- Verifique os logs para detalhes específicos
