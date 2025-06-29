import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Clock, Wind, Moon, Zap, Sun } from 'lucide-react-native';

export default function SessionDurationScreen() {
  const { theme } = useTheme();
  const [defaultDurations, setDefaultDurations] = useState({
    breathing: 300, // 5 minutes
    meditation: 900, // 15 minutes
    focus: 600, // 10 minutes
    motivation: 480, // 8 minutes
  });
  const [customDurationsEnabled, setCustomDurationsEnabled] = useState(false);

  const sessionTypes = [
    {
      key: 'breathing',
      title: 'Breathing Exercises',
      icon: Wind,
      color: '#A8E6CF',
      options: [120, 300, 600, 900], // 2, 5, 10, 15 minutes
    },
    {
      key: 'meditation',
      title: 'Meditation Sessions',
      icon: Moon,
      color: '#DDA0DD',
      options: [300, 600, 900, 1200, 1800], // 5, 10, 15, 20, 30 minutes
    },
    {
      key: 'focus',
      title: 'Focus Enhancement',
      icon: Zap,
      color: '#FFB6C1',
      options: [300, 600, 900, 1200], // 5, 10, 15, 20 minutes
    },
    {
      key: 'motivation',
      title: 'Motivation Sessions',
      icon: Sun,
      color: '#FFD93D',
      options: [180, 300, 480, 600], // 3, 5, 8, 10 minutes
    },
  ];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const updateDuration = (sessionType: string, duration: number) => {
    setDefaultDurations(prev => ({
      ...prev,
      [sessionType]: duration,
    }));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradient.ocean}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={theme.colors.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text }]}>Session Duration</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            {/* Custom Durations Toggle */}
            <View style={[styles.settingCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.settingHeader}>
                <View style={styles.settingInfo}>
                  <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary }]}>
                    <Clock size={20} color="#FFFFFF" strokeWidth={2} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                      Custom Default Durations
                    </Text>
                    <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                      Set personalized default durations for each session type
                    </Text>
                  </View>
                </View>
                <Switch
                  value={customDurationsEnabled}
                  onValueChange={setCustomDurationsEnabled}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Session Type Settings */}
            {sessionTypes.map((sessionType) => {
              const IconComponent = sessionType.icon;
              const currentDuration = defaultDurations[sessionType.key as keyof typeof defaultDurations];
              
              return (
                <View key={sessionType.key} style={[styles.sessionCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.sessionHeader}>
                    <View style={[styles.sessionIcon, { backgroundColor: sessionType.color }]}>
                      <IconComponent size={20} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <Text style={[styles.sessionTitle, { color: theme.colors.text }]}>
                      {sessionType.title}
                    </Text>
                  </View>

                  <View style={styles.durationOptions}>
                    {sessionType.options.map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        style={[
                          styles.durationButton,
                          { backgroundColor: theme.colors.border },
                          currentDuration === duration && { backgroundColor: sessionType.color },
                          !customDurationsEnabled && styles.disabledButton,
                        ]}
                        onPress={() => customDurationsEnabled && updateDuration(sessionType.key, duration)}
                        disabled={!customDurationsEnabled}
                      >
                        <Text
                          style={[
                            styles.durationText,
                            { color: theme.colors.text },
                            currentDuration === duration && { color: '#FFFFFF' },
                            !customDurationsEnabled && { color: theme.colors.textSecondary },
                          ]}
                        >
                          {formatDuration(duration)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={[styles.currentSelection, { color: theme.colors.textSecondary }]}>
                    Current default: {formatDuration(currentDuration)}
                  </Text>
                </View>
              );
            })}

            {/* Info */}
            <View style={[styles.infoCard, { backgroundColor: theme.colors.border }]}>
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                💡 These settings only apply when custom durations are enabled. You can always choose different durations when starting a session.
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  settingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  sessionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sessionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  durationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  currentSelection: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
});