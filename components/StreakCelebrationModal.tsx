import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { Flame, Trophy, Sparkles, X } from 'lucide-react-native';

interface StreakCelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  streakCount: number;
  isNewRecord?: boolean;
}

const { width, height } = Dimensions.get('window');

export default function StreakCelebrationModal({
  visible,
  onClose,
  streakCount,
  isNewRecord = false,
}: StreakCelebrationModalProps) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Start animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Sparkle animation
      const sparkleAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      sparkleAnimation.start();

      return () => {
        sparkleAnimation.stop();
      };
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      sparkleAnim.setValue(0);
    }
  }, [visible]);

  const getMilestoneMessage = (streak: number) => {
    if (streak >= 365) return "🎉 Amazing! A full year of mindful journaling!";
    if (streak >= 100) return "🌟 Incredible! 100 days of consistency!";
    if (streak >= 60) return "💪 Outstanding! Two months strong!";
    if (streak >= 30) return "🔥 Fantastic! A full month of journaling!";
    if (streak >= 14) return "✨ Great job! Two weeks of mindfulness!";
    if (streak >= 7) return "🎯 Awesome! A full week streak!";
    if (streak >= 3) return "🌱 Nice! Building a healthy habit!";
    return "🎊 Great start! Keep it going!";
  };

  const sparkleRotate = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[styles.overlay, { opacity: fadeAnim }]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={isNewRecord ? ['#FF6B6B', '#FFD93D', '#A8E6CF'] : [theme.colors.primary, theme.colors.secondary]}
            style={styles.modalContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Close Button */}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>

            {/* Animated Sparkles */}
            <Animated.View
              style={[
                styles.sparkleContainer,
                {
                  transform: [
                    { rotate: sparkleRotate },
                    { scale: sparkleScale },
                  ],
                },
              ]}
            >
              <Sparkles size={40} color="#FFFFFF" strokeWidth={2} />
            </Animated.View>

            {/* Main Icon */}
            <View style={styles.iconContainer}>
              {isNewRecord ? (
                <Trophy size={60} color="#FFFFFF" strokeWidth={2} />
              ) : (
                <Flame size={60} color="#FFFFFF" strokeWidth={2} />
              )}
            </View>

            {/* Streak Count */}
            <Text style={styles.streakNumber}>{streakCount}</Text>
            <Text style={styles.streakLabel}>
              {streakCount === 1 ? 'Day Streak!' : 'Days Streak!'}
            </Text>

            {/* Record Badge */}
            {isNewRecord && (
              <View style={styles.recordBadge}>
                <Text style={styles.recordText}>NEW RECORD!</Text>
              </View>
            )}

            {/* Message */}
            <Text style={styles.message}>
              {getMilestoneMessage(streakCount)}
            </Text>

            {/* Motivational Text */}
            <Text style={styles.motivationText}>
              {isNewRecord 
                ? "You've set a new personal best! Your dedication to mindfulness is truly inspiring."
                : "Consistency is the key to mindfulness. Every entry brings you closer to inner peace."
              }
            </Text>

            {/* Continue Button */}
            <TouchableOpacity style={styles.continueButton} onPress={onClose}>
              <View style={styles.continueButtonContent}>
                <Text style={styles.continueButtonText}>Continue Journey</Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    fontSize: 48,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  streakLabel: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  recordBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  recordText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  message: {
    fontSize: 20,
    fontFamily: 'Nunito-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  motivationText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueButtonContent: {
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
});