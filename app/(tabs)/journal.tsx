import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { PenTool, Mic, Calendar, TrendingUp, Heart, Brain, Smile, Frown, Meh, Plus, CreditCard as Edit3 } from 'lucide-react-native';
import ThemeToggle from '@/components/ThemeToggle';
import StreakDisplay from '@/components/StreakDisplay';
import StreakCelebrationModal from '@/components/StreakCelebrationModal';
import { useJournalEntries } from '@/hooks/useJournalEntries';
import { useJournalStreak } from '@/hooks/useJournalStreak';
import ForestAnimations from '@/components/ForestAnimations';

interface MoodOption {
  value: 'great' | 'good' | 'neutral' | 'stressed' | 'anxious';
  label: string;
  icon: any;
  color: string;
}

export default function JournalScreen() {
  const { theme } = useTheme();
  const { entries, loading, addEntry } = useJournalEntries();
  const { 
    streakData, 
    loading: streakLoading, 
    getStreakStatus, 
    getStreakMilestones,
    recordJournalEntry
  } = useJournalStreak();

  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'neutral' | 'stressed' | 'anxious'>('neutral');
  const [currentStress, setCurrentStress] = useState(50);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState({ streak: 0, isNewRecord: false });

  const moodOptions: MoodOption[] = [
    { value: 'great', label: 'Great', icon: Smile, color: '#A8E6CF' },
    { value: 'good', label: 'Good', icon: Smile, color: '#DDA0DD' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: '#FFD93D' },
    { value: 'stressed', label: 'Stressed', icon: Frown, color: '#FFB347' },
    { value: 'anxious', label: 'Anxious', icon: Frown, color: '#FF6B6B' },
  ];

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleSaveEntry = () => {
    if (newEntry.trim()) {
      addEntry(newEntry.trim(), selectedMood, currentStress, ['new-entry']).then(async ({ error }) => {
        if (error) {
          Alert.alert('Error', 'Failed to save entry. Please try again.');
        } else {
          // Check for streak celebration
          const streakResult = await recordJournalEntry();
          if (streakResult.streakIncreased && streakResult.newStreak > 1) {
            const isNewRecord = streakResult.newStreak > streakData.longestStreak;
            setCelebrationData({ 
              streak: streakResult.newStreak, 
              isNewRecord 
            });
            setShowCelebration(true);
          }
          
          setNewEntry('');
          setIsWriting(false);
          setSelectedMood('neutral');
          setCurrentStress(50);
          Alert.alert('Entry Saved', 'Your journal entry has been saved successfully.');
        }
      });
    }
  };

  const handleCancelWriting = () => {
    setIsWriting(false);
    setNewEntry('');
    setSelectedMood('neutral');
    setCurrentStress(50);
  };

  const getMoodIcon = (mood: string) => {
    const option = moodOptions.find(opt => opt.value === mood);
    if (option) {
      const IconComponent = option.icon;
      return <IconComponent size={20} color={option.color} strokeWidth={2} />;
    }
    return <Meh size={20} color="#9CA3AF" strokeWidth={2} />;
  };

  const getMoodColor = (mood: string) => {
    const option = moodOptions.find(opt => opt.value === mood);
    return option ? option.color : '#9CA3AF';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getAverageStress = () => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, entry) => sum + entry.stress_level, 0);
    return Math.round(total / entries.length);
  };

  if (isWriting) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={theme.colors.gradient.primary}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.writingContainer}>
              <View style={styles.writingHeader}>
                <Text style={[styles.writingTitle, { color: theme.colors.text }]}>New Entry</Text>
                <Text style={[styles.writingDate, { color: theme.colors.textSecondary }]}>{formatDate(new Date().toISOString().split('T')[0])}</Text>
              </View>

              {/* Mood Selection */}
              <View style={styles.moodSection}>
                <Text style={[styles.moodSectionTitle, { color: theme.colors.text }]}>How are you feeling?</Text>
                <View style={styles.moodOptions}>
                  {moodOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.moodOption,
                          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
                          selectedMood === option.value && { backgroundColor: option.color, borderColor: option.color }
                        ]}
                        onPress={() => setSelectedMood(option.value)}
                      >
                        <IconComponent 
                          size={24} 
                          color={selectedMood === option.value ? '#FFFFFF' : option.color} 
                          strokeWidth={2}
                        />
                        <Text style={[
                          styles.moodOptionText,
                          { color: theme.colors.textSecondary },
                          selectedMood === option.value && { color: '#FFFFFF' }
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Stress Level */}
              <View style={styles.stressSection}>
                <Text style={styles.stressSectionTitle}>
                  Stress Level: {currentStress}%
                </Text>
                <View style={styles.stressSlider}>
                  <View style={[styles.stressTrack, { backgroundColor: theme.colors.border }]}>
                    <View 
                      style={[
                        styles.stressFill, 
                        { width: `${currentStress}%`, backgroundColor: theme.colors.primary }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              {/* Text Input */}
              <View style={styles.textInputSection}>
                <Text style={[styles.textInputLabel, { color: theme.colors.text }]}>What's on your mind?</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: theme.colors.surface, 
                    color: theme.colors.text,
                    borderColor: theme.colors.border
                  }]}
                  multiline
                  numberOfLines={8}
                  placeholder="Write about your thoughts, feelings, or experiences..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newEntry}
                  onChangeText={setNewEntry}
                  textAlignVertical="top"
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.writingActions}>
                <TouchableOpacity style={[styles.cancelButton, { backgroundColor: theme.colors.border }]} onPress={handleCancelWriting}>
                  <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveEntry}>
                  <LinearGradient
                    colors={[theme.colors.primary, theme.colors.secondary]}
                    style={styles.saveButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.saveButtonText}>Save Entry</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ForestAnimations type="petals" intensity="medium">
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
              <View style={styles.headerContent}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Mindful Journal</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Track your emotional journey</Text>
              </View>
              <ThemeToggle />
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <Heart size={24} color={theme.colors.primary} strokeWidth={2} />
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>{entries.length}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Entries</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <Brain size={24} color={theme.colors.secondary} strokeWidth={2} />
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>{getAverageStress()}%</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Avg Stress</Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                <TrendingUp size={24} color={theme.colors.accent} strokeWidth={2} />
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>7</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Day Streak</Text>
              </View>
            </View>

            {/* New Entry Button */}
            {/* Streak Display */}
            {!streakLoading && (
              <View style={styles.streakContainer}>
                <StreakDisplay
                  streakData={streakData}
                  status={getStreakStatus()}
                  milestones={getStreakMilestones()}
                  onPress={() => {
                    // Could navigate to detailed streak view
                    console.log('Streak pressed');
                  }}
                />
              </View>
            )}

            <TouchableOpacity style={styles.newEntryButton} onPress={handleStartWriting}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.newEntryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Plus size={24} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.newEntryText}>New Entry</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity style={styles.quickAction}>
                <Mic size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text style={[styles.quickActionText, { color: theme.colors.textSecondary }]}>Voice Note</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAction}>
                <Calendar size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text style={[styles.quickActionText, { color: theme.colors.textSecondary }]}>Weekly Review</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAction}>
                <TrendingUp size={20} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text style={[styles.quickActionText, { color: theme.colors.textSecondary }]}>Insights</Text>
              </TouchableOpacity>
            </View>

            {/* Journal Entries */}
            <View style={styles.entriesContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Entries</Text>
              
              {entries.map((entry) => (
                <View key={entry.id} style={[styles.entryCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.entryHeader}>
                    <View style={styles.entryDateMood}>
                      <Text style={[styles.entryDate, { color: theme.colors.textSecondary }]}>
                        {formatDate(entry.created_at)}
                      </Text>
                      <View style={styles.entryMood}>
                        {getMoodIcon(entry.mood)}
                        <Text style={[styles.entryMoodText, { color: getMoodColor(entry.mood) }]}>
                          {moodOptions.find(opt => opt.value === entry.mood)?.label}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.entryStress}>
                      <Text style={[styles.entryStressText, { color: theme.colors.textSecondary }]}>{entry.stress_level}%</Text>
                      <View style={[styles.entryStressBar, { backgroundColor: theme.colors.border }]}>
                        <View 
                          style={[
                            styles.entryStressBarFill,
                            { 
                              width: `${entry.stress_level}%`,
                              backgroundColor: getMoodColor(entry.mood)
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>

                  <Text style={[styles.entryContent, { color: theme.colors.text }]}>{entry.content}</Text>

                  <View style={styles.entryTags}>
                    {entry.tags.map((tag, index) => (
                      <View key={index} style={[styles.entryTag, { backgroundColor: theme.colors.border }]}>
                        <Text style={[styles.entryTagText, { color: theme.colors.textSecondary }]}>#{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.editEntryButton}>
                    <Edit3 size={16} color={theme.colors.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>

        {/* Streak Celebration Modal */}
        <StreakCelebrationModal
          visible={showCelebration}
          onClose={() => setShowCelebration(false)}
          streakCount={celebrationData.streak}
          isNewRecord={celebrationData.isNewRecord}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    marginTop: 4,
  },
  newEntryButton: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  newEntryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  newEntryText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  streakContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    marginTop: 8,
  },
  entriesContainer: {
    marginHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  entryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryDateMood: {
    flex: 1,
  },
  entryDate: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 4,
  },
  entryMood: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryMoodText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginLeft: 6,
  },
  entryStress: {
    alignItems: 'flex-end',
  },
  entryStressText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    marginBottom: 4,
  },
  entryStressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  entryStressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  entryContent: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 24,
    marginBottom: 12,
  },
  entryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  entryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  entryTagText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  editEntryButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  // Writing Mode Styles
  writingContainer: {
    flex: 1,
    padding: 24,
  },
  writingHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  writingTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
  },
  writingDate: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    marginTop: 4,
  },
  moodSection: {
    marginBottom: 24,
  },
  moodSectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 16,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  moodOptionText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    marginLeft: 8,
  },
  stressSection: {
    marginBottom: 24,
  },
  stressSectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 12,
  },
  stressSlider: {
    paddingHorizontal: 4,
  },
  stressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  stressFill: {
    height: '100%',
    borderRadius: 4,
  },
  textInputSection: {
    flex: 1,
    marginBottom: 24,
  },
  textInputLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 12,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  writingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
  },
  saveButton: {
    flex: 1,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#A8E6CF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#FFFFFF',
  },
});