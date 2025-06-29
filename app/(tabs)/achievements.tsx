import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy, Award, Target, Users, BookOpen, Heart, Filter, Star } from 'lucide-react-native';
import ThemeToggle from '@/components/ThemeToggle';
import AchievementBadge from '@/components/AchievementBadge';
import { Achievement } from '@/types/achievements';
import ForestAnimations from '@/components/ForestAnimations';

export default function AchievementsScreen() {
  const { theme } = useTheme();
  const { 
    achievements, 
    loading, 
    getAchievementsByCategory, 
    getUnlockedAchievements,
    getTotalProgress,
    getRecentAchievements 
  } = useAchievements();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  const categories = [
    { id: 'all', title: 'All', icon: Trophy, color: theme.colors.primary },
    { id: 'consistency', title: 'Consistency', icon: Target, color: '#FF6B6B' },
    { id: 'goals', title: 'Goals', icon: Award, color: '#FFD93D' },
    { id: 'social', title: 'Social', icon: Users, color: '#A8E6CF' },
    { id: 'learning', title: 'Learning', icon: BookOpen, color: '#DDA0DD' },
    { id: 'wellness', title: 'Wellness', icon: Heart, color: '#FFB6C1' },
  ];

  const tiers = [
    { id: 'all', title: 'All Tiers' },
    { id: 'bronze', title: 'Bronze' },
    { id: 'silver', title: 'Silver' },
    { id: 'gold', title: 'Gold' },
  ];

  const getFilteredAchievements = () => {
    let filtered = achievements;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }
    
    if (selectedTier !== 'all') {
      filtered = filtered.filter(a => a.tier === selectedTier);
    }
    
    return filtered.sort((a, b) => {
      // Sort by unlocked status first, then by tier, then by progress
      if (a.isUnlocked !== b.isUnlocked) {
        return a.isUnlocked ? -1 : 1;
      }
      
      const tierOrder = { gold: 3, silver: 2, bronze: 1 };
      if (tierOrder[a.tier] !== tierOrder[b.tier]) {
        return tierOrder[b.tier] - tierOrder[a.tier];
      }
      
      return b.currentProgress - a.currentProgress;
    });
  };

  const totalProgress = getTotalProgress();
  const recentAchievements = getRecentAchievements(3);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Loading achievements...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <ForestAnimations type="petals" intensity="medium">
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
                <Text style={[styles.title, { color: theme.colors.text }]}>Achievements</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Celebrate your wellness journey
                </Text>
              </View>
              <ThemeToggle />
            </View>

            {/* Progress Overview */}
            <View style={[styles.progressCard, { backgroundColor: theme.colors.surface }]}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.secondary]}
                style={styles.progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.progressContent}>
                  <Trophy size={32} color="#FFFFFF" strokeWidth={2} />
                  <View style={styles.progressText}>
                    <Text style={styles.progressTitle}>
                      {totalProgress.unlocked} of {totalProgress.total}
                    </Text>
                    <Text style={styles.progressSubtitle}>
                      Achievements Unlocked
                    </Text>
                  </View>
                  <View style={styles.progressPercentage}>
                    <Text style={styles.percentageText}>
                      {Math.round(totalProgress.percentage)}%
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressBar}>
                  <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${totalProgress.percentage}%`,
                          backgroundColor: '#FFFFFF'
                        }
                      ]} 
                    />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
              <View style={styles.recentSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Recently Unlocked
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recentList}
                >
                  {recentAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      size="medium"
                      showProgress={false}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Achievement Previews */}
            <View style={styles.previewSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Achievement Badges
              </Text>
              <Text style={[styles.previewSubtitle, { color: theme.colors.textSecondary }]}>
                Unlock these beautiful badges as you progress on your wellness journey
              </Text>
              
              <View style={styles.badgePreviewGrid}>
                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#A8E6CF' }]}>
                    <Text style={styles.previewIcon}>🌱</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Zen Sprout</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>First meditation</Text>
                </View>

                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#DDA0DD' }]}>
                    <Text style={styles.previewIcon}>🔄</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Lavender Loop</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>7-day streak</Text>
                </View>

                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#81ECEC' }]}>
                    <Text style={styles.previewIcon}>🧲</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Mind Magnet</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>Focus master</Text>
                </View>

                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#FFD93D' }]}>
                    <Text style={styles.previewIcon}>☀️</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Calm Commuter</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>Mindful travel</Text>
                </View>

                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#FFB6C1' }]}>
                    <Text style={styles.previewIcon}>🎨</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Mood Alchemist</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>Emotion tracker</Text>
                </View>

                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#A8E6CF' }]}>
                    <Text style={styles.previewIcon}>🛡️</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Focus Forcefield</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>Distraction shield</Text>
                </View>

                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#81ECEC' }]}>
                    <Text style={styles.previewIcon}>🎵</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Sound Surfer</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>Audio explorer</Text>
                </View>

                <View style={[styles.badgePreview, { backgroundColor: theme.colors.surface }]}>
                  <View style={[styles.previewBadge, { backgroundColor: '#DDA0DD' }]}>
                    <Text style={styles.previewIcon}>🧘</Text>
                  </View>
                  <Text style={[styles.previewName, { color: theme.colors.text }]}>Stillness Master</Text>
                  <Text style={[styles.previewDesc, { color: theme.colors.textSecondary }]}>Meditation guru</Text>
                </View>
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Categories
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              >
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryButton,
                        { backgroundColor: theme.colors.surface },
                        selectedCategory === category.id && { backgroundColor: category.color },
                      ]}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <IconComponent 
                        size={20} 
                        color={selectedCategory === category.id ? '#FFFFFF' : category.color} 
                        strokeWidth={2} 
                      />
                      <Text
                        style={[
                          styles.categoryText,
                          { color: theme.colors.text },
                          selectedCategory === category.id && { color: '#FFFFFF' },
                        ]}
                      >
                        {category.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Tier Filter */}
            <View style={styles.tierSection}>
              <View style={styles.tierButtons}>
                {tiers.map((tier) => (
                  <TouchableOpacity
                    key={tier.id}
                    style={[
                      styles.tierButton,
                      { backgroundColor: theme.colors.surface },
                      selectedTier === tier.id && { backgroundColor: theme.colors.primary },
                    ]}
                    onPress={() => setSelectedTier(tier.id)}
                  >
                    <Text
                      style={[
                        styles.tierText,
                        { color: theme.colors.text },
                        selectedTier === tier.id && { color: '#FFFFFF' },
                      ]}
                    >
                      {tier.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Achievements Grid */}
            <View style={styles.achievementsGrid}>
              <FlatList
                data={getFilteredAchievements()}
                renderItem={({ item }) => (
                  <AchievementBadge
                    title={item.title}
                    description={item.description}
                    type={item.tier}
                    icon={item.icon}
                    unlocked={item.isUnlocked}
                    progress={item.currentProgress}
                    maxProgress={item.requirement}
                    size="medium"
                    onPress={() => {
                      // Could show achievement details modal
                      console.log('Achievement pressed:', item.title);
                    }}
                  />
                )}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.gridRow}
              />
            </View>

            {/* Achievement Tips */}
            <View style={[styles.tipsCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>
                💡 Achievement Tips
              </Text>
              <Text style={[styles.tipsText, { color: theme.colors.textSecondary }]}>
                • Complete daily journal entries to build consistency streaks{'\n'}
                • Participate in guided sessions to unlock wellness achievements{'\n'}
                • Share feedback and support others for social achievements{'\n'}
                • Challenge yourself with difficult tasks for goal achievements
              </Text>
            </View>
          </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
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
  progressCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: 24,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    flex: 1,
    marginLeft: 16,
  },
  progressTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  progressSubtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressPercentage: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  progressBar: {
    marginTop: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    marginHorizontal: 24,
  },
  recentList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  categoryList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    marginLeft: 8,
  },
  tierSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tierButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  tierButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tierText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  achievementsGrid: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  gridContent: {
    gap: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    lineHeight: 20,
  },
  previewSection: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  previewSubtitle: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  badgePreviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgePreview: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  previewBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    // Add subtle border
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  previewIcon: {
    fontSize: 18,
  },
  previewName: {
    fontSize: 10,
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
    marginBottom: 2,
  },
  previewDesc: {
    fontSize: 8,
    fontFamily: 'Quicksand-Regular',
    textAlign: 'center',
  },
});