#!/bin/bash
set -e

echo "🔧 Configurando ambiente de produção..."
export NODE_ENV=production

echo "📦 Instalando dependências..."
npm install --production=false

echo "🏗️ Compilando TypeScript..."
npm run build

echo "🔨 Gerando cliente Prisma..."
npx prisma generate

echo "✅ Build concluído com sucesso!"
