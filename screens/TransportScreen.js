import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// Sample transport options data
const transportOptions = [
  { type: 'Toyo', details: 'Carries 2 people', amount: '5,000 TZS' },
  { type: 'Motorcycle', details: 'Carries 1 person', amount: '2,000 TZS' },
  { type: 'Vehicle', details: 'Carries 4 people', amount: '10,000 TZS' },
];

const TransportScreen = () => {
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);
  const route = useRoute();

  // Extracting params with default values
  const { pickup = 'Unknown Pickup', dropoff = 'Unknown Dropoff' } = route.params || {};

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
          setRouteCoordinates(prevCoordinates => [...prevCoordinates, { latitude, longitude }]);
          
          mapRef.current?.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, []);

  // Handle transport type selection
  const handleSelect = (type) => {
    Alert.alert('Transport Selected', `You have selected: ${type}`, [
      { text: 'OK', onPress: () => console.log(`${type} selected`) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          customMapStyle={customMapStyle}
          showsUserLocation={true}
          showsMyLocationButton={true}
          apiKey="AIzaSyCWd2FqI5TfIHGqeKVriC4nqtpRfbIKblk" // Add your Google Maps API key here
          showsCompass={true}
          showsTraffic={true}
          showsBuildings={true}
          showsIndoors={true}
        >
          {region && (
            <Marker
              coordinate={{ latitude: region.latitude, longitude: region.longitude }}
              title="You are here"
            >
              <View style={styles.markerContainer}>
                <Image
                  source={require('../assets/safari-logo.png')}
                  style={styles.markerImage}
                />
              </View>
            </Marker>
          )}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#FFA500"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>
      
      <View style={styles.transportContainer}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>Pickup: {pickup}</Text>
          <Text style={styles.locationText}>Dropoff: {dropoff}</Text>
        </View>

        <Text style={styles.title}>Available Transport</Text>

        <FlatList
          data={transportOptions}
          keyExtractor={(item) => item.type}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleSelect(item.type)}
            >
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.details}>{item.details}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  transportContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 165, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  markerImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  locationInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
    color: '#2d3e50',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3e50',
  },
  details: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  amount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 2,
  },
});

const customMapStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];

export default TransportScreen;

