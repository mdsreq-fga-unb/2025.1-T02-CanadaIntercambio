import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const OnboardMobile = () => {
  const isTablet = width > 768;
  const logoSize = isTablet ? 150 : width * 0.25;

  useEffect(() => {
      const timer = setTimeout(() => {
        router.push('/onboard');
      }, 5000);
      return () => clearTimeout(timer);
    }, []);

  return (
    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => router.push('/onboard')}>
      <Image
        source={require('../../assets/images/canada_leaf.png')} 
        style={[styles.logo, { width: logoSize, height: logoSize }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CC2027',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  logo: {
    resizeMode: 'contain',
  },
});

export default OnboardMobile;