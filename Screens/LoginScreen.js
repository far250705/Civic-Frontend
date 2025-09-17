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
import AnimatedBackground from '../components/AnimatedBackground';
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = ({ navigation,setIsLoggedIn  }) => {
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
        { rotate: `${leafRotate.value}deg` },
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <AnimatedBackground>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Animated Header */}
          <View style={styles.header}>
            <Animated.View style={[styles.logoContainer, logoStyle]}>
              <Ionicons name="leaf" size={50} color="#4CAF50" />
            </Animated.View>
            
            <Animated.View style={titleStyle}>
              <Text style={styles.title}>Clean & Green</Text>
              <Text style={styles.subtitle}>
                🌱 Report. Act. Transform. 🌍
              </Text>
              <Text style={styles.description}>
                Welcome back, eco-warrior! Let's make our communities cleaner together.
              </Text>
            </Animated.View>
          </View>

          {/* Animated Form */}
          <Animated.View style={[styles.form, formStyle]}>
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
            <Text style={styles.footerText}>New to our green community? </Text>
            <CustomButton
              title="Join the Movement"
              onPress={() => navigation.navigate('Register')}
              variant="secondary"
              textStyle={styles.registerLinkText}
              icon="person-add"
            />
          </View>
        </ScrollView>
      </AnimatedBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#66BB6A',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 30,
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
  },
  footerText: {
    color: '#66BB6A',
    fontSize: 16,
    marginBottom: 8,
  },
  registerLinkText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;