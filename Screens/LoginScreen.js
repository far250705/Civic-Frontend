
// screens/LoginScreen.js
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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AnimatedBackground from '../components/AnimatedBackground';

const LoginScreen = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const logoAnim = useSharedValue(0);
  const titleAnim = useSharedValue(0);
  const formAnim = useSharedValue(0);
  const leafRotate = useSharedValue(0);

  useEffect(() => {
    // Screen enter animations
    logoAnim.value = withDelay(200, withSpring(1, { damping: 15 }));
    titleAnim.value = withDelay(400, withSpring(1, { damping: 15 }));
    formAnim.value = withDelay(600, withSpring(1, { damping: 15 }));
    
    // Leaf rotation animation
    leafRotate.value = withSequence(
      withTiming(10, { duration: 2000 }),
      withTiming(-10, { duration: 2000 }),
      withTiming(0, { duration: 1000 })
    );
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const res = await API.post("auth/login", {
          email,
          password,
        });

        setLoading(false);

        const { token, user } = res.data;

        // ✅ Store JWT token in AsyncStorage
        await AsyncStorage.setItem("token", token);

        // ✅ Update state to switch screen
        setIsLoggedIn(true);

Alert.alert("Success", `Welcome back, ${user.username}!`);


      } catch (err) {
        setLoading(false);
        Alert.alert(
          "Login Failed",
          err.response?.data?.msg || "Something went wrong"
        );
      }
    }
  };

const logoStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: logoAnim.value },
      { rotate: `${leafRotate.value}deg` }, // ✅ wrap in backticks
    ],
    opacity: logoAnim.value,
  };
});

  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: withTiming(titleAnim.value * 0 + (1 - titleAnim.value) * 50) 
        },
      ],
      opacity: titleAnim.value,
    };
  });

  const formStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: withTiming(formAnim.value * 0 + (1 - formAnim.value) * 30) 
        },
      ],
      opacity: formAnim.value,
    };
  });

  return (
    <AnimatedBackground>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clean & Green</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
          {/* Logo Card */}
          <Animated.View style={[styles.logoCard, logoStyle]}>
            <Ionicons name="leaf" size={50} color="#2563eb" />
          </Animated.View>
          
          {/* Welcome Text */}
          <Animated.View style={[styles.welcomeContainer, titleStyle]}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue reporting issues</Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View style={[styles.formCard, formStyle]}>
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
              placeholder="Enter your secure password"
              secureTextEntry
              icon="lock-closed"
              error={errors.password}
            />

            <CustomButton
              title="Sign In & Start Reporting"
              onPress={handleLogin}
              style={styles.loginButton}
              icon="log-in"
              loading={loading}
            />

            <View style={styles.linkContainer}>
              <CustomButton
                title="Forgot Password?"
                onPress={() => navigation.navigate('ForgotPassword')}
                variant="secondary"
                icon="help-circle"
                style={styles.forgotButton}
              />
            </View>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to our community? </Text>
            <CustomButton
              title="Join the Movement"
              onPress={() => navigation.navigate('Register')}
              variant="secondary"
              textStyle={styles.registerLinkText}
              icon="person-add"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 40,
  },
  logoCard: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loginButton: {
    marginTop: 24,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  footerText: {
    color: '#4b5563',
    fontSize: 16,
    marginBottom: 8,
  },
  registerLinkText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;