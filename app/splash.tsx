import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import ForestAnimations from '@/components/ForestAnimations';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { theme } = useTheme();
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Start ripple animation
    const rippleAnimation = Animated.loop(
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 3500,
        useNativeDriver: true,
      })
    );
    rippleAnimation.start();

    // Navigate to onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => {
      clearTimeout(timer);
      rippleAnimation.stop();
    };
  }, []);

  const rippleScale = rippleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const rippleOpacity = rippleAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.8, 0.3, 0],
  });

  return (
    <ForestAnimations type="lightRays" intensity="high">
      <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.sunset}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Ripple Animation */}
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ripple,
            styles.rippleDelay,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.logo}>ZenRoute</Text>
          <Text style={styles.tagline}>Transform your commute into calm</Text>
        </Animated.View>
      </LinearGradient>
    </View>
    </ForestAnimations>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  rippleDelay: {
    animationDelay: '1.5s',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});