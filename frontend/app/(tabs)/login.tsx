import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginForm } from '../../hooks/useLoginForm';

export default function LoginScreen() {
  const { login } = useAuth();
  const {
    email,
    password,
    errors,
    loading,
    setEmail,
    setPassword,
    setLoading,
    validateForm,
    clearErrors,
  } = useLoginForm();

  const handleLogin = async () => {
    // Limpar erros anteriores
    clearErrors();

    // Validar formulário
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      
      // Sucesso - redirecionar
      Alert.alert(
        'Sucesso!', 
        'Login realizado com sucesso',
        [{ text: 'OK', onPress: () => router.push('/programas') }]
      );
    } catch (error: any) {
      // Erro - mostrar mensagem
      Alert.alert(
        'Erro no Login',
        error.message || 'Erro inesperado. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Limpar erro do email quando usuário começa a digitar
    if (errors.email) {
      clearErrors();
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Limpar erro da senha quando usuário começa a digitar
    if (errors.password) {
      clearErrors();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.welcome}>Seja Bem-Vindo!</Text>
          
          <Image
            source={require('../../assets/images/login_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.form}>
            <Input
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={handleEmailChange}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            
            <Input
              placeholder="Digite sua senha"
              value={password}
              onChangeText={handlePasswordChange}
              error={errors.password}
              secureTextEntry
              editable={!loading}
            />
            
            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
            />
          </View>
          
          <TouchableOpacity 
            onPress={() => router.push('/nada')}
            disabled={loading}
          >
            <Text style={[styles.forgot, loading && styles.disabledText]}>
              Esqueceu sua senha?
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.or}>ou</Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/cadastro_visitante')}
            disabled={loading}
          >
            <Text style={[styles.register, loading && styles.disabledText]}>
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    height: 60, 
    backgroundColor: '#cb2328' 
  },
  footer: { 
    height: 40, 
    backgroundColor: '#cb2328', 
    marginTop: 'auto' 
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcome: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#cb2328', 
    marginBottom: 20 
  },
  logo: { 
    width: 300, 
    height: 90, 
    marginBottom: 30 
  },
  form: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    marginVertical: 10,
  },
  forgot: { 
    color: '#cb2328', 
    marginTop: 10, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  or: { 
    color: '#cb2328', 
    marginTop: 30, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  register: { 
    color: '#cb2328', 
    marginTop: 5, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  disabledText: {
    opacity: 0.5,
  },
});