const path = require('path');

module.exports = (() => {
  const config = require('./app.json').expo;
  
  // Configurações específicas para produção web
  if (process.env.NODE_ENV === 'production') {
    // Remover debug tools para produção
    config.web = {
      ...config.web,
      name: 'Canada Intercâmbio',
      shortName: 'Canada Intercâmbio',
      description: 'Aplicativo oficial da Canada Intercâmbio',
      themeColor: '#cb2328',
      backgroundColor: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      startUrl: '/',
      // Remover ferramentas de debug
      bundler: 'metro',
      output: 'static'
    };
    
    // Remover plugins de desenvolvimento
    config.plugins = config.plugins || [];
    config.plugins = config.plugins.filter(plugin => {
      // Remover plugins que podem causar debug bars
      if (typeof plugin === 'string') {
        return !plugin.includes('expo-dev-client') && !plugin.includes('expo-dev-launcher');
      }
      if (Array.isArray(plugin)) {
        return !plugin[0].includes('expo-dev-client') && !plugin[0].includes('expo-dev-launcher');
      }
      return true;
    });
    
    // Desabilitar modo de desenvolvimento
    config.developmentClient = false;
    config.experiments = {
      ...config.experiments,
      typedRoutes: true
    };
  }
  
  return config;
})();
