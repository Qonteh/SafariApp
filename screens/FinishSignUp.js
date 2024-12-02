// FinishSignUp.js (OTP Verification Page)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import firebase from '../firebase/firebaseConfig'; // Firebase instance

const FinishSignUp = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completeSignIn = async () => {
      const email = window.localStorage.getItem('emailForSignIn');
      if (email && firebase.auth().isSignInWithEmailLink(window.location.href)) {
        try {
          // Complete sign-in with the email link
          await firebase.auth().signInWithEmailLink(email, window.location.href);
          window.localStorage.removeItem('emailForSignIn'); // Clear the stored email
          setMessage('You are now logged in!');
          // Navigate to your main screen or dashboard
          navigation.navigate('Dashboard');
        } catch (error) {
          setMessage('Error during OTP verification: ' + error.message);
        }
      } else {
        setMessage('This link is invalid or expired.');
      }
      setLoading(false);
    };

    completeSignIn();
  }, []);

  if (loading) {
    return <View style={styles.container}><Text>Verifying...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FinishSignUp;
