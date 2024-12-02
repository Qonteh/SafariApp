import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Modal, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase/firebaseConfig'; // Ensure this path is correct

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [activeScreen, setActiveScreen] = useState(null);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  // Menu items for the side menu
  const menuItems = [
    { id: 1, name: 'Home', screen: 'HomeScreen', icon: 'home' },
    { id: 2, name: 'Trips', screen: 'TripsScreen', icon: 'airplane' },
    { id: 3, name: 'Wallet', screen: 'WalletScreen', icon: 'wallet' },
    { id: 4, name: 'Help', screen: 'HelpScreen', icon: 'help-circle' },
    { id: 5, name: 'Settings', screen: 'SettingsScreen', icon: 'settings' },
    { id: 6, name: 'About', screen: 'AboutScreen', icon: 'information-circle' },
  ];

  useEffect(() => {
    const getLocation = async () => {
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
          const newCoordinate = { latitude, longitude };
          setRouteCoordinates((prev) => [...prev, newCoordinate]);
          saveLocationToFirebase(newCoordinate);

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
    };

    getLocation();
  }, []);

  // Save location data to Firebase Realtime Database
  const saveLocationToFirebase = async (coordinate) => {
    try {
      const locationsRef = ref(database, 'locations');
      const newLocationRef = push(locationsRef);
      await set(newLocationRef, {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        timestamp: new Date().toISOString(),
      });
      console.log('Location saved to Firebase Realtime Database!');
    } catch (error) {
      console.error('Error saving location to Firebase: ', error);
    }
  };

  const handleMenuItemPress = (screenName) => {
    setActiveScreen(screenName);
    setMenuVisible(false);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'HomeScreen':
        return <Text>Home Screen</Text>;
      case 'TripsScreen':
        return <Text>Your Trips</Text>;
      case 'WalletScreen':
        return <Text>Wallet Screen</Text>;
      case 'HelpScreen':
        return <Text>Help Screen</Text>;
      case 'SettingsScreen':
        return <Text>Settings Screen</Text>;
      case 'AboutScreen':
        return <Text>About Us</Text>;
      default:
        return null;
    }
  };

  const handleWhereToPress = () => {
    navigation.navigate('Location', { currentLocation: region });
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsTraffic={true}
        showsBuildings={true}
        showsIndoors={true}
      >
        {region && (
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title="You are here"
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FFA500"
            strokeWidth={4}
          />
        )}
      </MapView>

      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={30} color="#333" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchContainer} onPress={handleWhereToPress}>
        <MaterialIcons name="search" size={24} color="#333" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Where to?</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setMenuVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <ScrollView>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuItemPress(item.screen)}>
                  <Ionicons name={item.icon} size={24} color="#333" style={styles.menuItemIcon} />
                  <Text style={styles.menuItemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {renderActiveScreen()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  searchContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#333',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: height * 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
  },
});

export default MapScreen;

