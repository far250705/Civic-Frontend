
// components/CustomButton.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary',
  icon,
  loading = false,
}) => {
  const scaleAnim = useSharedValue(1);
  const rotateAnim = useSharedValue(0);

  const handlePressIn = () => {
    scaleAnim.value = withSpring(0.95, {
      damping: 15,
      stiffness: 200,
    });
    rotateAnim.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    scaleAnim.value = withSpring(1, {
      damping: 15,
      stiffness: 200,
    });
    rotateAnim.value = withTiming(0, { duration: 200 });
    
    if (onPress) {
      runOnJS(onPress)();
    }
  };

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { scale: scaleAnim.value },
      { rotate: `${rotateAnim.value}deg` }, // ✅ correct
    ],
  };
});

  if (variant === 'primary') {
    return (
      <Animated.View style={[animatedStyle, style]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.85}
          disabled={loading}
        >
          <LinearGradient
            colors={['#1e40af', '#2563eb', '#3b82f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            {icon && (
              <Ionicons 
                name={icon} 
                size={22} 
                color="white" 
                style={styles.buttonIcon} 
              />
            )}
            <Text style={[styles.primaryButtonText, textStyle]}>
              {loading ? 'Loading...' : title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.secondaryButton}
        activeOpacity={0.7}
      >
        {icon && (
          <Ionicons 
            name={icon} 
            size={18} 
            color="#2563eb" 
            style={styles.buttonIcon} 
          />
        )}
        <Text style={[styles.secondaryButtonText, textStyle]}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 12,
    minHeight: 56,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  secondaryButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default CustomButton;