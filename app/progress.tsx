import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, TrendingUp, Calendar, Target, Award, ChartBar as BarChart3, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const periods = [
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: 'year', label: 'This Year' },
  ];

  const stats = [
    {
      title: 'Sessions Completed',
      value: '24',
      change: '+12%',
      icon: Target,
      color: '#A8E6CF',
    },
    {
      title: 'Total Minutes',
      value: '180',
      change: '+8%',
      icon: Clock,
      color: '#DDA0DD',
    },
    {
      title: 'Stress Reduction',
      value: '23%',
      change: '+5%',
      icon: TrendingUp,
      color: '#FFB6C1',
    },
    {
      title: 'Streak Days',
      value: '7',
      change: '+2',
      icon: Award,
      color: '#FFD93D',
    },
  ];

  const achievements = [
    { title: 'First Session', description: 'Completed your first meditation', unlocked: true },
    { title: 'Week Warrior', description: 'Meditated 7 days in a row', unlocked: true },
    { title: 'Zen Master', description: 'Completed 50 sessions', unlocked: false },
    { title: 'Mindful Commuter', description: 'Used the app during commute 10 times', unlocked: true },
  ];

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
            <Text style={[styles.title, { color: theme.colors.text }]}>Progress Tracking</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Period Selection */}
            <View style={styles.periodContainer}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.periodButton,
                    { backgroundColor: theme.colors.surface },
                    selectedPeriod === period.key && { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => setSelectedPeriod(period.key as any)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      { color: theme.colors.text },
                      selectedPeriod === period.key && { color: '#FFFFFF' },
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Stats Grid */}
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <View key={index} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                      <IconComponent size={24} color="#FFFFFF" strokeWidth={2} />
                    </View>
                    <Text style={[styles.statValue, { color: theme.colors.text }]}>{stat.value}</Text>
                    <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{stat.title}</Text>
                    <Text style={[styles.statChange, { color: '#4ADE80' }]}>{stat.change}</Text>
                  </View>
                );
              })}
            </View>

            {/* Chart Placeholder */}
            <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Wellness Trend</Text>
                <BarChart3 size={20} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <View style={styles.chartPlaceholder}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.secondary]}
                  style={styles.chartGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.chartText}>Interactive Chart Coming Soon</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Achievements */}
            <View style={[styles.achievementsContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Achievements</Text>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.unlocked ? theme.colors.primary : theme.colors.border }
                  ]}>
                    <Award size={20} color={achievement.unlocked ? '#FFFFFF' : theme.colors.textSecondary} strokeWidth={2} />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      { color: achievement.unlocked ? theme.colors.text : theme.colors.textSecondary }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  periodContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  periodButton: {
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
  periodText: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    textAlign: 'center',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Quicksand-SemiBold',
  },
  chartContainer: {
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#FFFFFF',
  },
  achievementsContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
});