import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TripsScreen = () => {
  const trips = [
    { id: '1', from: 'Home', to: 'Work', date: '2023-05-15', cost: '$15.50' },
    { id: '2', from: 'Gym', to: 'Mall', date: '2023-05-14', cost: '$8.75' },
    { id: '3', from: 'Airport', to: 'Hotel', date: '2023-05-10', cost: '$32.00' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.tripItem}>
      <View style={styles.tripInfo}>
        <Text style={styles.tripDate}>{item.date}</Text>
        <View style={styles.tripRoute}>
          <Text style={styles.tripLocation}>{item.from}</Text>
          <Ionicons name="arrow-forward" size={16} color="#666" />
          <Text style={styles.tripLocation}>{item.to}</Text>
        </View>
      </View>
      <Text style={styles.tripCost}>{item.cost}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Trips</Text>
      <FlatList
        data={trips}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  listContent: {
    paddingBottom: 20,
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tripInfo: {
    flex: 1,
  },
  tripDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 5,
  },
  tripCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA500',
  },
});

export default TripsScreen;

