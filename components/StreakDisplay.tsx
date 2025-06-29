import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { Flame, Trophy, Calendar, Target } from 'lucide-react-native';
import { StreakData } from '@/hooks/useJournalStreak';

interface StreakDisplayProps {
  streakData: StreakData;
  status: {
    status: 'none' | 'completed' | 'active' | 'broken';
    message: string;
    hoursRemaining: number;
  };
  milestones: {
    achieved: number[];
    next?: number;
    progress: number;
  };
  onPress?: () => void;
}

export default function StreakDisplay({ 
  streakData, 
  status, 
  milestones, 
  onPress 
}: StreakDisplayProps) {
  const { theme } = useTheme();

  const getStatusColor = () => {
    switch (status.status) {
      case 'completed': return '#4ADE80';
      case 'active': return '#FFD93D';
      case 'broken': return '#FF6B6B';
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = () => {
    switch (status.status) {
      case 'completed': return <Flame size={24} color="#FFFFFF" strokeWidth={2} />;
      case 'active': return <Target size={24} color="#FFFFFF" strokeWidth={2} />;
      case 'broken': return <Calendar size={24} color="#FFFFFF" strokeWidth={2} />;
      default: return <Calendar size={24} color="#FFFFFF" strokeWidth={2} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusIcon, { backgroundColor: getStatusColor() }]}>
            {getStatusIcon()}
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Journal Streak
            </Text>
            <Text style={[styles.statusMessage, { color: theme.colors.textSecondary }]}>
              {status.message}
            </Text>
          </View>
        </View>
      </View>

      {/* Streak Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <LinearGradient
            colors={[theme.colors.pastel.peach, theme.colors.pastel.rose]}
            style={styles.statGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Flame size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {streakData.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Current
          </Text>
        </View>

        <View style={styles.statItem}>
          <LinearGradient
            colors={[theme.colors.pastel.mint, theme.colors.pastel.sage]}
            style={styles.statGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Trophy size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {streakData.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Best
          </Text>
        </View>

        <View style={styles.statItem}>
          <LinearGradient
            colors={[theme.colors.pastel.lavender, theme.colors.pastel.lilac]}
            style={styles.statGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Calendar size={20} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {streakData.totalEntries}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
            Total
          </Text>
        </View>
      </View>

      {/* Progress to Next Milestone */}
      {milestones.next && (
        <View style={styles.milestoneContainer}>
          <View style={styles.milestoneHeader}>
            <Text style={[styles.milestoneTitle, { color: theme.colors.text }]}>
              Next Milestone: {milestones.next} days
            </Text>
            <Text style={[styles.milestoneProgress, { color: theme.colors.textSecondary }]}>
              {streakData.currentStreak}/{milestones.next}
            </Text>
          </View>
          
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={[styles.progressFill, { width: `${milestones.progress}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      )}

      {/* Achievement Badges */}
      {milestones.achieved.length > 0 && (
        <View style={styles.achievementsContainer}>
          <Text style={[styles.achievementsTitle, { color: theme.colors.text }]}>
            Achievements
          </Text>
          <View style={styles.badgesContainer}>
            {milestones.achieved.slice(-3).map((milestone) => (
              <View key={milestone} style={[styles.badge, { backgroundColor: getStatusColor() }]}>
                <Text style={styles.badgeText}>{milestone}</Text>
              </View>
            ))}
            {milestones.achieved.length > 3 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.border }]}>
                <Text style={[styles.badgeText, { color: theme.colors.textSecondary }]}>
                  +{milestones.achieved.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  statusMessage: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  milestoneContainer: {
    marginBottom: 16,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
  milestoneProgress: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsContainer: {
    marginTop: 4,
  },
  achievementsTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
  },
});