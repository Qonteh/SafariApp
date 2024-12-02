// OTPVerificationScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import firebase from '../firebase/firebaseConfig';

const OTPVerification = ({ navigation }) => {
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Check if the URL contains the verification link
    const verifyLink = window.localStorage.getItem('emailForSignIn');
    if (verifyLink) {
      setEmail(verifyLink);
    } else {
      Alert.alert('Error', 'No email found for OTP verification.');
    }
  }, []);

  const handleVerify = async () => {
    const email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      Alert.alert('Error', 'Email is not found!');
      return;
    }

    try {
      // Confirm the OTP by verifying the email link
      await firebase.auth().signInWithEmailLink(email, window.location.href);

      // User is now signed in, clear local storage and navigate
      window.localStorage.removeItem('emailForSignIn');
      navigation.navigate('Home'); // Navigate to your home screen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <Text>Verify OTP for {email}</Text>
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
};

export default OTPVerification;
