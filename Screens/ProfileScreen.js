import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Platform,
  Animated,
  Easing,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// API Configuration - use your actual API base URL
const API_BASE_URL = 'https://8db3da1993c6.ngrok-free.app/api';

// Move InputField outside the main component
const InputField = React.memo(({ icon, iconFamily = 'Ionicons', placeholder, value, onChangeText, multiline = false, keyboardType = 'default', error, fieldName, inputRef, fadeAnim, slideAnim, isEditing }) => {
  return (
    <Animated.View 
      style={[
        styles.inputContainer,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={styles.inputWrapper}>
        <View style={styles.iconContainer}>
          {iconFamily === 'MaterialCommunityIcons' ? (
            <MaterialCommunityIcons name={icon} size={24} color="#2563eb" />
          ) : (
            <Ionicons name={icon} size={24} color="#2563eb" />
          )}
        </View>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.inputError
          ]}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={value}
          onChangeText={onChangeText}
          editable={isEditing}
          multiline={multiline}
          keyboardType={keyboardType}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </Animated.View>
  );
});

const ProfileScreen = ({ setIsLoggedIn, setActiveScreen }) => {
  const navigation = useNavigation();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const logoutScaleAnim = useRef(new Animated.Value(1)).current;

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    age: '',
    dob: '',
    phone: '',
    bio: '',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  // Refs for inputs to prevent re-renders
  const usernameRef = useRef();
  const ageRef = useRef();
  const dobRef = useRef();
  const phoneRef = useRef();
  const bioRef = useRef();

  // Create stable callback functions
  const updateUsername = useCallback((text) => {
    setTempProfile(prev => ({ ...prev, username: text }));
  }, []);

  const updateAge = useCallback((text) => {
    setTempProfile(prev => ({ ...prev, age: text }));
  }, []);

  const updateDob = useCallback((text) => {
    setTempProfile(prev => ({ ...prev, dob: text }));
  }, []);

  const updatePhone = useCallback((text) => {
    setTempProfile(prev => ({ ...prev, phone: text }));
  }, []);

  const updateBio = useCallback((text) => {
    setTempProfile(prev => ({ ...prev, bio: text }));
  }, []);

  // API Functions
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        if (setIsLoggedIn) setIsLoggedIn(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/profile/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const profileData = {
          username: data.username || '',
          age: data.age ? data.age.toString() : '',
          dob: data.dob || '',
          phone: data.phone || '',
          bio: data.bio || '',
          profilePic: data.profilePic || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        };
        setProfile(profileData);
        setTempProfile(profileData);
      } else {
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please login again');
          if (setIsLoggedIn) setIsLoggedIn(false);
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch profile');
        }
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      Alert.alert('Network Error', 'Please check your internet connection');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const token = await getAuthToken();
      
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return false;
      }

      const updateData = {
        username: tempProfile.username,
        age: parseInt(tempProfile.age) || 0,
        dob: tempProfile.dob,
        phone: tempProfile.phone,
        bio: tempProfile.bio,
        profilePic: tempProfile.profilePic
      };

      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        return true;
      } else {
        if (response.status === 401) {
          Alert.alert('Session Expired', 'Please login again');
          if (setIsLoggedIn) setIsLoggedIn(false);
        } else {
          Alert.alert('Error', data.error || 'Failed to update profile');
        }
        return false;
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Network Error', 'Please check your internet connection');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Start animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!tempProfile.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!tempProfile.age || parseInt(tempProfile.age) <= 0) {
      newErrors.age = 'Age must be greater than 0';
    }
    
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (tempProfile.phone && !phoneRegex.test(tempProfile.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start();

      const success = await updateProfile();
      if (success) {
        setProfile({ ...tempProfile });
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    }
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("token");
              if (setIsLoggedIn) {
                setIsLoggedIn(false);
              }
              Alert.alert('Success', 'You have been logged out successfully.');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        { 
          text: 'Camera', 
          onPress: () => takePhoto() 
        },
        { 
          text: 'Gallery', 
          onPress: () => selectFromGallery() 
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setTempProfile({...tempProfile, profilePic: result.assets[0].uri});
    }
  };

  const selectFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setTempProfile({...tempProfile, profilePic: result.assets[0].uri});
    }
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Animated.View 
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            onPress={() => setIsEditing(!isEditing)}
            disabled={saving}
          >
            <Ionicons 
              name={isEditing ? "close" : "create-outline"} 
              size={28} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.profilePictureContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <TouchableOpacity 
            onPress={isEditing ? pickImage : null}
            style={styles.profilePictureWrapper}
          >
            <View style={styles.profilePictureBorder}>
              <Image 
                source={{ uri: tempProfile.profilePic }}
                style={styles.profilePicture}
              />
              {isEditing && (
                <View style={styles.editOverlay}>
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.formContainer}>
          <InputField
            icon="person-outline"
            placeholder="Username"
            value={tempProfile.username}
            onChangeText={updateUsername}
            error={errors.username}
            fieldName="username"
            inputRef={usernameRef}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            isEditing={isEditing}
          />

          <InputField
            icon="calendar-outline"
            placeholder="Age"
            value={tempProfile.age}
            onChangeText={updateAge}
            keyboardType="numeric"
            error={errors.age}
            fieldName="age"
            inputRef={ageRef}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            isEditing={isEditing}
          />

          <InputField
            icon="gift-outline"
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={tempProfile.dob}
            onChangeText={updateDob}
            fieldName="dob"
            inputRef={dobRef}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            isEditing={isEditing}
          />

          <InputField
            icon="call-outline"
            placeholder="Phone Number"
            value={tempProfile.phone}
            onChangeText={updatePhone}
            keyboardType="phone-pad"
            error={errors.phone}
            fieldName="phone"
            inputRef={phoneRef}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            isEditing={isEditing}
          />

          <InputField
            icon="information-circle-outline"
            placeholder="Bio"
            value={tempProfile.bio}
            onChangeText={updateBio}
            multiline={true}
            fieldName="bio"
            inputRef={bioRef}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            isEditing={isEditing}
          />
        </View>

        {isEditing && (
          <Animated.View 
            style={[
              styles.buttonContainer,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
            ]}
          >
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="checkmark-circle" size={24} color="white" />
              )}
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View 
          style={[
            styles.logoutContainer,
            { opacity: fadeAnim, transform: [{ scale: logoutScaleAnim }] }
          ]}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  profilePictureWrapper: {
    borderRadius: 80,
    elevation: 5,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  profilePictureBorder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2563eb',
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 152,
    height: 152,
    borderRadius: 76,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563eb',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  iconContainer: {
    marginRight: 15,
    padding: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  cancelButton: {
    flex: 0.45,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  saveButton: {
    flex: 0.5,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
};

export default ProfileScreen;