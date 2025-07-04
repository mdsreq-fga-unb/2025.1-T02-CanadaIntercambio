import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function NadaScreen() {
    const { width, height } = Dimensions.get('window');
    const isTablet = width > 768;
    const logoSize = isTablet ? 120 : width * 0.2;

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
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/login')}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      {/* Conteúdo */}
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/canada_leaf_secundaria.png')}
          style={[styles.logo, { width: logoSize, height: logoSize }]}
          resizeMode="contain"
        />
        <Text style={styles.message}>
          Essa tela ainda não está{'\n'}
          disponível, nossa equipe está{'\n'}
          trabalhando nela!
        </Text>
      </View>
      {/* Footer vermelho */}
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
    header: { height: 70, backgroundColor: '#cb2328', justifyContent: 'center', alignItems: 'center' },
    logo: { width: 250, height: 60, marginTop: 10 },
  backButton: {
    marginTop: 16,
    marginLeft: 16,
  },
  backText: {
    fontSize: 24,
    color: '#222',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaf: {
    width: 60,
    height: 60,
    marginBottom: 16,
    tintColor: '#CC2027',
  },
  message: {
    color: '#CC2027',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 26,
  },
  footer: {
    height: 40,
    backgroundColor: '#CC2027',
    width: '100%',
  },
});