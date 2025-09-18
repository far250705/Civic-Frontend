

// screens/RegisterScreen.js
import API from "../utils/api";
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AnimatedBackground from '../components/AnimatedBackground';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const headerAnim = useSharedValue(0);
  const formAnim = useSharedValue(0);
  const leafAnim = useSharedValue(0);
  const backButtonAnim = useSharedValue(0);

  useEffect(() => {
    backButtonAnim.value = withDelay(100, withSpring(1, { damping: 15 }));
    headerAnim.value = withDelay(300, withSpring(1, { damping: 15 }));
    formAnim.value = withDelay(500, withSpring(1, { damping: 15 }));
    leafAnim.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0.8, { duration: 1500 }),
      withTiming(1, { duration: 1000 })
    );
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleRegister = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const res = await API.post("auth/register", {
          username: name,
          email,
          password,
        });

        setLoading(false);

        Alert.alert(
          "🎉 Registration Successful!",
          "Check your email for verification before logging in.",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );

      } catch (err) {
        setLoading(false);
        Alert.alert(
          "Registration Failed",
          err.response?.data?.msg || "Something went wrong"
        );
      }
    }
  };

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backButtonAnim.value }],
    opacity: backButtonAnim.value,
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(headerAnim.value * 0 + (1 - headerAnim.value) * 50) },
      { scale: leafAnim.value },
    ],
    opacity: headerAnim.value,
  }));

  const formStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(formAnim.value * 0 + (1 - formAnim.value) * 30) },
    ],
    opacity: formAnim.value,
  }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AnimatedBackground>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Back Button */}
          <Animated.View style={[styles.backButtonContainer, backButtonStyle]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View style={[styles.header, headerStyle]}>
            <View style={styles.logoContainer}>
              <Ionicons name="person-add" size={50} color="#3b82f6" />
            </View>
            <Text style={styles.title}>Join the Movement</Text>
            <Text style={styles.subtitle}>
              🌍 Every report counts. Every action matters. 🔵
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.form, formStyle]}>
            <CustomInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              icon="person"
              error={errors.name}
              autoCapitalize="words"
            />

            <CustomInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              icon="mail"
              error={errors.email}
              autoCapitalize="none"
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
              icon="lock-closed"
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              secureTextEntry
              icon="lock-closed"
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Register & Start Reporting"
              onPress={handleRegister}
              style={styles.registerButton}
              icon="checkmark-circle"
              loading={loading}
            />
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already part of the movement? </Text>
            <CustomButton
              title="Login"
              onPress={() => navigation.navigate('Login')}
              variant="secondary"
              textStyle={styles.loginLinkText}
              icon="log-in"
            />
          </View>
        </ScrollView>
      </AnimatedBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  backButtonContainer: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1e40af', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#60a5fa', textAlign: 'center', lineHeight: 22 },
  form: { marginBottom: 30 },
  registerButton: { marginTop: 24 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#60a5fa', fontSize: 16 },
  loginLinkText: { fontWeight: 'bold', fontSize: 16 },
});

export default RegisterScreen;