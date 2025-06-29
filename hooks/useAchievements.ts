import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { Achievement, ACHIEVEMENT_DEFINITIONS } from '@/types/achievements';

const STORAGE_KEY = 'zenroute_achievements';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENT_DEFINITIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const { user } = useAuth();

  const getStorageKey = () => `${STORAGE_KEY}_${user?.id}`;

  useEffect(() => {
    mounted.current = true;
    if (user) {
      loadAchievements();
    }
    
    return () => {
      mounted.current = false;
    };
  }, [user]);

  const loadAchievements = async () => {
    try {
      if (mounted.current) setLoading(true);
      const stored = await AsyncStorage.getItem(getStorageKey());
      if (stored) {
        const storedAchievements = JSON.parse(stored);
        // Merge with definitions to ensure we have all achievements
        const mergedAchievements = ACHIEVEMENT_DEFINITIONS.map(def => {
          const stored = storedAchievements.find((a: Achievement) => a.id === def.id);
          return stored ? { ...def, ...stored } : def;
        });
        if (mounted.current) setAchievements(mergedAchievements);
      } else {
        if (mounted.current) setAchievements(ACHIEVEMENT_DEFINITIONS);
      }
    } catch (err) {
      if (mounted.current) setError('Failed to load achievements');
      console.error('Error loading achievements:', err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const saveAchievements = async (newAchievements: Achievement[]) => {
    try {
      await AsyncStorage.setItem(getStorageKey(), JSON.stringify(newAchievements));
      if (mounted.current) {
        setAchievements(newAchievements);
        setError(null);
      }
    } catch (err) {
      if (mounted.current) setError('Failed to save achievements');
      console.error('Error saving achievements:', err);
    }
  };

  const updateProgress = async (achievementId: string, progress: number) => {
    const updatedAchievements = achievements.map(achievement => {
      if (achievement.id === achievementId) {
        const newProgress = Math.min(progress, achievement.requirement);
        const wasUnlocked = achievement.isUnlocked;
        const isNowUnlocked = newProgress >= achievement.requirement;
        
        return {
          ...achievement,
          currentProgress: newProgress,
          isUnlocked: isNowUnlocked,
          unlockedAt: isNowUnlocked && !wasUnlocked ? new Date().toISOString() : achievement.unlockedAt,
        };
      }
      return achievement;
    });

    await saveAchievements(updatedAchievements);
    
    // Return newly unlocked achievements
    return updatedAchievements.filter(a => 
      a.isUnlocked && 
      !achievements.find(old => old.id === a.id)?.isUnlocked
    );
  };

  const incrementProgress = async (achievementId: string, amount: number = 1) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
      return await updateProgress(achievementId, achievement.currentProgress + amount);
    }
    return [];
  };

  const unlockAchievement = async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.isUnlocked) {
      return await updateProgress(achievementId, achievement.requirement);
    }
    return [];
  };

  const getAchievementsByCategory = (category: string) => {
    return achievements.filter(a => a.category === category);
  };

  const getUnlockedAchievements = () => {
    return achievements.filter(a => a.isUnlocked);
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
  };

  const getTotalProgress = () => {
    const total = achievements.length;
    const unlocked = achievements.filter(a => a.isUnlocked).length;
    return { total, unlocked, percentage: (unlocked / total) * 100 };
  };

  const getRecentAchievements = (limit: number = 5) => {
    return achievements
      .filter(a => a.isUnlocked && a.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, limit);
  };

  // Helper functions for specific achievement types
  const recordJournalEntry = async () => {
    return await incrementProgress('consistency-bronze', 1);
  };

  const recordTaskCompletion = async (isEarly: boolean = false) => {
    const newlyUnlocked = [];
    if (isEarly) {
      const earlyBird = await incrementProgress('early-bird-bronze', 1);
      newlyUnlocked.push(...earlyBird);
    }
    const goalCrusher = await incrementProgress('goal-crusher-bronze', 1);
    newlyUnlocked.push(...goalCrusher);
    return newlyUnlocked;
  };

  const recordLearningActivity = async () => {
    return await incrementProgress('knowledge-bronze', 1);
  };

  const recordFeedback = async () => {
    return await incrementProgress('feedback-bronze', 1);
  };

  const recordTeamContribution = async () => {
    return await incrementProgress('team-player-bronze', 1);
  };

  const recordInnovation = async () => {
    return await incrementProgress('innovation-bronze', 1);
  };

  const recordProgress = async () => {
    return await incrementProgress('progress-bronze', 1);
  };

  const recordChallenge = async () => {
    return await incrementProgress('challenge-bronze', 1);
  };

  const recordAttendance = async () => {
    return await incrementProgress('attendance-bronze', 1);
  };

  return {
    achievements,
    loading,
    error,
    updateProgress,
    incrementProgress,
    unlockAchievement,
    getAchievementsByCategory,
    getUnlockedAchievements,
    getProgressPercentage,
    getTotalProgress,
    getRecentAchievements,
    // Specific action helpers
    recordJournalEntry,
    recordTaskCompletion,
    recordLearningActivity,
    recordFeedback,
    recordTeamContribution,
    recordInnovation,
    recordProgress,
    recordChallenge,
    recordAttendance,
    refetch: loadAchievements,
  };
}