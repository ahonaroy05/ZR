import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface BreathingBubbleProps {
  isActive?: boolean;
  size?: number;
}

export default function BreathingBubble({ isActive = false, size = 120 }: BreathingBubbleProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;
  const { theme } = useTheme();

  useEffect(() => {
    if (isActive) {
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          // Inhale (2 seconds)
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          // Hold (1 second)
          Animated.delay(1000),
          // Exhale (2 seconds)
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.7,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );

      breathingAnimation.start();

      return () => {
        breathingAnimation.stop();
      };
    } else {
      // Reset to initial state
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View 
        style={[
          styles.bubble,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            shadowColor: theme.colors.pastel.lavender,
          }
        ]}
      >
        <LinearGradient
          colors={[theme.colors.pastel.lavender, theme.colors.pastel.pink, theme.colors.pastel.mint]}
          style={[styles.gradient, { 
            width: size, 
            height: size, 
            borderRadius: size / 2 
          }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.centerContent}>
            <Text style={styles.breathText}>
              {isActive ? 'Breathe' : 'Tap to Start'}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});