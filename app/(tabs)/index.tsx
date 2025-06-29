import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Clock, TrendingUp, User, LogOut } from 'lucide-react-native';
import EnhancedStressMeter from '@/components/EnhancedStressMeter';
import BreathingBubble from '@/components/BreathingBubble';
import EmergencyCalmButton from '@/components/EmergencyCalmButton';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import ZenModeModal from '@/components/ZenModeModal';
import AIWellnessAssistant from '@/components/AIWellnessAssistant';
import GuidedSessionModal, { GuidedSession } from '@/components/GuidedSessionModal';
import { getSessionById } from '@/lib/guidedSessions';
import { useJournalStreak } from '@/hooks/useJournalStreak';
import { useAchievements } from '@/hooks/useAchievements';
import AchievementNotification from '@/components/AchievementNotification';
import ForestAnimations from '@/components/ForestAnimations';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [stressLevel, setStressLevel] = useState(42);
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showZenMode, setShowZenMode] = useState(false);
  const [showGuidedSession, setShowGuidedSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState<GuidedSession | null>(null);
  const [previousStressLevel, setPreviousStressLevel] = useState(42);
  const { streakData } = useJournalStreak();
  const { getRecentAchievements } = useAchievements();
  const [showAchievementNotification, setShowAchievementNotification] = useState(false);
  const [notificationAchievement, setNotificationAchievement] = useState(null);

  const recentAchievements = getRecentAchievements(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Show achievement notification for recent achievements
  useEffect(() => {
    if (recentAchievements.length > 0) {
      const latestAchievement = recentAchievements[0];
      const achievementDate = new Date(latestAchievement.unlockedAt);
      const now = new Date();
      const timeDiff = now.getTime() - achievementDate.getTime();
      
      // Show notification if achievement was unlocked in the last 10 minutes
      if (timeDiff < 10 * 60 * 1000) {
        setNotificationAchievement(latestAchievement);
        setShowAchievementNotification(true);
      }
    }
  }, [recentAchievements]);

  const handleBreathingToggle = () => {
    setIsBreathing(!isBreathing);
  };

  const handleZenModeActivate = () => {
    setShowZenMode(true);
  };


  const handleGuidedAudioPress = () => {
    // Start with the 5-minute breathing session
    const session = getSessionById('breathing-5min');
    if (session) {
      setSelectedSession(session);
      setShowGuidedSession(true);
    }
  };

  const handleSessionComplete = () => {
    setShowGuidedSession(false);
    setSelectedSession(null);
  };

  const handleEmergencyCalm = () => {
    // This would trigger emergency calm protocols
    console.log('Emergency calm activated');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };
  
  const handleStressLevelChange = (newLevel: number) => {
    setPreviousStressLevel(stressLevel);
    setStressLevel(newLevel);
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <ForestAnimations type="leaves" intensity="low">
      <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.dreamy}
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
              <View>
                <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                  {getGreeting()}
                </Text>
                <Text style={[styles.userName, { color: theme.colors.text }]}>
                  {getUserName()}
                </Text>
                <Text style={[styles.currentTime, { color: theme.colors.textSecondary }]}>
                  {formatTime(currentTime)}
                </Text>
              </View>
              
              <View style={styles.headerActions}>
                <ThemeToggle />
                
                {/* Bolt.new Logo */}
                <View style={styles.logoContainer}>
                  <Image
                    source={
                      theme.isDark
                        ? require('@/assets/images/white_circle_360x360.png')
                        : require('@/assets/images/black_circle_360x360.png')
                    }
                    style={styles.boltLogo}
                    resizeMode="contain"
                  />
                </View>
                
                <TouchableOpacity 
                  style={[styles.profileButton, { marginLeft: 12 }]}
                  onPress={handleSignOut}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E8E']}
                    style={styles.profileGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <LogOut size={20} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Current Status */}
            <View style={[styles.statusCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Current Stress Level
              </Text>
              <View style={styles.meterContainer}>
                <EnhancedStressMeter 
                  stressLevel={stressLevel} 
                  size={180}
                  onStressLevelChange={handleStressLevelChange}
                  showControls={true}
                  animated={true}
                  previousLevel={previousStressLevel}
                />
              </View>
              
              <View style={styles.statusInfo}>
                <View style={styles.infoItem}>
                  <MapPin size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                    Downtown Commute
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Clock size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                    25 min remaining
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <TrendingUp size={16} color="#6B7280" strokeWidth={2} />
                  <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                    -12% from yesterday
                  </Text>
                </View>
              </View>
            </View>

            {/* Breathing Exercise */}
            <View style={[styles.breathingCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Breathing Exercise
              </Text>
              <Text style={[styles.breathingSubtitle, { color: theme.colors.textSecondary }]}>
                {isBreathing ? 'Follow the breathing pattern' : 'Tap to start a calming session'}
              </Text>
              
              <TouchableOpacity onPress={handleBreathingToggle} style={styles.breathingContainer}>
                <BreathingBubble isActive={isBreathing} size={140} />
              </TouchableOpacity>

              {isBreathing && (
                <View style={styles.breathingInstructions}>
                  <Text style={[styles.instructionText, { color: theme.colors.text }]}>
                    Inhale • Hold • Exhale
                  </Text>
                  <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>
                    4 second cycles
                  </Text>
                </View>
              )}
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Quick Actions
              </Text>
              
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleZenModeActivate}>
                  <LinearGradient
                    colors={theme.colors.gradient.sunset}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.actionText}>Start Zen Mode</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleGuidedAudioPress}>
                  <LinearGradient
                    colors={theme.colors.gradient.ocean}
                    style={styles.actionGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.actionText}>Guided Audio</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <EmergencyCalmButton onPress={handleEmergencyCalm} />
            </View>

            {/* Today's Insights */}
            <View style={[styles.insightsCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Today's Insights
              </Text>
              
              <View style={styles.insightItem}>
                <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
                  Morning Peak
                </Text>
                <Text style={[styles.insightDescription, { color: theme.colors.textSecondary }]}>
                  Your stress peaked at 8:30 AM during your commute. Consider leaving 10 minutes earlier tomorrow.
                </Text>
              </View>

              <View style={styles.insightItem}>
                <Text style={[styles.insightTitle, { color: theme.colors.text }]}>
                  Journal Streak
                </Text>
                <Text style={[styles.insightDescription, { color: theme.colors.textSecondary }]}>
                  {streakData.currentStreak > 0 
                    ? `You're on a ${streakData.currentStreak}-day journaling streak! Keep it up.`
                    : 'Start a journaling streak today to track your mindfulness journey.'
                  }
                </Text>
              </View>
            </View>
          </ScrollView>


          {/* Zen Mode Modal */}
          <ZenModeModal
            visible={showZenMode}
            onClose={() => setShowZenMode(false)}
          />


          {/* Guided Session Modal */}
          <GuidedSessionModal
            visible={showGuidedSession}
            session={selectedSession}
            onClose={() => setShowGuidedSession(false)}
            onComplete={handleSessionComplete}
          />
        </SafeAreaView>

        {/* Achievement Notification */}
        <AchievementNotification
          achievement={notificationAchievement}
          visible={showAchievementNotification}
          onClose={() => setShowAchievementNotification(false)}
          onPress={() => {
            setShowAchievementNotification(false);
            // Could navigate to achievements tab
          }}
        />
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
  greeting: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    marginTop: 4,
  },
  currentTime: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    marginLeft: 8,
  },
  boltLogo: {
    width: 32,
    height: 32,
    opacity: 0.8,
  },
  profileButton: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#DDA0DD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  profileGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  meterContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusInfo: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  breathingCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    alignItems: 'center',
  },
  breathingSubtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  breathingContainer: {
    marginBottom: 16,
  },
  breathingInstructions: {
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    marginTop: 4,
  },
  quickActions: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
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
  insightsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  insightItem: {
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
});