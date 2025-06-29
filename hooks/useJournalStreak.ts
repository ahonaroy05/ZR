import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  totalEntries: number;
  streakStartDate: string | null;
}

const STORAGE_KEY = 'zenroute_journal_streak';

const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastEntryDate: null,
  totalEntries: 0,
  streakStartDate: null,
};

export function useJournalStreak() {
  const [streakData, setStreakData] = useState<StreakData>(DEFAULT_STREAK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const { user } = useAuth();

  // Load streak data from storage
  useEffect(() => {
    mounted.current = true;
    if (user) {
      loadStreakData();
    }
    
    return () => {
      mounted.current = false;
    };
  }, [user]);

  const getStorageKey = () => `${STORAGE_KEY}_${user?.id}`;

  const loadStreakData = async () => {
    try {
      if (mounted.current) setLoading(true);
      const stored = await AsyncStorage.getItem(getStorageKey());
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Check if streak should be reset due to missed days
        const updatedData = checkAndUpdateStreak(parsedData);
        if (mounted.current) setStreakData(updatedData);
        
        // Save updated data if it changed
        if (JSON.stringify(updatedData) !== stored) {
          await saveStreakData(updatedData);
        }
      } else {
        if (mounted.current) setStreakData(DEFAULT_STREAK_DATA);
      }
    } catch (err) {
      if (mounted.current) setError('Failed to load streak data');
      console.error('Error loading streak data:', err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const saveStreakData = async (data: StreakData) => {
    try {
      await AsyncStorage.setItem(getStorageKey(), JSON.stringify(data));
      if (mounted.current) setError(null);
    } catch (err) {
      if (mounted.current) setError('Failed to save streak data');
      console.error('Error saving streak data:', err);
    }
  };

  const checkAndUpdateStreak = (data: StreakData): StreakData => {
    if (!data.lastEntryDate) {
      return data;
    }

    const now = new Date();
    const lastEntry = new Date(data.lastEntryDate);
    const hoursSinceLastEntry = (now.getTime() - lastEntry.getTime()) / (1000 * 60 * 60);

    // Reset streak if more than 24 hours have passed since last entry
    if (hoursSinceLastEntry > 24) {
      return {
        ...data,
        currentStreak: 0,
        streakStartDate: null,
      };
    }

    return data;
  };

  const isToday = (date: string): boolean => {
    const today = new Date();
    const entryDate = new Date(date);
    
    return (
      today.getFullYear() === entryDate.getFullYear() &&
      today.getMonth() === entryDate.getMonth() &&
      today.getDate() === entryDate.getDate()
    );
  };

  const isYesterday = (date: string): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const entryDate = new Date(date);
    
    return (
      yesterday.getFullYear() === entryDate.getFullYear() &&
      yesterday.getMonth() === entryDate.getMonth() &&
      yesterday.getDate() === entryDate.getDate()
    );
  };

  const recordJournalEntry = async (): Promise<{ streakIncreased: boolean; newStreak: number }> => {
    const now = new Date().toISOString();
    
    try {
      let newStreakData = { ...streakData };
      let streakIncreased = false;

      // Check if this is the first entry today
      if (!newStreakData.lastEntryDate || !isToday(newStreakData.lastEntryDate)) {
        // Increment total entries
        newStreakData.totalEntries += 1;

        // Handle streak logic
        if (!newStreakData.lastEntryDate) {
          // First entry ever
          newStreakData.currentStreak = 1;
          newStreakData.streakStartDate = now;
          streakIncreased = true;
        } else if (isYesterday(newStreakData.lastEntryDate)) {
          // Continuing streak
          newStreakData.currentStreak += 1;
          streakIncreased = true;
        } else {
          // Gap in entries - reset streak
          newStreakData.currentStreak = 1;
          newStreakData.streakStartDate = now;
          streakIncreased = true;
        }

        // Update longest streak if current streak is higher
        if (newStreakData.currentStreak > newStreakData.longestStreak) {
          newStreakData.longestStreak = newStreakData.currentStreak;
        }

        // Update last entry date
        newStreakData.lastEntryDate = now;

        // Save to storage
        await saveStreakData(newStreakData);
        if (mounted.current) setStreakData(newStreakData);
      }

      return {
        streakIncreased,
        newStreak: newStreakData.currentStreak,
      };
    } catch (err) {
      if (mounted.current) setError('Failed to record journal entry');
      console.error('Error recording journal entry:', err);
      return { streakIncreased: false, newStreak: streakData.currentStreak };
    }
  };

  const resetStreak = async () => {
    try {
      const resetData = {
        ...DEFAULT_STREAK_DATA,
        longestStreak: streakData.longestStreak, // Keep longest streak
        totalEntries: streakData.totalEntries, // Keep total entries
      };
      
      await saveStreakData(resetData);
      if (mounted.current) setStreakData(resetData);
    } catch (err) {
      if (mounted.current) setError('Failed to reset streak');
      console.error('Error resetting streak:', err);
    }
  };

  const getStreakStatus = () => {
    if (!streakData.lastEntryDate) {
      return {
        status: 'none' as const,
        message: 'Start your first journal entry!',
        hoursRemaining: 0,
      };
    }

    const now = new Date();
    const lastEntry = new Date(streakData.lastEntryDate);
    const hoursSinceLastEntry = (now.getTime() - lastEntry.getTime()) / (1000 * 60 * 60);

    if (isToday(streakData.lastEntryDate)) {
      return {
        status: 'completed' as const,
        message: 'Great job! You\'ve journaled today.',
        hoursRemaining: 0,
      };
    } else if (hoursSinceLastEntry <= 24) {
      const hoursRemaining = Math.max(0, 24 - hoursSinceLastEntry);
      return {
        status: 'active' as const,
        message: `Keep your streak alive! ${Math.ceil(hoursRemaining)} hours remaining.`,
        hoursRemaining: Math.ceil(hoursRemaining),
      };
    } else {
      return {
        status: 'broken' as const,
        message: 'Your streak was broken. Start a new one today!',
        hoursRemaining: 0,
      };
    }
  };

  const getStreakMilestones = () => {
    const milestones = [3, 7, 14, 30, 60, 100, 365];
    const current = streakData.currentStreak;
    
    const achieved = milestones.filter(m => current >= m);
    const next = milestones.find(m => m > current);
    
    return {
      achieved,
      next,
      progress: next ? (current / next) * 100 : 100,
    };
  };

  return {
    streakData,
    loading,
    error,
    recordJournalEntry,
    resetStreak,
    getStreakStatus,
    getStreakMilestones,
    refetch: loadStreakData,
  };
}