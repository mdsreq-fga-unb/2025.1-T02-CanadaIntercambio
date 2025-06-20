import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardMobile = () => {
  const isTablet = width > 768;
  const logoSize = isTablet ? 150 : width * 0.25;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/canada_leaf.png')} 
        style={[styles.logo, { width: logoSize, height: logoSize }]}
      />
    </View>
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


