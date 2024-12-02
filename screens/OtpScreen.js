import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert
} from 'react-native';
import firebase from 'firebase/compat/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    const email = await AsyncStorage.getItem('email');

    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    try {
      const oobCode = 'the-OTP-code'; // Get the OTP code from the email sent earlier.
      // Verification step can be performed here. For simplicity, we are not fetching the code for now.
      await firebase.auth().applyActionCode(oobCode);
      
      // Navigate to the main screen after successful OTP verification
      navigation.replace('Map');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the OTP"
        value={otp}
        onChangeText={setOtp}
        placeholderTextColor="#aaa"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
        <Text style={styles.verifyButtonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  verifyButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OtpScreen;
