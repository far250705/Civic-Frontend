// screens/ForgotPasswordScreen.js
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
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import AnimatedBackground from '../components/AnimatedBackground';

const ForgotPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const headerAnim = useSharedValue(0);
  const formAnim = useSharedValue(0);
  const backButtonAnim = useSharedValue(0);

  useEffect(() => {
    // Animations on mount
    backButtonAnim.value = withDelay(100, withSpring(1, { damping: 15 }));
    headerAnim.value = withDelay(300, withSpring(1, { damping: 15 }));
    formAnim.value = withDelay(500, withSpring(1, { damping: 15 }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = () => {
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          '✅ Password Reset',
          'Your password has been updated. Please login with your new credentials.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      }, 2000);
    }
  };

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backButtonAnim.value }],
    opacity: backButtonAnim.value,
  }));

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withTiming(headerAnim.value * 0 + (1 - headerAnim.value) * 50) },
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
              <Ionicons name="arrow-back" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </Animated.View>

          {/* Header */}
          <Animated.View style={[styles.header, headerStyle]}>
            <View style={styles.logoContainer}>
              <Ionicons name="key" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              🔒 Create a strong new password to keep your account secure
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.form, formStyle]}>
            <CustomInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
              icon="lock-closed"
              error={errors.newPassword}
            />

            <CustomInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter new password"
              secureTextEntry
              icon="lock-closed"
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Update Password"
              onPress={handleResetPassword}
              style={styles.resetButton}
              icon="refresh-circle"
              loading={loading}
            />
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <CustomButton
              title="Back to Login"
              onPress={() => navigation.navigate('Login')}
              variant="secondary"
              textStyle={styles.loginLinkText}
              icon="log-in"
            />
          </View>
        </ScrollView>

        {/* Floating Leaves */}
        <Animated.View style={styles.floatingLeaf1}>
          <Ionicons name="leaf" size={22} color="#81C784" />
        </Animated.View>
        <Animated.View style={styles.floatingLeaf2}>
          <Ionicons name="leaf" size={18} color="#C8E6C9" />
        </Animated.View>
      </AnimatedBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  backButtonContainer: { marginBottom: 20 },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { alignItems: 'center', marginBottom: 30 },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 26, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: '#66BB6A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: { marginBottom: 30 },
  resetButton: { marginTop: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: '#81C784', fontSize: 16 },
  loginLinkText: { fontWeight: 'bold', fontSize: 16 },
  floatingLeaf1: {
    position: 'absolute',
    top: 120,
    right: 30,
    transform: [{ rotate: '15deg' }],
  },
  floatingLeaf2: {
    position: 'absolute',
    bottom: 100,
    left: 40,
    transform: [{ rotate: '-20deg' }],
  },
});

export default ForgotPasswordScreen;
