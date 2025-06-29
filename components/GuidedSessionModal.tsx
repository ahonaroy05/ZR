import React, { useState, useEffect, useRef } from 'react';
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
import SoundService from '@/lib/soundService';
import MotivationalQuotesModal from './MotivationalQuotesModal';
import ForestAnimations from '@/components/ForestAnimations';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Wind,
  Moon,
  Zap,
  Sun
} from 'lucide-react-native';

export interface GuidedSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  type: 'breathing' | 'meditation' | 'focus' | 'motivation';
  instructions: SessionInstruction[];
  backgroundSound?: string;
  gradientColors: string[];
}

interface SessionInstruction {
  time: number; // seconds from start
  text: string;
  duration?: number; // how long to show this instruction
}

interface GuidedSessionModalProps {
  visible: boolean;
  session: GuidedSession | null;
  onClose: () => void;
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function GuidedSessionModal({
  visible,
  session,
  onClose,
  onComplete,
}: GuidedSessionModalProps) {
  const { theme } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const breathingAnim = useRef(new Animated.Value(0.8)).current;
  const instructionFadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const soundService = useRef(SoundService.getInstance());

  useEffect(() => {
    if (visible && session) {
      // Reset state when modal opens
      setIsActive(false);
      setTimer(0);
      setIsPaused(false);
      setCurrentInstruction(session.instructions[0]?.text || 'Get ready to begin...');
      
      // Show quotes modal for motivation sessions
      if (session.type === 'motivation') {
        setShowQuotes(true);
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
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      setIsActive(false);
      setTimer(0);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [visible, session]);

  useEffect(() => {
    if (isActive && !isPaused && session) {
      // Start background sound if available
      if (session.backgroundSound && !isMuted) {
        soundService.current.simulateSound(session.backgroundSound);
      }

      // Start breathing animation for breathing sessions
      if (session.type === 'breathing') {
        const breathingAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(breathingAnim, {
              toValue: 1.3,
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

        return () => {
          breathingAnimation.stop();
        };
      }
    } else {
      soundService.current.simulateStop();
    }
  }, [isActive, isPaused, session, isMuted]);

  useEffect(() => {
    if (isActive && !isPaused) {
      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          
          // Check for instruction updates
          if (session) {
            const instruction = session.instructions.find(
              inst => inst.time <= newTime && 
              (!inst.duration || newTime < inst.time + inst.duration)
            );
            
            if (instruction && instruction.text !== currentInstruction) {
              setCurrentInstruction(instruction.text);
              // Animate instruction change
              Animated.sequence([
                Animated.timing(instructionFadeAnim, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(instructionFadeAnim, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            }
          }
          
          // Check if session is complete
          if (session && newTime >= session.duration) {
            setIsActive(false);
            onComplete();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [isActive, isPaused, session, currentInstruction]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
    soundService.current.simulateStop();
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
    if (session) {
      setCurrentInstruction(session.instructions[0]?.text || 'Get ready to begin...');
    }
    soundService.current.simulateStop();
  };

  const handleClose = () => {
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
    
    if (isActive && !isPaused) {
      if (newMutedState || !session?.backgroundSound) {
        soundService.current.simulateStop();
      } else {
        soundService.current.simulateSound(session.backgroundSound);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionIcon = () => {
    if (!session) return <Wind size={32} color="#FFFFFF" strokeWidth={2} />;
    
    switch (session.type) {
      case 'breathing':
        return <Wind size={32} color="#FFFFFF" strokeWidth={2} />;
      case 'meditation':
        return <Moon size={32} color="#FFFFFF" strokeWidth={2} />;
      case 'focus':
        return <Zap size={32} color="#FFFFFF" strokeWidth={2} />;
      case 'motivation':
        return <Sun size={32} color="#FFFFFF" strokeWidth={2} />;
      default:
        return <Wind size={32} color="#FFFFFF" strokeWidth={2} />;
    }
  };

  const progress = session ? timer / session.duration : 0;

  if (!session) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <ForestAnimations type="lightRays" intensity="medium">
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={session.gradientColors}
            style={styles.backgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.sessionTitle}>{session.title}</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Session Icon/Animation */}
            <View style={styles.iconSection}>
              <Animated.View
                style={[
                  styles.sessionIcon,
                  session.type === 'breathing' && {
                    transform: [{ scale: breathingAnim }],
                  },
                ]}
              >
                {getSessionIcon()}
              </Animated.View>
            </View>

            {/* Progress Ring */}
            <View style={styles.progressSection}>
              <View style={styles.progressRing}>
                <View style={styles.progressTrack} />
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      transform: [
                        {
                          rotate: `${progress * 360}deg`,
                        },
                      ],
                    },
                  ]}
                />
                <View style={styles.progressCenter}>
                  <Text style={styles.timerText}>
                    {formatTime(timer)}
                  </Text>
                  <Text style={styles.durationText}>
                    / {formatTime(session.duration)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Current Instruction */}
            <Animated.View 
              style={[
                styles.instructionSection,
                { opacity: instructionFadeAnim }
              ]}
            >
              <Text style={styles.instructionText}>
                {currentInstruction}
              </Text>
            </Animated.View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={handleReset} style={styles.controlButton}>
                <RotateCcw size={20} color="rgba(255,255,255,0.8)" strokeWidth={2} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={isActive ? (isPaused ? handleResume : handlePause) : handleStart}
                style={styles.playButton}
              >
                <View style={styles.playButtonInner}>
                  {!isActive ? (
                    <Play size={32} color="#FFFFFF" strokeWidth={2} />
                  ) : isPaused ? (
                    <Play size={32} color="#FFFFFF" strokeWidth={2} />
                  ) : (
                    <Pause size={32} color="#FFFFFF" strokeWidth={2} />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleMuteToggle}
                style={styles.controlButton}
              >
                {isMuted ? (
                  <VolumeX size={20} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                ) : (
                  <Volume2 size={20} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>

            {/* Session Info */}
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionDescription}>
                {session.description}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Motivational Quotes Modal */}
        {session?.type === 'motivation' && (
          <MotivationalQuotesModal
            visible={showQuotes}
            onClose={() => setShowQuotes(false)}
          />
        )}
      </View>
      </ForestAnimations>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: height * 0.8,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  backgroundGradient: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  sessionTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sessionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  progressRing: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  durationText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  instructionSection: {
    alignItems: 'center',
    marginBottom: 32,
    minHeight: 60,
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  playButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionInfo: {
    alignItems: 'center',
  },
  sessionDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
});