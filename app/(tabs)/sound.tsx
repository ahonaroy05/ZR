import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Waves, 
  Wind, 
  Zap, 
  TreePine,
  Coffee,
  Moon,
  Sun,
  CloudRain
} from 'lucide-react-native';
import ThemeToggle from '@/components/ThemeToggle';
import GuidedSessionModal, { GuidedSession } from '@/components/GuidedSessionModal';
import { GUIDED_SESSIONS } from '@/lib/guidedSessions';
import VolumeSlider from '@/components/VolumeSlider';
import { useAudioSettings } from '@/hooks/useAudioSettings';
import SleepTimerModal from '@/components/SleepTimerModal';
import SaveMixModal from '@/components/SaveMixModal';
import ForestAnimations from '@/components/ForestAnimations';

interface SoundOption {
  id: string;
  name: string;
  icon: any;
  description: string;
  isPlaying: boolean;
  volume: number;
}

export default function SoundScreen() {
  const { theme } = useTheme();
  const [soundscapes, setSoundscapes] = useState<SoundOption[]>([
    { id: 'ocean', name: 'Ocean Waves', icon: Waves, description: 'Calming sea sounds', isPlaying: false, volume: 70 },
    { id: 'forest', name: 'Forest Ambience', icon: TreePine, description: 'Birds and rustling leaves', isPlaying: false, volume: 60 },
    { id: 'rain', name: 'Gentle Rain', icon: CloudRain, description: 'Soft rainfall', isPlaying: false, volume: 80 },
    { id: 'wind', name: 'Wind Chimes', icon: Wind, description: 'Peaceful chimes', isPlaying: false, volume: 50 },
    { id: 'coffee', name: 'Coffee Shop', icon: Coffee, description: 'Ambient café sounds', isPlaying: false, volume: 40 },
    { id: 'night', name: 'Night Sounds', icon: Moon, description: 'Crickets and owls', isPlaying: false, volume: 65 },
  ]);

  const [guidedSessions] = useState<GuidedSession[]>(GUIDED_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<GuidedSession | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showSleepTimer, setShowSleepTimer] = useState(false);
  const [showSaveMix, setShowSaveMix] = useState(false);
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0);

  const {
    settings,
    updateMasterVolume,
    updateBackgroundMusicVolume,
    toggleMasterMute,
    getEffectiveVolume,
  } = useAudioSettings();

  const toggleSound = (soundId: string) => {
    setSoundscapes(prev => prev.map(sound => 
      sound.id === soundId 
        ? { ...sound, isPlaying: !sound.isPlaying }
        : sound
    ));
  };

  const adjustVolume = (soundId: string, volume: number) => {
    setSoundscapes(prev => prev.map(sound => 
      sound.id === soundId 
        ? { ...sound, volume: Math.max(0, Math.min(100, Math.round(volume))) }
        : sound
    ));
  };

  const handleSaveMix = () => {
    setShowSaveMix(true);
  };

  const handleSleepTimer = () => {
    setShowSleepTimer(true);
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'breathing': return <Wind size={20} color="#FFFFFF" />;
      case 'meditation': return <Moon size={20} color="#FFFFFF" />;
      case 'focus': return <Zap size={20} color="#FFFFFF" />;
      case 'motivation': return <Sun size={20} color="#FFFFFF" />;
      default: return <Wind size={20} color="#FFFFFF" />;
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'breathing': return ['#A8E6CF', '#DDA0DD'];
      case 'meditation': return ['#DDA0DD', '#FFB6C1'];
      case 'focus': return ['#FFB6C1', '#A8E6CF'];
      case 'motivation': return ['#FFD93D', '#A8E6CF'];
      default: return ['#A8E6CF', '#DDA0DD'];
    }
  };

  const handleSessionPress = (session: GuidedSession) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleSessionComplete = () => {
    setShowSessionModal(false);
    setSelectedSession(null);
    // Could add completion tracking here
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <ForestAnimations type="mist" intensity="low">
      <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.pastel}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Sound Therapy</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Create your perfect audio environment</Text>
              </View>
              <ThemeToggle />
            </View>

            {/* Master Controls */}
            <View style={[styles.masterControls, { backgroundColor: theme.colors.surface }]}>
              <VolumeSlider
                label="Master Volume"
                value={settings.masterVolume}
                isMuted={settings.isMasterMuted}
                onValueChange={updateMasterVolume}
                onMuteToggle={toggleMasterMute}
              />
              
              <VolumeSlider
                label="Background Music"
                value={settings.backgroundMusicVolume}
                isMuted={settings.isBackgroundMusicMuted}
                onValueChange={updateBackgroundMusicVolume}
                onMuteToggle={() => {}}
                effectiveVolume={getEffectiveVolume('background')}
                disabled={settings.isMasterMuted}
              />

              {sleepTimerActive && (
                <View style={styles.sleepTimerIndicator}>
                  <Text style={[styles.sleepTimerText, { color: theme.colors.text }]}>
                    Sleep Timer: {sleepTimerMinutes} min remaining
                  </Text>
                </View>
              )}
            </View>

            {/* Soundscape Mixer */}
            <View style={styles.soundscapesContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Soundscape Mixer</Text>
              
              <View style={styles.soundGrid}>
                {soundscapes.map((sound) => {
                  const IconComponent = sound.icon;
                  return (
                    <View key={sound.id} style={[styles.soundCard, { backgroundColor: theme.colors.surface }]}>
                      <TouchableOpacity 
                        style={[
                          styles.soundButton,
                          sound.isPlaying && styles.soundButtonActive
                        ]}
                        onPress={() => toggleSound(sound.id)}
                      >
                        <LinearGradient
                          colors={sound.isPlaying ? [theme.colors.primary, theme.colors.secondary] : [theme.colors.border, theme.colors.surface]}
                          style={styles.soundButtonGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <IconComponent 
                            size={24} 
                            color={sound.isPlaying ? '#FFFFFF' : theme.colors.textSecondary} 
                            strokeWidth={2} 
                          />
                        </LinearGradient>
                      </TouchableOpacity>
                      
                      <Text style={[styles.soundName, { color: theme.colors.text }]}>{sound.name}</Text>
                      <Text style={[styles.soundDescription, { color: theme.colors.textSecondary }]}>{sound.description}</Text>
                      
                      {sound.isPlaying && (
                        <View style={styles.individualVolumeContainer}>
                          <VolumeSlider
                            label=""
                            value={sound.volume}
                            isMuted={false}
                            onValueChange={(value) => adjustVolume(sound.id, value)}
                            onMuteToggle={() => {}}
                            disabled={settings.isMasterMuted}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Guided Sessions */}
            <View style={styles.guidedContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Guided Sessions</Text>
              
              {guidedSessions.map((session) => (
                <TouchableOpacity 
                  key={session.id} 
                  style={styles.sessionCard}
                  onPress={() => handleSessionPress(session)}
                >
                  <LinearGradient
                    colors={getSessionColor(session.type)}
                    style={styles.sessionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.sessionContent}>
                      <View style={styles.sessionInfo}>
                        <Text style={styles.sessionTitle}>{session.title}</Text>
                        <Text style={styles.sessionDescription}>{session.description}</Text>
                        <Text style={styles.sessionDuration}>{formatDuration(session.duration)}</Text>
                      </View>
                      
                      <View style={styles.sessionIconContainer}>
                        {getSessionIcon(session.type)}
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.playButton}>
                      <Play size={16} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
              
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleSaveMix}>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.actionText}>Save Current Mix</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleSleepTimer}>
                  <LinearGradient
                    colors={[theme.colors.accent, theme.colors.secondary]}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.actionText}>Sleep Timer</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Guided Session Modal */}
          <GuidedSessionModal
            visible={showSessionModal}
            session={selectedSession}
            onClose={() => setShowSessionModal(false)}
            onComplete={handleSessionComplete}
          />

          {/* Sleep Timer Modal */}
          <SleepTimerModal
            visible={showSleepTimer}
            onClose={() => setShowSleepTimer(false)}
            onTimerSet={(minutes) => {
              setSleepTimerActive(true);
              setSleepTimerMinutes(minutes);
              setShowSleepTimer(false);
            }}
          />

          {/* Save Mix Modal */}
          <SaveMixModal
            visible={showSaveMix}
            onClose={() => setShowSaveMix(false)}
            currentMix={soundscapes.filter(s => s.isPlaying)}
            onSave={(mixName) => {
              // Handle saving mix
              console.log('Saving mix:', mixName);
              setShowSaveMix(false);
            }}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
    </ForestAnimations>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  masterControls: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sleepTimerIndicator: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(168, 230, 207, 0.2)',
    borderRadius: 8,
    alignItems: 'center',
  },
  sleepTimerText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  soundscapesContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  soundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  soundCard: {
    width: '47%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  soundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  soundButtonActive: {
    elevation: 6,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  soundButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundName: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  soundDescription: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  individualVolumeContainer: {
    width: '100%',
    marginTop: 8,
  },
  guidedContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sessionCard: {
    borderRadius: 16,
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sessionGradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
    marginRight: 16,
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    marginBottom: 4,
    opacity: 0.9,
  },
  sessionDuration: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  sessionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionsContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
  },
});