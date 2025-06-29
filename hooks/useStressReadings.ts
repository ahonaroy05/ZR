import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface StressReading {
  id: string;
  user_id: string;
  stress_level: number;
  location: string | null;
  activity: string | null;
  created_at: string;
}

export function useStressReadings() {
  const [readings, setReadings] = useState<StressReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const { user } = useAuth();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchReadings = async () => {
    if (!user) return;

    try {
      if (mounted.current) setLoading(true);
      const { data, error } = await supabase
        .from('stress_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (mounted.current) {
        setReadings(data || []);
      }
    } catch (err) {
      if (mounted.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const addReading = async (
    stressLevel: number,
    location: string | null = null,
    activity: string | null = null
  ) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('stress_readings')
        .insert({
          user_id: user.id,
          stress_level: stressLevel,
          location,
          activity,
        })
        .select()
        .single();

      if (error) throw error;

      if (mounted.current) {
        setReadings(prev => [data, ...prev]);
      }
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add reading';
      if (mounted.current) {
        setError(errorMessage);
      }
      return { error: errorMessage };
    }
  };

  const getAverageStressLevel = (period: 'day' | 'week' | 'month' = 'day') => {
    if (readings.length === 0) return 0;

    const now = new Date();
    const filteredReadings = readings.filter(reading => {
      const readingDate = new Date(reading.created_at);
      const diffTime = Math.abs(now.getTime() - readingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (period === 'day') return diffDays <= 1;
      if (period === 'week') return diffDays <= 7;
      if (period === 'month') return diffDays <= 30;
      return true;
    });

    if (filteredReadings.length === 0) return 0;
    
    const sum = filteredReadings.reduce((acc, reading) => acc + reading.stress_level, 0);
    return Math.round(sum / filteredReadings.length);
  };

  const getStressLevelTrend = (period: 'week' | 'month' = 'week') => {
    if (readings.length < 2) return 'stable';

    const now = new Date();
    const filteredReadings = readings.filter(reading => {
      const readingDate = new Date(reading.created_at);
      const diffTime = Math.abs(now.getTime() - readingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (period === 'week') return diffDays <= 7;
      if (period === 'month') return diffDays <= 30;
      return true;
    });

    if (filteredReadings.length < 2) return 'stable';

    // Sort by date (oldest first)
    const sortedReadings = [...filteredReadings].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Calculate trend
    const firstHalf = sortedReadings.slice(0, Math.floor(sortedReadings.length / 2));
    const secondHalf = sortedReadings.slice(Math.floor(sortedReadings.length / 2));

    const firstHalfAvg = firstHalf.reduce((acc, reading) => acc + reading.stress_level, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((acc, reading) => acc + reading.stress_level, 0) / secondHalf.length;

    const difference = secondHalfAvg - firstHalfAvg;
    
    if (difference < -5) return 'decreasing';
    if (difference > 5) return 'increasing';
    return 'stable';
  };

  useEffect(() => {
    fetchReadings();
  }, [user]);

  return {
    readings,
    loading,
    error,
    addReading,
    getAverageStressLevel,
    getStressLevelTrend,
    refetch: fetchReadings,
  };
}