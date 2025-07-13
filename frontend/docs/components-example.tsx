import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

// Exemplo de como usar os componentes reutilizáveis em outras telas
export default function ExampleScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      {/* Input básico */}
      <Input 
        placeholder="Digite seu nome"
        label="Nome completo"
      />

      {/* Input com erro */}
      <Input 
        placeholder="Digite seu email"
        label="E-mail"
        error="Formato de e-mail inválido"
        keyboardType="email-address"
      />

      {/* Botões com diferentes variantes */}
      <Button 
        title="Botão Primário"
        onPress={() => console.log('Primário')}
      />

      <Button 
        title="Botão Secundário"
        variant="secondary"
        onPress={() => console.log('Secundário')}
      />

      <Button 
        title="Botão Outline"
        variant="outline"
        onPress={() => console.log('Outline')}
      />

      {/* Botão com loading */}
      <Button 
        title="Carregando..."
        loading={true}
        onPress={() => console.log('Loading')}
      />

      {/* Botão pequeno */}
      <Button 
        title="Pequeno"
        size="small"
        onPress={() => console.log('Pequeno')}
      />

      {/* Botão de logout usando o contexto */}
      <Button 
        title="Sair"
        variant="outline"
        onPress={logout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 15,
  },
});
