
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';

//verificar a curva do header e footer

const { width, height } = Dimensions.get('window');

const OnboardNormal = () => {
  const isTablet = width > 768;
  const isLandscape = width > height;
  
  const logoSize = isTablet ? 120 : width * 0.2;
  const titleFontSize = isTablet ? 28 : width * 0.06;
  const descriptionFontSize = isTablet ? 18 : width * 0.04;
  const buttonFontSize = isTablet ? 18 : width * 0.04;
  const buttonWidth = isTablet ? '60%' : '85%';
  const horizontalPadding = isTablet ? width * 0.1 : width * 0.05;
  
  const curveHeight = isTablet ? 200 : height * 0.15;
  const contentMarginTop = isTablet ? 150 : height * 0.12;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.topCurve, { height: curveHeight }]}></View>
      <View style={[styles.contentContainer, { 
        marginTop: contentMarginTop,
        paddingHorizontal: horizontalPadding,
        minHeight: isLandscape ? height * 0.8 : 'auto'
      }]}>
        <Text style={[styles.title, { fontSize: titleFontSize }]}>
          Seu caminho para estudar no exterior começa aqui.
        </Text>
        <Image
          source={require("../../assets/images/canada_leaf_secundaria.png")} 
          style={[styles.logo, { width: logoSize, height: logoSize }]}
        />
        <Text style={[styles.description, { fontSize: descriptionFontSize }]}>
          Descubra programas, filtre opções, simule custos e tire dúvidas com a ajuda do aplicativo CanadaWay.
        </Text>
        <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => router.push('/login')}>
          <Text style={[styles.buttonText, { fontSize: buttonFontSize }]}>Já tenho conta</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => router.push('/cadastro_adm')}>
          <Text style={[styles.buttonText, { fontSize: buttonFontSize }]}>Criar conta como administrador</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { width: buttonWidth }]} onPress={() => router.push('/cadastro_visitante')}>
          <Text style={[styles.buttonText, { fontSize: buttonFontSize }]}>Criar conta como visitante</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.bottomCurve, { height: curveHeight * 0.7 }]}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topCurve: {
    backgroundColor: '#CC2027',
    borderBottomLeftRadius: width * 0.25,
    borderBottomRightRadius: width * 0.25,
    transform: [{ scaleX: 1.5 }],
    position: 'absolute',
    top: -height * 0.05,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.1,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#CC2027',
    marginBottom: height * 0.025,
    lineHeight: width * 0.075,
  },
  logo: {
    resizeMode: 'contain',
    marginBottom: height * 0.025,
  },
  description: {
    textAlign: 'center',
    color: '#666',
    marginBottom: height * 0.04,
    lineHeight: width * 0.055,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    marginBottom: height * 0.015,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#CC2027',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomCurve: {
    backgroundColor: '#CC2027',
    borderTopLeftRadius: width * 0.25,
    borderTopRightRadius: width * 0.25,
    transform: [{ scaleX: 1.5 }],
    position: 'absolute',
    bottom: -height * 0.05,
    width: '100%',
  },
});

export default OnboardNormal;


