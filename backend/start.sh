#!/bin/bash

# Script de start para produção
echo "🚀 Iniciando aplicação em produção..."

# Verificar se o diretório dist existe
if [ ! -d "dist" ]; then
    echo "❌ Diretório dist não encontrado. Executando build..."
    npm run build
fi

# Executar migrações do Prisma
echo "🗄️ Executando migrações do banco..."
npx prisma migrate deploy

# Iniciar aplicação
echo "▶️ Iniciando servidor..."
npm start
