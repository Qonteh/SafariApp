import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Text,
  ActivityIndicator,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const GOOGLE_API_KEY = 'AIzaSyBNiWJ_iw2qF35G-O3GgTH1VChpRY_k3oUs'; // Replace with your actual API Key
const { height } = Dimensions.get('window');

const LocationScreen = () => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [dropoffCoordinates, setDropoffCoordinates] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Please enable location services to use this feature.');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setPickupCoordinates({ latitude, longitude });

      await fetchAddressFromCoordinates(latitude, longitude, setPickup);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching current location:', error);
      Alert.alert('Error', 'Failed to fetch current location. Please try again.');
      setIsLoading(false);
    }
  };

  const fetchAddressFromCoordinates = async (lat, lng, setAddress) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            latlng: `${lat},${lng}`,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const { results } = response.data;
      if (results && results[0]) {
        setAddress(results[0].formatted_address);
        console.log('Location obtained:', results[0].formatted_address);
      } else {
        console.warn('No address found for the given coordinates');
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Error fetching address');
    }
  };

  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: GOOGLE_API_KEY,
            types: 'geocode',
          },
        }
      );

      const { predictions } = response.data;
      const filteredSuggestions = predictions.map((prediction) => ({
        description: prediction.description,
        placeId: prediction.place_id,
      }));
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchCoordinatesFromPlaceId = async (placeId, setCoordinates, setAddress) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const { location } = response.data.result.geometry;
      setCoordinates({
        latitude: location.lat,
        longitude: location.lng,
      });

      setAddress(response.data.result.formatted_address);
    } catch (error) {
      console.error('Error fetching coordinates from place ID:', error);
    }
  };

  const handleLocationSelect = async (item, isPickup) => {
    if (isPickup) {
      setPickup(item.description);
      setPickupSuggestions([]);
      await fetchCoordinatesFromPlaceId(item.placeId, setPickupCoordinates, setPickup);
    } else {
      setDropoff(item.description);
      setDropoffSuggestions([]);
      await fetchCoordinatesFromPlaceId(item.placeId, setDropoffCoordinates, setDropoff);
      setShowConfirmation(true);
    }
  };

  const handleConfirmation = () => {
    navigation.navigate('MapScreen', {
      pickup: pickup,
      pickupCoordinates: pickupCoordinates,
      dropoff: dropoff,
      dropoffCoordinates: dropoffCoordinates,
    });
  };

  const renderSuggestions = (suggestions, isPickup) => (
    <FlatList
      style={styles.suggestionsList}
      data={suggestions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.suggestionItem}
          onPress={() => handleLocationSelect(item, isPickup)}
        >
          <Ionicons name={isPickup ? "location-outline" : "flag-outline"} size={24} color="#333" style={styles.suggestionIcon} />
          <Text style={styles.suggestionText}>{item.description}</Text>
        </TouchableOpacity>
      )}
    />
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching your location...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="location" size={24} color="#333" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={pickup}
            onChangeText={(text) => {
              setPickup(text);
              fetchSuggestions(text, setPickupSuggestions);
            }}
            placeholder="Pickup Location"
            placeholderTextColor="#aaa"
          />
        </View>
        {renderSuggestions(pickupSuggestions, true)}
        <View style={styles.inputWrapper}>
          <Ionicons name="flag" size={24} color="#333" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={dropoff}
            onChangeText={(text) => {
              setDropoff(text);
              fetchSuggestions(text, setDropoffSuggestions);
            }}
            placeholder="Drop-off Location"
            placeholderTextColor="#aaa"
          />
        </View>
        {renderSuggestions(dropoffSuggestions, false)}
      </View>
      {showConfirmation && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>Confirm your trip?</Text>
          <View style={styles.confirmationDetails}>
            <Text style={styles.confirmationDetailText}>From: {pickup}</Text>
            <Text style={styles.confirmationDetailText}>To: {dropoff}</Text>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmation}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  inputContainer: {
    padding: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  suggestionsList: {
    maxHeight: height * 0.3,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionIcon: {
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 16,
  },
  confirmationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmationDetails: {
    marginBottom: 15,
  },
  confirmationDetailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationScreen;

