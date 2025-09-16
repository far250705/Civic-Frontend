// Dashboard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const Dashboard = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Users</Text>
          <Text style={styles.cardValue}>120</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Posts</Text>
          <Text style={styles.cardValue}>45</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Comments</Text>
          <Text style={styles.cardValue}>300</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#4caf50',
    borderRadius: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dashboard;
