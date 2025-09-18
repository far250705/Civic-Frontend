
// components/AnimatedBackground.js
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedBackground = ({ children }) => {
  const gradientAnim = useSharedValue(0);

  useEffect(() => {
    gradientAnim.value = withRepeat(
      withTiming(1, { duration: 8000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.8 + Math.sin(gradientAnim.value * Math.PI) * 0.2,
    };
  });

  return (
    <AnimatedLinearGradient
      colors={['#EFF6FF', '#DBEAFE', '#BFDBFE', '#EFF6FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, animatedStyle]}
    >
      {children}
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default AnimatedBackground;