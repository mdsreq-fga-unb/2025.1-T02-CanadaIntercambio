import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';
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

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

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
      
      // Sucesso - mostrar toast e redirecionar
      console.log('Login realizado com sucesso, redirecionando para programas...');
      showToast('Login realizado com sucesso!', 'success');
      
      // Aguardar um pouco para mostrar o toast antes de redirecionar
      setTimeout(() => {
        router.replace('/programas');
      }, 500);
      
    } catch (error: any) {
      // Erro - mostrar toast de erro com duração maior
      const errorMessage = error.message || 'Erro inesperado. Tente novamente.';
      showToast(errorMessage, 'error');
      console.error('Erro no login:', error);
      
      // Também mostrar um Alert para garantir que o usuário veja o erro
      setTimeout(() => {
        Alert.alert(
          'Erro no Login',
          errorMessage,
          [{ text: 'OK' }]
        );
      }, 100);
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
              title={loading ? "Entrando..." : "Entrar"}
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !email.trim() || !password}
              style={[
                styles.loginButton,
                (loading || !email.trim() || !password) && styles.loginButtonDisabled
              ]}
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

      {/* Toast para feedback */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        duration={toast.type === 'error' ? 5000 : 3000}
      />
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
    minHeight: 500,
  },
  welcome: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#cb2328', 
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: { 
    width: '80%',
    maxWidth: 300, 
    height: 90, 
    marginBottom: 30 
  },
  form: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  loginButton: {
    width: '100%',
    marginVertical: 15,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  forgot: { 
    color: '#cb2328', 
    marginTop: 15, 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 16,
  },
  or: { 
    color: '#cb2328', 
    marginTop: 30, 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 16,
  },
  register: { 
    color: '#cb2328', 
    marginTop: 10, 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.5,
  },
});