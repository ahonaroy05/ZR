import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Award, Star, Trophy, Target, Crown, Zap, Shield, Flame } from 'lucide-react-native';

interface AchievementBadgeProps {
  title: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon?: 'award' | 'star' | 'trophy' | 'target' | 'crown' | 'zap' | 'shield' | 'flame' | string;
  unlocked?: boolean;
  progress?: number;
  maxProgress?: number;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
}

export default function AchievementBadge({
  title,
  description,
  type,
  icon = 'award',
  unlocked = false,
  progress,
  maxProgress,
  size = 'medium',
  onPress
}: AchievementBadgeProps) {
  const getIconComponent = () => {
    const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;
    const iconColor = unlocked ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';

    const iconProps = {
      size: iconSize,
      color: iconColor,
      strokeWidth: 2
    };

    // If icon is an emoji or other string, render it as text
    if (icon && !['award', 'star', 'trophy', 'target', 'crown', 'zap', 'shield', 'flame'].includes(icon)) {
      return (
        <Text style={{ fontSize: iconSize, color: iconColor }}>
          {icon}
        </Text>
      );
    }

    switch (icon) {
      case 'star':
        return <Star {...iconProps} fill={unlocked ? iconColor : 'transparent'} />;
      case 'trophy':
        return <Trophy {...iconProps} />;
      case 'target':
        return <Target {...iconProps} />;
      case 'crown':
        return <Crown {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} fill={unlocked ? iconColor : 'transparent'} />;
      case 'shield':
        return <Shield {...iconProps} />;
      case 'flame':
        return <Flame {...iconProps} fill={unlocked ? iconColor : 'transparent'} />;
      default:
        return <Award {...iconProps} />;
    }
  };

  const getTypeGradient = () => {
    switch (type) {
      case 'bronze':
        return unlocked ? ['#CD7F32', '#B8860B'] : ['#9CA3AF', '#6B7280'];
      case 'silver':
        return unlocked ? ['#C0C0C0', '#A8A8A8'] : ['#9CA3AF', '#6B7280'];
      case 'gold':
        return unlocked ? ['#FFD700', '#FFA500'] : ['#9CA3AF', '#6B7280'];
      case 'platinum':
        return unlocked ? ['#E5E4E2', '#B8B8B8'] : ['#9CA3AF', '#6B7280'];
      default:
        return unlocked ? ['#CD7F32', '#B8860B'] : ['#9CA3AF', '#6B7280'];
    }
  };

  const getGlowColor = () => {
    switch (type) {
      case 'bronze':
        return 'rgba(205, 127, 50, 0.3)';
      case 'silver':
        return 'rgba(192, 192, 192, 0.3)';
      case 'gold':
        return 'rgba(255, 215, 0, 0.4)';
      case 'platinum':
        return 'rgba(229, 228, 226, 0.3)';
      default:
        return 'rgba(205, 127, 50, 0.3)';
    }
  };

  const showProgress = progress !== undefined && maxProgress !== undefined;
  const progressPercentage = showProgress ? Math.min((progress! / maxProgress!) * 100, 100) : 0;

  const containerSize = size === 'small' ? 80 : size === 'large' ? 120 : 100;
  const titleSize = size === 'small' ? 9 : size === 'large' ? 12 : 10;
  const descSize = size === 'small' ? 7 : size === 'large' ? 9 : 8;

  const BadgeContent = (
    <View style={[styles.container, { width: containerSize, height: containerSize + 10 }]}>
      <LinearGradient
        colors={getTypeGradient()}
        style={[
          styles.gradient,
          { width: containerSize, height: containerSize + 10, borderRadius: (containerSize + 10) / 2 }
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Glow effect for unlocked achievements */}
        {unlocked && (
          <View 
            style={[
              styles.glowEffect,
              { 
                backgroundColor: getGlowColor(),
                width: containerSize + 18,
                height: containerSize + 18,
                borderRadius: (containerSize + 18) / 2,
                top: -4,
                left: -4
              }
            ]} 
          />
        )}

        {/* Main badge content */}
        <View style={styles.badgeContent}>
          <View style={styles.iconContainer}>
            {getIconComponent()}
          </View>
          
          <Text 
            style={[
              styles.title, 
              { 
                fontSize: titleSize,
                color: unlocked ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                textShadowColor: unlocked ? 'rgba(0, 0, 0, 0.3)' : 'transparent'
              }
            ]}
            numberOfLines={2}
          >
            {title}
          </Text>
          
          <Text 
            style={[
              styles.description, 
              { 
                fontSize: descSize,
                color: unlocked ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)'
              }
            ]}
            numberOfLines={1}
          >
            {description}
          </Text>
        </View>

        {/* Progress indicator */}
        {showProgress && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressTrack, { width: containerSize - 24 }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: unlocked ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { fontSize: Math.max(descSize - 1, 6) }]}>
              {progress}/{maxProgress}
            </Text>
          </View>
        )}

        {/* Tier indicator */}
        <View style={[styles.tierBadge, { bottom: size === 'small' ? 6 : 10 }]}>
          <Text style={[styles.tierText, { fontSize: Math.max(descSize - 1, 6) }]}>
            {type.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Sparkle effect for gold and platinum */}
        {unlocked && (type === 'gold' || type === 'platinum') && (
          <View style={styles.sparkleContainer}>
            <Star size={8} color="#FFFFFF" fill="#FFFFFF" style={styles.sparkle1} />
            <Star size={6} color="#FFFFFF" fill="#FFFFFF" style={styles.sparkle2} />
            <Star size={8} color="#FFFFFF" fill="#FFFFFF" style={styles.sparkle3} />
          </View>
        )}
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {BadgeContent}
      </TouchableOpacity>
    );
  }

  return BadgeContent;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: 4,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    position: 'relative',
    // Add subtle border for modern flat design
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glowEffect: {
    position: 'absolute',
    opacity: 0.4,
    // Add pulsing animation effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  badgeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 6,
    minHeight: '80%', // Ensure content has enough space
  },
  iconContainer: {
    marginBottom: 2,
    flexShrink: 0, // Prevent icon from shrinking
  },
  title: {
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
    marginBottom: 1,
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
    letterSpacing: 0.2,
    lineHeight: undefined, // Let the system calculate optimal line height
    flexShrink: 1, // Allow title to shrink if needed
  },
  description: {
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.1,
    lineHeight: undefined, // Let the system calculate optimal line height
    flexShrink: 1, // Allow description to shrink if needed
  },
  progressContainer: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    left: 10,
    right: 10,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 1,
    // Add subtle inner shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
    // Add gradient effect to progress fill
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  progressText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  tierBadge: {
    position: 'absolute',
    right: 6,
    bottom: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tierText: {
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: 6,
    right: 10,
  },
  sparkle2: {
    position: 'absolute',
    top: 12,
    left: 6,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 16,
    right: 6,
  },
});