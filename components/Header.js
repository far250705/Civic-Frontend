// Header.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const Header = ({ title, showBack = false, onBack }) => {
  const navigation = useNavigation();

  // Navigate to ProfileScreen when profile icon is pressed
  const handleProfilePress = () => {
    navigation.navigate('Profile'); // Make sure "Profile" is registered in your stack
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>
        <Bell size={24} color="white" />
        <TouchableOpacity style={styles.userIcon} onPress={handleProfilePress}>
          <User size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2563eb',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  backText: {
    color: 'white',
    fontSize: 18,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
