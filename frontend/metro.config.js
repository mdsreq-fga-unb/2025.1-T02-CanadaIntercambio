const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configurações específicas para produção web
if (process.env.NODE_ENV === 'production') {
  // Remover source maps e debug info para produção
  config.transformer = {
    ...config.transformer,
    minifierConfig: {
      mangle: {
        keep_fnames: false,
      },
    },
  };
  
  // Otimizações para web
  config.resolver = {
    ...config.resolver,
    platforms: ['web', 'native', 'ios', 'android'],
  };
}

module.exports = config;
