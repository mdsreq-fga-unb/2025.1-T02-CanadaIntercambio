import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useRegisterForm } from '../../hooks/useRegisterForm';

export default function CadastroVisitante() {
  const { register } = useAuth();
  const {
    firstName,
    lastName,
    email,
    phone,
    nearestUnit,
    password,
    confirmPassword,
    errors,
    loading,
    setFirstName,
    setLastName,
    setEmail,
    setPhone,
    setNearestUnit,
    setPassword,
    setConfirmPassword,
    setLoading,
    validateForm,
    clearErrors,
    getRegisterData,
  } = useRegisterForm();

  const [aceito, setAceito] = useState(false);

  const handleRegister = async () => {
    // Limpar erros anteriores
    clearErrors();

    // Validar se aceitou os termos
    if (!aceito) {
      Alert.alert('Erro', 'Você deve aceitar os termos e condições para continuar.');
      return;
    }

    // Validar formulário
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(getRegisterData());
      
      // Sucesso - redirecionar para programas
      Alert.alert(
        'Sucesso!', 
        'Cadastro realizado com sucesso! Bem-vindo!',
        [{ text: 'OK', onPress: () => router.replace('/programas') }]
      );
    } catch (error: any) {
      // Erro - mostrar mensagem detalhada
      const errorMessage = error.message || 'Erro inesperado. Tente novamente.';
      Alert.alert(
        'Erro no Cadastro',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/login_logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Preencha os dados abaixo:</Text>
        
        <Input
          placeholder="Nome"
          value={firstName}
          onChangeText={setFirstName}
          error={errors.firstName}
          editable={!loading}
        />
        
        <Input
          placeholder="Sobrenome"
          value={lastName}
          onChangeText={setLastName}
          error={errors.lastName}
          editable={!loading}
        />
        
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        
        <Input
          placeholder="Telefone (opcional)"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={nearestUnit}
            onValueChange={setNearestUnit}
            style={styles.picker}
            enabled={!loading}
          >
            <Picker.Item label="Selecione a unidade mais próxima" value="" />
            <Picker.Item label="São Paulo - SP" value="sao-paulo" />
            <Picker.Item label="Rio de Janeiro - RJ" value="rio-janeiro" />
            <Picker.Item label="Belo Horizonte - MG" value="belo-horizonte" />
            <Picker.Item label="Brasília - DF" value="brasilia" />
            <Picker.Item label="Porto Alegre - RS" value="porto-alegre" />
          </Picker>
        </View>
        
        <Input
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          editable={!loading}
        />
        
        <Input
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={errors.confirmPassword}
          secureTextEntry
          editable={!loading}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={aceito ? 'checked' : 'unchecked'}
            onPress={() => setAceito(!aceito)}
            disabled={loading}
          />
          <Text style={styles.checkboxText}>
            Eu li e concordo em receber notificações e demais informativos da Canada Intercambio de acordo com as{' '}
            <Text style={styles.link}>políticas de privacidade</Text>.
          </Text>
        </View>
        
        <Button
          title={loading ? "Criando..." : "Criar Conta"}
          onPress={handleRegister}
          loading={loading}
          disabled={loading || !aceito}
          style={styles.button}
        />
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
    height: 70, 
    backgroundColor: '#cb2328', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  logo: { 
    width: 250, 
    height: 60, 
    marginTop: 10 
  },
  footer: { 
    height: 40, 
    backgroundColor: '#cb2328', 
    marginTop: 'auto' 
  },
  content: { 
    alignItems: 'center', 
    padding: 20, 
    flexGrow: 1, 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#cb2328', 
    marginVertical: 20, 
    textAlign: 'center' 
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  picker: { 
    width: '100%', 
    height: 48,
    color: '#333',
  },
  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginVertical: 10, 
    width: '100%',
    maxWidth: 350,
  },
  checkboxText: { 
    flex: 1, 
    fontSize: 12, 
    color: '#333', 
    marginLeft: 8 
  },
  link: { 
    color: '#cb2328', 
    textDecorationLine: 'underline' 
  },
  button: {
    width: '100%',
    maxWidth: 350,
    marginVertical: 20,
  },
});
