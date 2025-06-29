import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { Achievement } from '@/types/achievements';
import { Trophy, X, Star } from 'lucide-react-native';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  visible: boolean;
  onClose: () => void;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export default function AchievementNotification({
  achievement,
  visible,
  onClose,
  onPress,
}: AchievementNotificationProps) {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && achievement) {
      // Slide in animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
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

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => {
        clearTimeout(timer);
        sparkleAnimation.stop();
      };
    } else {
      slideAnim.setValue(-100);
      scaleAnim.setValue(0.8);
      sparkleAnim.setValue(0);
    }
  }, [visible, achievement]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const getTierColor = () => {
    if (!achievement) return [theme.colors.primary, theme.colors.secondary];
    
    switch (achievement.tier) {
      case 'bronze': return ['#CD7F32', '#B8860B'];
      case 'silver': return ['#C0C0C0', '#A8A8A8'];
      case 'gold': return ['#FFD700', '#FFA500'];
      default: return [theme.colors.primary, theme.colors.secondary];
    }
  };

  const getTierStars = () => {
    if (!achievement) return 1;
    
    switch (achievement.tier) {
      case 'bronze': return 1;
      case 'silver': return 2;
      case 'gold': return 3;
      default: return 1;
    }
  };

  const sparkleRotate = sparkleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible || !achievement) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.notification}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={getTierColor()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Sparkle Animation */}
          <Animated.View
            style={[
              styles.sparkle,
              {
                transform: [{ rotate: sparkleRotate }],
              },
            ]}
          >
            <Star size={16} color="#FFFFFF" fill="#FFFFFF" strokeWidth={1} />
          </Animated.View>

          {/* Content */}
          <View style={styles.content}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.achievementIcon}>{achievement.icon}</Text>
              
              {/* Tier Stars */}
              <View style={styles.tierStars}>
                {Array.from({ length: getTierStars() }, (_, i) => (
                  <Star 
                    key={i} 
                    size={8} 
                    color="#FFFFFF" 
                    fill="#FFFFFF"
                    strokeWidth={1}
                  />
                ))}
              </View>
            </View>

            {/* Text */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Achievement Unlocked!</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.description}>{achievement.description}</Text>
            </View>

            {/* Trophy Icon */}
            <View style={styles.trophyContainer}>
              <Trophy size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={16} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  notification: {
    borderRadius: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    top: 12,
    right: 40,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  tierStars: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 3,
    paddingVertical: 1,
    gap: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 2,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  trophyContainer: {
    marginLeft: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});