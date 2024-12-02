import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WalletScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceTitle}>Your Balance</Text>
        <Text style={styles.balanceAmount}>$250.75</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add-circle-outline" size={24} color="#FFA500" />
          <Text style={styles.actionText}>Add Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="card-outline" size={24} color="#FFA500" />
          <Text style={styles.actionText}>Link Card</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.transactionsContainer}>
        <Text style={styles.transactionsTitle}>Recent Transactions</Text>
        <View style={styles.transaction}>
          <View style={styles.transactionInfo}>
            <Ionicons name="car-outline" size={24} color="#333" />
            <View>
              <Text style={styles.transactionTitle}>Trip to Downtown</Text>
              <Text style={styles.transactionDate}>May 15, 2023</Text>
            </View>
          </View>
          <Text style={styles.transactionAmount}>-$15.50</Text>
        </View>
        <View style={styles.transaction}>
          <View style={styles.transactionInfo}>
            <Ionicons name="add-circle-outline" size={24} color="#4CAF50" />
            <View>
              <Text style={styles.transactionTitle}>Added to Wallet</Text>
              <Text style={styles.transactionDate}>May 12, 2023</Text>
            </View>
          </View>
          <Text style={styles.transactionAmount}>+$50.00</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  balanceContainer: {
    backgroundColor: '#FFA500',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceTitle: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#333',
    marginTop: 5,
  },
  transactionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WalletScreen;

