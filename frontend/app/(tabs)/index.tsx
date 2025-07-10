import { router } from 'expo-router';
import  { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.content}>
        <Text style={styles.welcome}>Seja Bem-Vindo!</Text>
        <Image
          source={require('../../assets/images/login_logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholderTextColor="#888"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={() => router.push('/programas')}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/nada')}>
          <Text style={styles.forgot}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
        <Text style={styles.or}>ou</Text>
        <TouchableOpacity onPress={() => router.push('/cadastro_visitante')}>
          <Text style={styles.register}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 60, backgroundColor: '#cb2328' },
  footer: { height: 40, backgroundColor: '#cb2328', marginTop: 'auto' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#cb2328', marginBottom: 20 },
  logo: { width: 300, height: 90, marginBottom: 30 },
  input: {
    width: 300,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    width: 300,
    height: 45,
    backgroundColor: '#cb2328',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgot: { color: '#cb2328', marginTop: 10, fontWeight: 'bold', textAlign: 'center' },
  or: { color: '#cb2328', marginTop: 30, fontWeight: 'bold', textAlign: 'center' },
  register: { color: '#cb2328', marginTop: 5, fontWeight: 'bold', textAlign: 'center' },
});