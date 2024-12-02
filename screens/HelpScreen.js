import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HelpScreen = () => {
  const faqItems = [
    { question: "How do I request a ride?", answer: "Open the app, enter your destination, and tap 'Request Ride'." },
    { question: "How do I contact my driver?", answer: "You can call or message your driver through the app once a ride is confirmed." },
    { question: "What payment methods are accepted?", answer: "We accept credit/debit cards, PayPal, and in-app wallet payments." },
    { question: "How do I report an issue with my ride?", answer: "Go to 'Your Trips', select the ride, and tap 'Report an Issue'." },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Help Center</Text>
      <View style={styles.faqContainer}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={styles.contactButton}>
        <Ionicons name="mail-outline" size={24} color="#FFF" />
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  faqContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  faqItem: {
    marginBottom: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: '#666',
  },
  contactButton: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default HelpScreen;

