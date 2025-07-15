// Configuração para remover debug tools em produção
if (process.env.NODE_ENV === 'production') {
  // Remover console.log em produção
  if (typeof console !== 'undefined') {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
  }
  
  // Remover React DevTools
  if (typeof window !== 'undefined') {
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      isDisabled: true,
      supportsFiber: true,
      inject: () => {},
      onCommitFiberRoot: () => {},
      onCommitFiberUnmount: () => {},
    };
  }
}

// Configuração para Expo Web
if (typeof window !== 'undefined' && (window as any).expo) {
  (window as any).expo.isInClient = false;
  (window as any).expo.isInExpoClient = false;
}

export {};
