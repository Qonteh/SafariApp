// screens/SplashScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Navigate to Login after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/safari-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Safari App</Text>
      <ActivityIndicator size="large" color="#246bd4" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf5ff', // Light background tone from logo
  },
  logo: {
    width: 150, // Adjust size based on your preference
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6cbf73', // Green color from the logo
  },
  loader: {
    marginTop: 20,
  },
});

export default SplashScreen;
