#!/bin/bash

echo "🚀 Iniciando build para web (PRODUÇÃO)..."

# Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf dist/
rm -rf .expo/
rm -rf node_modules/.cache/

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Fazer build para web em modo produção (sem debug tools)
echo "🏗️ Fazendo build web para produção..."
NODE_ENV=production EXPO_NO_DOTENV=1 npx expo export --platform web --output-dir dist --clear

echo "✅ Build concluído!"
echo "📁 Arquivos prontos na pasta 'dist/'"
echo ""
echo "🌐 Para fazer deploy no Netlify:"
echo "1. Acesse netlify.com e faça login"
echo "2. Arraste a pasta 'dist/' para o deploy"
echo "3. Ou use: npx netlify deploy --prod --dir=dist"
echo ""
echo "🔗 Ou configure deploy automático conectando seu repositório GitHub!"
echo ""
echo "⚠️  IMPORTANTE: Use a pasta 'dist/' não a raiz do projeto!"
