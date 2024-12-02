import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { database } from './firebaseConfig';
import { ref, set } from 'firebase/database';

const LocationSaver = ({ location }) => {
  const [isSaving, setIsSaving] = useState(false);

  const saveLocation = async () => {
    if (!location) {
      Alert.alert('Error', 'No location to save');
      return;
    }

    setIsSaving(true);
    try {
      const locationRef = ref(database, 'locations/' + Date.now());
      await set(locationRef, {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: Date.now()
      });
      Alert.alert('Success', 'Location saved successfully');
    } catch (error) {
      console.error('Error saving location to Firebase: ', error);
      Alert.alert('Error', 'Failed to save location');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View>
      <Button 
        title={isSaving ? "Saving..." : "Save Location"} 
        onPress={saveLocation} 
        disabled={isSaving}
      />
    </View>
  );
};

export default LocationSaver;

