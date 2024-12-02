import React from 'react';
import { View, Button } from 'react-native';
import firebase from 'firebase/firestore';

const HomeScreen = () => {
  const addData = async () => {
    try {
      const db = firebase.firestore();
      await db.collection('users').add({
        name: 'John Doe',
        email: 'johndoe@example.com',
        createdAt: new Date(),
      });
      console.log('Data added successfully!');
    } catch (error) {
      console.error('Error adding data: ', error.message);
    }
  };

  return (
    <View>
      <Button title="Add Data" onPress={addData} />
    </View>
  );
};

export default HomeScreen;
