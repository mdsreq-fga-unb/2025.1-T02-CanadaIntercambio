import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function EditarPerfil() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [unidade, setUnidade] = useState('');
  const [temPassaporte, setTemPassaporte] = useState('');

  const unidades = [
    'Brasília',
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Outra'
  ];

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
      <TouchableOpacity style={styles.backButton} onPress={() => { /* navegação de voltar */ }}>
        <Feather name="arrow-left" size={28} color="#cb2328" />
      </TouchableOpacity>

      {/* Foto de perfil */}
      <View style={styles.profileContainer}>
        <View style={styles.avatarCircle}>
          <Feather name="user" size={60} color="#bbb" />
        </View>
        <TouchableOpacity>
          <Text style={styles.alterarFoto}>Alterar foto de perfil</Text>
        </TouchableOpacity>
      </View>

      {/* Formulário */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome Completo"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={[styles.input, styles.input]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />
        {/* Unidade como Picker em todas as plataformas */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={unidade}
            onValueChange={setUnidade}
            style={styles.picker}
          >
            <Picker.Item label="Unidade Mais Próxima de Você" value="" />
            {unidades.map(u => (
              <Picker.Item key={u} label={u} value={u} />
            ))}
          </Picker>
        </View>
        {/* Passaporte */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={temPassaporte}
            onValueChange={setTemPassaporte}
            style={styles.picker}
          >
            <Picker.Item label="Já tem Passaporte" value="" />
            <Picker.Item label="Sim" value="sim" />
            <Picker.Item label="Não" value="nao" />
          </Picker>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer} />

      {/* Bottom Navigation */}
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 70, backgroundColor: '#cb2328', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 200, height: 60, marginTop: 10 },
  backButton: { position: 'absolute', top: 30, left: 20, zIndex: 2 },
  profileContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  alterarFoto: {
    color: '#cb2328',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 15,
  },
  formContainer: {
    width: '85%',
    alignSelf: 'center',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  inputHighlight: {
    borderColor: '#B39DDB',
    borderWidth: 2,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#cb2328',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  footer: { height: 40, marginTop: 'auto' },

  bottomNavigation: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20, // Ajuste para a safe area em dispositivos com notch
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
});