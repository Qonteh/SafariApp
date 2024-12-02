import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = () => {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/safari-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>SafariApp</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.description}>
          SafariApp is your trusted ride-hailing service, providing safe and convenient transportation across the city. Our mission is to make urban mobility accessible, affordable, and enjoyable for everyone.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect With Us</Text>
        <TouchableOpacity style={styles.linkButton} onPress={() => openLink('https://www.facebook.com/safariapp')}>
          <Ionicons name="logo-facebook" size={24} color="#3b5998" />
          <Text style={styles.linkText}>Follow us on Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={() => openLink('https://www.twitter.com/safariapp')}>
          <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
          <Text style={styles.linkText}>Follow us on Twitter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={() => openLink('https://www.instagram.com/safariapp')}>
          <Ionicons name="logo-instagram" size={24} color="#e1306c" />
          <Text style={styles.linkText}>Follow us on Instagram</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity style={styles.linkButton} onPress={() => openLink('https://safariapp.com/terms')}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={() => openLink('https://safariapp.com/privacy')}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFA500',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  version: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default AboutScreen;

