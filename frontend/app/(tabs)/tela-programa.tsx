 import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';


const torontoSkyline = require('../../assets/images/toronto.jpg');

export default function ProgramaDetalhe() {
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

      {/* Voltar */}
      <TouchableOpacity style={styles.backButton}>
        <Feather name="arrow-left" size={28} color="#cb2328" />
      </TouchableOpacity>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Image source={torontoSkyline} style={styles.programImage} />
        <Text style={styles.title}>High School</Text>

        <View style={styles.list}>
  <Text style={styles.itemTitle}>- Localização</Text>
  <TextInput
    style={styles.inputField}
    placeholder="Digite a localização"
    placeholderTextColor="#999"
  />

  <Text style={styles.itemTitle}>- Duração</Text>
  <TextInput
    style={styles.inputField}
    placeholder="Ex: 4 a 24 semanas"
    placeholderTextColor="#999"
  />

  <Text style={styles.itemTitle}>- Tipo de acomodação</Text>
  <TextInput
    style={styles.inputField}
    placeholder="Ex: Casa de família"
    placeholderTextColor="#999"
  />

  <Text style={styles.itemTitle}>- Público-alvo</Text>
  <TextInput
    style={styles.inputField}
    placeholder="Ex: Jovens de 15 a 18 anos"
    placeholderTextColor="#999"
  />

  <Text style={styles.itemTitle}>- O que está incluso</Text>
  <TextInput
    style={styles.inputField}
    placeholder="Ex: Aulas, hospedagem, seguro"
    placeholderTextColor="#999"
    multiline
  />

  <Text style={styles.itemTitle}>- Vantagens / resumo do programa</Text>
  <TextInput
    style={styles.inputField}
    placeholder="Descreva os diferenciais do programa"
    placeholderTextColor="#999"
    multiline
  />
</View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Falar com o especialista!</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.bottomNavigation}>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="map-marker" size={24} color="white" />
          <Text style={styles.navText}>Programas</Text>
        </View>
        <View style={styles.navItem}>
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navText}>Perfil</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="chatbox" size={24} color="white" />
          <Text style={styles.navText}>Quiz</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 70, backgroundColor: '#cb2328', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 60, marginTop: 10 },
  backButton: { position: 'absolute', top: 30, left: 20, zIndex: 2 },
  content: { flex: 1, alignItems: 'center', padding: 20, paddingTop: 0 },
  programImage: {
    width: 220,
    height: 140,
    borderRadius: 24,
    marginTop: 16,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  title: {
    color: '#cb2328',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
  },
  list: { width: '100%', marginBottom: 24 },
  itemTitle: {
    color: '#cb2328',
    fontWeight: 'bold',
    fontSize: 17,
    marginTop: 10,
    marginBottom: 2,
  },
  itemText: {
    color: '#222',
    fontSize: 15,
    marginBottom: 6,
  },
  button: {
    backgroundColor: '#cb2328',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  bottomNavigation: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navItem: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 10, marginTop: 4 },

  inputField: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginBottom: 16,
  fontSize: 16,
  color: '#333',
},

});