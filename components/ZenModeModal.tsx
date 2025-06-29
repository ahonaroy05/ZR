import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import SoundService from '@/lib/soundService';
import ForestAnimations from '@/components/ForestAnimations';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Moon,
  Waves,
  Wind,
  TreePine
} from 'lucide-react-native';

interface ZenModeModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ZenModeModal({ visible, onClose }: ZenModeModalProps) {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(300); // 5 minutes default
  const [selectedSound, setSelectedSound] = useState('ocean');
  const [isMuted, setIsMuted] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [currentScreen, setCurrentScreen] = useState<'settings' | 'session' | 'paused'>('settings');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const breathingAnim = useRef(new Animated.Value(0.8)).current;
  const dimAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const soundService = useRef(SoundService.getInstance());

  const durations = [
    { label: '2 min', value: 120 },
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '15 min', value: 900 },
    { label: '20 min', value: 1200 },
  ];

  const sounds = [
    { id: 'ocean', name: 'Ocean Waves', icon: Waves },
    { id: 'forest', name: 'Forest', icon: TreePine },
    { id: 'wind', name: 'Wind', icon: Wind },
    { id: 'silence', name: 'Silence', icon: Moon },
  ];

  useEffect(() => {
    if (visible) {
      // Reset state when modal opens
      setIsActive(false);
      setTimer(0);
      setCurrentScreen('settings');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Gradually dim screen
      if (Platform.OS !== 'web') {
        // Note: In a real app, you'd use expo-brightness here
        // For now, we'll simulate with a visual overlay
        Animated.timing(dimAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      }
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      dimAnim.setValue(0);
      setIsActive(false);
      setTimer(0);
      setCurrentScreen('settings');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (isActive) {
      // Start ambient sound if not silence
      if (selectedSound !== 'silence' && !isMuted) {
        soundService.current.simulateSound(selectedSound);
      }

      // Start breathing animation
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(breathingAnim, {
            toValue: 1.2,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breathingAnim, {
            toValue: 0.8,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );
      breathingAnimation.start();

      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev >= selectedDuration) {
            setIsActive(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => {
        breathingAnimation.stop();
        soundService.current.simulateStop();
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isActive, selectedDuration]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentScreen('session');
    
    // Start ambient sound
    if (selectedSound !== 'silence' && !isMuted) {
      soundService.current.simulateSound(selectedSound);
    }
  };

  const handlePause = () => {
    setIsActive(false);
    setCurrentScreen('paused');
    soundService.current.simulateStop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimer(0);
    setCurrentScreen('settings');
    soundService.current.simulateStop();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleResume = () => {
    setIsActive(true);
    setCurrentScreen('session');
    
    // Resume ambient sound
    if (selectedSound !== 'silence' && !isMuted) {
      soundService.current.simulateSound(selectedSound);
    }
  };

  const handleBackToSettings = () => {
    setCurrentScreen('settings');
    setTimer(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}:00`;
  };

  const progress = timer / selectedDuration;

  const handleClose = () => {
    // Stop any active session before closing
    soundService.current.simulateStop();
    if (isActive) {
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    onClose();
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (isActive) {
      if (newMutedState || selectedSound === 'silence') {
        soundService.current.simulateStop();
      } else {
        soundService.current.simulateSound(selectedSound);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <ForestAnimations type="mist" intensity="high">
      {/* Dark overlay for screen dimming */}
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: dimAnim }
        ]}
      />
      
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {currentScreen === 'session' ? 'Zen Session Active' : 
               currentScreen === 'paused' ? 'Session Paused' : 'Zen Mode'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Duration Selection */}
          {currentScreen === 'settings' && (
            <View style={styles.durationSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Session Duration
              </Text>
              <View style={styles.durationOptions}>
                {durations.map((duration) => (
                  <TouchableOpacity
                    key={duration.value}
                    style={[
                      styles.durationButton,
                      { borderColor: theme.colors.border },
                      selectedDuration === duration.value && {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => setSelectedDuration(duration.value)}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        { color: theme.colors.text },
                        selectedDuration === duration.value && { color: '#FFFFFF' },
                      ]}
                    >
                      {duration.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Sound Selection */}
          {currentScreen === 'settings' && (
            <View style={styles.soundSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Background Sound
              </Text>
              <View style={styles.soundOptions}>
                {sounds.map((sound) => {
                  const IconComponent = sound.icon;
                  return (
                    <TouchableOpacity
                      key={sound.id}
                      style={[
                        styles.soundButton,
                        { backgroundColor: theme.colors.border },
                        selectedSound === sound.id && {
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                      onPress={() => setSelectedSound(sound.id)}
                    >
                      <IconComponent
                        size={24}
                        color={selectedSound === sound.id ? '#FFFFFF' : theme.colors.textSecondary}
                        strokeWidth={2}
                      />
                      <Text
                        style={[
                          styles.soundText,
                          { color: theme.colors.textSecondary },
                          selectedSound === sound.id && { color: '#FFFFFF' },
                        ]}
                      >
                        {sound.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Breathing Circle */}
          <View style={styles.breathingSection}>
            <Animated.View
              style={[
                styles.breathingCircle,
                { backgroundColor: 'rgba(200, 181, 232, 0.1)' },
                {
                  transform: [{ scale: breathingAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={[theme.colors.pastel.lavender, theme.colors.pastel.mint, theme.colors.pastel.cream]}
                style={styles.breathingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.breathingText}>
                  {isActive ? 'Breathe' : 'Ready'}
                </Text>
              </LinearGradient>
            </Animated.View>

            {/* Progress Ring */}
            {isActive && (
              <View style={styles.progressRing}>
                <View style={[styles.progressTrack, { borderColor: theme.colors.border }]} />
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      borderColor: theme.colors.primary,
                      transform: [
                        {
                          rotate: `${progress * 360}deg`,
                        },
                      ],
                    },
                  ]}
                />
              </View>
            )}
          </View>

          {/* Timer Display */}
          {(currentScreen === 'session' || currentScreen === 'paused') && (
            <View style={styles.timerSection}>
              <Text style={[styles.timerText, { color: theme.colors.text }]}>
                {formatTime(timer)} / {formatDuration(selectedDuration)}
              </Text>
              {currentScreen === 'session' && (
                <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
                  Focus on your breath and let go of stress
                </Text>
              )}
            </View>
          )}

          {/* Controls */}
          {currentScreen === 'settings' && (
            <View style={styles.controls}>
              <TouchableOpacity
                onPress={handleStart}
                style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
              >
                <Play size={32} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}

          {currentScreen === 'session' && (
            <View style={styles.controls}>
              <TouchableOpacity onPress={handleReset} style={styles.controlButton}>
                <RotateCcw size={20} color={theme.colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePause}
                style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
              >
                <Pause size={32} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleMuteToggle}
                style={styles.controlButton}
              >
                {isMuted ? (
                  <VolumeX size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                ) : (
                  <Volume2 size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          )}

          {currentScreen === 'paused' && (
            <View style={styles.pausedControls}>
              <TouchableOpacity
                onPress={handleBackToSettings}
                style={[styles.secondaryButton, { backgroundColor: theme.colors.border }]}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>
                  Back to Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleResume}
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.primaryButtonText}>Resume Session</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
      </ForestAnimations>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
  },
  closeButton: {
    padding: 4,
  },
  durationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 12,
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  soundSection: {
    marginBottom: 32,
  },
  soundOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  soundText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  breathingSection: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  breathingCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  breathingGradient: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  progressRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
  },
  progressTrack: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
  },
  progressFill: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  pausedControls: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
  },
});