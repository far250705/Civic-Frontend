
// components/CustomInput.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  icon,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const focusAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);
  const iconAnim = useSharedValue(0);
  const errorAnim = useSharedValue(0);

  useEffect(() => {
    if (value) {
      focusAnim.value = withTiming(1, { duration: 200 });
    }
  }, [value]);

  useEffect(() => {
    if (error) {
      errorAnim.value = withSpring(1);
    } else {
      errorAnim.value = withSpring(0);
    }
  }, [error]);

  const handleFocus = () => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    glowAnim.value = withTiming(1, { duration: 300 });
    iconAnim.value = withSpring(1, { damping: 15 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      focusAnim.value = withTiming(0, { duration: 200 });
    }
    glowAnim.value = withTiming(0, { duration: 300 });
    iconAnim.value = withSpring(0, { damping: 15 });
  };

  const labelStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 50,
      top: interpolate(
        focusAnim.value,
        [0, 1],
        [20, -8],
        Extrapolate.CLAMP
      ),
      fontSize: interpolate(
        focusAnim.value,
        [0, 1],
        [16, 12],
        Extrapolate.CLAMP
      ),
      color: interpolate(
        focusAnim.value,
        [0, 1],
        [0x3b82f6, 0x1e40af],
        Extrapolate.CLAMP
      ),
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      paddingHorizontal: 4,
      zIndex: 1,
      fontWeight: 'bold',
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      borderColor: error
        ? '#F44336'
        : interpolate(
            glowAnim.value,
            [0, 1],
            [0x60a5fa, 0x2563eb],
            Extrapolate.CLAMP
          ),
      shadowOpacity: interpolate(
        glowAnim.value,
        [0, 1],
        [0.1, 0.25],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            errorAnim.value,
            [0, 1],
            [1, 1.02],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            iconAnim.value,
            [0, 1],
            [1, 1.1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const errorStyle = useAnimatedStyle(() => {
    return {
      opacity: errorAnim.value,
      transform: [
        {
          translateX: interpolate(
            errorAnim.value,
            [0, 1],
            [0, 5],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.inputContainer, containerStyle]}>
        <Animated.View style={iconStyle}>
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? '#2563eb' : error ? '#F44336' : '#60a5fa'}
            style={styles.icon}
          />
        </Animated.View>
        
        <Animated.Text style={labelStyle}>
          {label}
        </Animated.Text>
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? '' : placeholder}
          placeholderTextColor="#93c5fd"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          underlineColorAndroid="transparent"
          selectionColor="#2563eb"
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="#60a5fa"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error && (
        <Animated.Text style={[styles.errorText, errorStyle]}>
          {error}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#60a5fa',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 15,
    height: 60,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1e40af',
    paddingTop: 10,
    fontWeight: 'bold',
    outlineStyle: 'none', // for web
    borderWidth: 0,       // for Android
    includeFontPadding: false, 
    textAlignVertical: 'center',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 20,
    fontWeight: '600',
  },
});

export default CustomInput;