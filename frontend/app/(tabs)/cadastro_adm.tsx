import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function CadastroAdm() {
  const { register } = useAuth();
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [ddd, setDdd] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [unidade, setUnidade] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cargoInterno, setCargoInterno] = useState('');
  const [aceito, setAceito] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validar se aceitou os termos
    if (!aceito) {
      Alert.alert('Erro', 'Você deve aceitar os termos e condições para continuar.');
      return;
    }

    // Validar campos obrigatórios
    if (!nome || !sobrenome || !email || !senha || !confirmarSenha || !cargoInterno) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar se senhas coincidem
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName: nome,
        lastName: sobrenome,
        email: email.trim(),
        password: senha,
        phone: ddd && telefone ? `${ddd}${telefone}` : undefined,
        nearestUnit: unidade || undefined,
        userType: 'admin',
        internalRole: cargoInterno,
      });
      
      // Sucesso - redirecionar para programas
      Alert.alert(
        'Sucesso!', 
        'Cadastro de administrador realizado com sucesso! Bem-vindo!',
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
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/login_logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cadastro de Administrador</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
          placeholderTextColor="#888"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          value={sobrenome}
          onChangeText={setSobrenome}
          placeholderTextColor="#888"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#888"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Cargo Interno"
          value={cargoInterno}
          onChangeText={setCargoInterno}
          placeholderTextColor="#888"
          editable={!loading}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.inputDDD]}
            placeholder="DDD"
            value={ddd}
            onChangeText={setDdd}
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#888"
          />
          <TextInput
            style={[styles.input, styles.inputTelefone]}
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            placeholderTextColor="#888"
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento"
          value={dataNascimento}
          onChangeText={setDataNascimento}
          placeholderTextColor="#888"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={unidade}
            onValueChange={setUnidade}
            style={styles.picker}
          >
            <Picker.Item label="Filial" value="" color="#888"/>
            <Picker.Item label="São Paulo" value="sp" color="#888"/>
            <Picker.Item label="Rio de Janeiro" value="rj" color="#888"/>
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          placeholderTextColor="#888"
        />
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={aceito ? 'checked' : 'unchecked'}
            onPress={() => setAceito(!aceito)}
            color="#cb2328"
            uncheckedColor='#888'
          />
          <Text style={styles.checkboxText}>
            Eu li e concordo em receber notificações e demais informativos da Canada Intercambio de acordo com as{' '}
            <Text style={styles.link}>políticas de privacidade</Text>.
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Criando...' : 'Criar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center'  },
  header: { height: 70, backgroundColor: '#cb2328', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 250, height: 60, marginTop: 10 },
  footer: { height: 40, backgroundColor: '#cb2328', marginTop: 'auto' },
  content: { alignItems: 'center', padding: 20 , flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#cb2328', marginVertical: 20, textAlign: 'center', alignSelf: 'stretch' },
  input: {
    width: 300,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: 300 },
  inputDDD: { width: 70, marginRight: 10 },
  inputTelefone: { flex: 1 },
  pickerContainer: {
    width: 300,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: { width: '100%', height: 40 , color: '#888', borderWidth: 0, backgroundColor: 'transparent', paddingHorizontal: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 10, width: 300},
  checkboxText: { flex: 1, fontSize: 12, color: '#333', marginLeft: 8 },
  link: { color: '#cb2328', textDecorationLine: 'underline' },
  button: {
    width: 300,
    height: 45,
    backgroundColor: '#cb2328',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});