import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageCircle, Sparkles, X, Minimize2 } from 'lucide-react-native';
import AIWellnessAssistant from './AIWellnessAssistant';

const { width, height } = Dimensions.get('window');

interface PersistentAIFabProps {
  currentTab?: string;
  hasNewMessages?: boolean;
}

export default function PersistentAIFab({ 
  currentTab = 'home', 
  hasNewMessages = false 
}: PersistentAIFabProps) {
  const { theme } = useTheme();
  const [showAssistant, setShowAssistant] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Accessibility
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    // Check for screen reader
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Gentle pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  useEffect(() => {
    // Bounce animation for new messages
    if (hasNewMessages) {
      const bounceAnimation = Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]);

      bounceAnimation.start();

      // Glow effect for new messages
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );

      glowAnimation.start();

      return () => glowAnimation.stop();
    }
  }, [hasNewMessages]);

  useEffect(() => {
    // Slide animation for minimize/maximize
    Animated.timing(slideAnim, {
      toValue: isMinimized ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isMinimized]);

  const handlePress = () => {
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotation animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });

    setShowAssistant(true);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const getContextualMessage = () => {
    const messages = {
      index: 'How can I help with your wellness today?',
      home: 'How can I help with your wellness today?',
      journal: 'Ready to reflect on your thoughts?',
      sound: 'Let\'s find the perfect sounds for you',
      map: 'Need help with your route planning?',
      achievements: 'Celebrate your progress with me!',
      settings: 'Need help configuring your experience?',
    };
    
    return messages[currentTab as keyof typeof messages] || messages.home;
  };

  // Animation interpolations
  const bounceTransform = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const slideTransform = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const rotateTransform = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const isSettingsTab = currentTab === 'settings';
  
  // Hide FAB on settings tab to avoid interference
  if (isSettingsTab) {
    return null;
  }

  // Minimized state
  if (isMinimized) {
    return (
      <Animated.View
        style={[
          styles.minimizedContainer,
          {
            transform: [{ translateX: slideTransform }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleMinimize}
          style={styles.minimizedButton}
          accessibilityRole="button"
          accessibilityLabel="Expand AI Assistant"
          accessibilityHint="Double tap to show the AI wellness assistant"
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.minimizedGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MessageCircle size={16} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <>
      {/* Glow effect for new messages */}
      {hasNewMessages && (
        <Animated.View
          style={[
            styles.glowContainer,
            {
              opacity: glowOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.accent, 'transparent']}
            style={styles.glowGradient}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
      )}

      {/* Main FAB */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
              { translateY: bounceTransform },
              { rotate: rotateTransform },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={handlePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`AI Wellness Assistant for ${currentTab}`}
          accessibilityHint={`Double tap to open AI assistant. Current context: ${getContextualMessage()}`}
          accessibilityState={{ expanded: showAssistant }}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            style={styles.fabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Main icon */}
            <View style={styles.iconContainer}>
              <MessageCircle size={28} color="#FFFFFF" strokeWidth={2} />
              
              {/* Sparkles for AI indication */}
              <View style={styles.sparklesContainer}>
                <Sparkles size={12} color="#FFFFFF" strokeWidth={1.5} />
              </View>
            </View>

            {/* New message indicator */}
            {hasNewMessages && (
              <View style={styles.notificationBadge}>
                <View style={styles.notificationDot} />
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Minimize button */}
        <TouchableOpacity
          onPress={handleMinimize}
          style={styles.minimizeButton}
          accessibilityRole="button"
          accessibilityLabel="Minimize AI Assistant"
          accessibilityHint="Double tap to minimize the AI assistant button"
        >
          <Minimize2 size={14} color="rgba(255,255,255,0.8)" strokeWidth={2} />
        </TouchableOpacity>

        {/* Context indicator */}
        <View style={[styles.contextIndicator, { backgroundColor: theme.colors.accent }]}>
          <Text style={styles.contextText}>{currentTab}</Text>
        </View>
      </Animated.View>

      {/* Tooltip for accessibility */}
      {isScreenReaderEnabled && (
        <View style={[styles.tooltip, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.tooltipText, { color: theme.colors.text }]}>
            {getContextualMessage()}
          </Text>
        </View>
      )}

      {/* AI Assistant Modal */}
      <AIWellnessAssistant
        visible={showAssistant}
        onClose={() => setShowAssistant(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 24 : 140, // Even more space for settings tab
    right: 20, // Better positioning
    zIndex: 1000,
    elevation: 12,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Add subtle border for premium look
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    position: 'relative',
  },
  sparklesContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    // Add pulsing animation
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  notificationDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
  minimizeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextIndicator: {
    position: 'absolute',
    bottom: -6,
    left: -6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contextText: {
    fontSize: 9,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  glowContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 16 : 132, // Adjusted accordingly
    right: 12, // Adjusted to match FAB position
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 999,
  },
  glowGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  minimizedContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 24 : 140, // Adjusted accordingly
    right: -40,
    zIndex: 1000,
  },
  minimizedButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  minimizedGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 100 : 216, // Adjusted accordingly
    right: 20, // Adjusted to align with FAB
    maxWidth: width * 0.6,
    padding: 12,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 998,
  },
  tooltipText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    lineHeight: 16,
  },
});