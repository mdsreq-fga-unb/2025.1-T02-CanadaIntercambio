import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const OnboardNormal = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/login_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Seu caminho para estudar no exterior começa aqui.</Text>

        <Image
          source={require('../../assets/images/canada_leaf_secundaria.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.description}>
          Descubra programas, filtre opções, simule custos e tire dúvidas com a ajuda do aplicativo CanadaWay.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Já tenho conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/cadastro_adm')}
        >
          <Text style={styles.buttonText}>Criar conta como administrador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/cadastro_visitante')}
        >
          <Text style={styles.buttonText}>Criar conta como visitante</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 70,
    backgroundColor: '#cb2328',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 60,
    marginTop: 10,
  },
  footer: {
    height: 40,
    backgroundColor: '#cb2328',
    marginTop: 'auto',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cb2328',
    marginVertical: 20,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#cb2328',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OnboardNormal;
