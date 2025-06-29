import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

interface EnhancedStressMeterProps {
  stressLevel: number;
  size?: number;
  onStressLevelChange?: (level: number) => void;
  showControls?: boolean;
  animated?: boolean;
  previousLevel?: number;
}

export default function EnhancedStressMeter({ 
  stressLevel, 
  size = 120, 
  onStressLevelChange,
  showControls = false,
  animated = true,
  previousLevel
}: EnhancedStressMeterProps) {
  const { theme } = useTheme();
  const [displayLevel, setDisplayLevel] = useState(stressLevel);
  const animatedValue = useRef(new Animated.Value(stressLevel)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: stressLevel,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Animate the display value
      const listener = animatedValue.addListener(({ value }) => {
        setDisplayLevel(Math.round(value));
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    } else {
      setDisplayLevel(stressLevel);
    }
  }, [stressLevel, animated]);

  useEffect(() => {
    // Pulse animation for high stress levels
    if (stressLevel > 70) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    } else {
      pulseAnim.setValue(1);
    }
  }, [stressLevel]);

  const getStressColor = (level: number) => {
    if (level < 30) return theme.colors.pastel.mint; // Keep mint for low stress
    if (level < 60) return theme.colors.pastel.lavender; // Change to lavender for medium
    if (level < 80) return theme.colors.pastel.lilac; // Change to lilac for high
    return theme.colors.pastel.powder; // Change to powder for very high
  };

  const getStressLabel = (level: number) => {
    if (level < 30) return 'Low';
    if (level < 60) return 'Moderate';
    if (level < 80) return 'High';
    return 'Very High';
  };

  const getStressGradient = (level: number) => {
    if (level < 30) return [theme.colors.pastel.mint, theme.colors.pastel.blue]; // Mint to blue for low
    if (level < 60) return [theme.colors.pastel.lavender, theme.colors.pastel.lilac]; // Lavender to lilac for medium
    if (level < 80) return [theme.colors.pastel.lilac, theme.colors.pastel.powder]; // Lilac to powder for high
    return [theme.colors.pastel.powder, theme.colors.pastel.rose]; // Powder to rose for very high
  };

  const getTrendIcon = () => {
    if (previousLevel === undefined) return null;
    
    const difference = stressLevel - previousLevel;
    if (Math.abs(difference) < 2) {
      return <Minus size={16} color={theme.colors.textSecondary} strokeWidth={2} />;
    }
    
    return difference > 0 ? (
      <TrendingUp size={16} color="#FF6B6B" strokeWidth={2} />
    ) : (
      <TrendingDown size={16} color="#4ADE80" strokeWidth={2} />
    );
  };

  const handleAdjustStress = (adjustment: number) => {
    const newLevel = Math.max(0, Math.min(100, stressLevel + adjustment));
    onStressLevelChange?.(newLevel);
    
    // Quick scale animation for feedback
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
      }),
    ]).start();
  };

  // Calculate circle properties for progress ring
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayLevel / 100) * circumference;

  return (
    <View style={[styles.container, { width: size + 40, height: size + 60 }]}>
      <Animated.View
        style={[
          styles.meterContainer,
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            borderWidth: 1,
            borderColor: theme.colors.pastel.lavender,
            shadowColor: theme.colors.pastel.lavender,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            transform: [
              { scale: pulseAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={getStressGradient(displayLevel)}
          style={[styles.gradient, { width: size, height: size, borderRadius: size / 2 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Progress Ring */}
          <View style={[styles.progressRing, { width: size, height: size }]}>
            <View style={[styles.progressTrack, { borderColor: 'rgba(255,255,255,0.3)' }]} />
            <Animated.View
              style={[
                styles.progressFill,
                {
                  borderColor: '#FFFFFF',
                  transform: [
                    {
                      rotate: animatedValue.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>

          <View style={styles.content}>
            <Text style={[styles.percentage, { color: theme.colors.text }]}>
              <Text style={[
                styles.percentage, 
                { 
                  color: '#ffffff',
                  fontSize: 48,
                  textShadowColor: theme.colors.pastel.lavender,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 8,
                }
              ]}>
                {displayLevel}%
              </Text>
            </Text>
            <View style={styles.labelContainer}>
              <Text style={[styles.label, { color: theme.colors.pastel.cream }]}>
                {getStressLabel(displayLevel)}
              </Text>
              {getTrendIcon()}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Controls */}
      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleAdjustStress(-5)}
          >
            <Text style={[styles.controlText, { color: theme.colors.primary }]}>-5</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => handleAdjustStress(5)}
          >
            <Text style={[styles.controlText, { color: theme.colors.primary }]}>+5</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sync Status */}
      <View style={[styles.syncStatus, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.syncIndicator, { backgroundColor: '#4ADE80' }]} />
        <Text style={[styles.syncText, { color: theme.colors.textSecondary }]}>
          Synced
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meterContainer: {
    position: 'relative',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    position: 'relative',
    // Subtle background glow
    backgroundColor: 'rgba(200, 181, 232, 0.05)',
  },
  progressRing: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: 'rgba(200, 181, 232, 0.2)',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    borderWidth: 3,
    borderTopColor: theme.colors.pastel.lavender,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    shadowColor: theme.colors.pastel.lavender,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  percentage: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    marginRight: 4,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(200, 181, 232, 0.15)',
    borderWidth: 0.5,
    borderColor: theme.colors.pastel.lavender,
  },
  controlText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: theme.colors.pastel.cream,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 0.5,
    borderColor: theme.colors.pastel.lavender,
  },
  syncIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    backgroundColor: theme.colors.pastel.mint,
    shadowColor: theme.colors.pastel.mint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  syncText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    color: theme.colors.pastel.mint,
  },
});