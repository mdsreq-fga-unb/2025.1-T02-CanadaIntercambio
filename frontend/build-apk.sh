#!/bin/bash

echo "📱 Iniciando build do APK..."

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    echo "🔧 Instalando EAS CLI..."
    npm install -g eas-cli
fi

# Fazer login no EAS (se necessário)
echo "🔑 Verifique se está logado no EAS..."
eas whoami || {
    echo "❌ Você precisa fazer login no EAS:"
    echo "   Run: eas login"
    exit 1
}

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Fazer build do APK
echo "🏗️ Fazendo build do APK..."
echo "⏳ Isso pode demorar alguns minutos..."
npm run build:android

echo "✅ Build iniciado!"
echo "📱 O APK será gerado na nuvem"
echo "🔗 Acompanhe o progresso em: https://expo.dev/accounts/[sua-conta]/projects/canada-intercambio/builds"
echo ""
echo "📥 Para baixar o APK quando estiver pronto:"
echo "   eas build:list"
echo "   eas build:download [build-id]"
