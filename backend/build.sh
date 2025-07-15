#!/bin/bash

# Script de build para produção no Render
echo "🚀 Iniciando build para produção..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# Gerar Prisma Client
echo "🔄 Gerando Prisma Client..."
npx prisma generate

# Executar migrações
echo "🗄️ Executando migrações do banco..."
npx prisma migrate deploy

# Build da aplicação
echo "🔨 Compilando TypeScript..."
npm run build

echo "✅ Build concluído com sucesso!"
