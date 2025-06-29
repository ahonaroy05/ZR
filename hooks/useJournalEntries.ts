import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useJournalStreak } from '@/hooks/useJournalStreak';
import { useAchievements } from '@/hooks/useAchievements';
import { useRef } from 'react';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'stressed' | 'anxious';
  stress_level: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const { user } = useAuth();
  const { recordJournalEntry } = useJournalStreak();
  const { recordJournalEntry: recordAchievementProgress } = useAchievements();

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      if (mounted.current) setLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (mounted.current) {
        setEntries(data || []);
      }
    } catch (err) {
      if (mounted.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const addEntry = async (
    content: string,
    mood: JournalEntry['mood'],
    stressLevel: number,
    tags: string[] = []
  ) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
          mood,
          stress_level: stressLevel,
          tags,
        })
        .select()
        .single();

      if (error) throw error;

      if (mounted.current) {
        setEntries(prev => [data, ...prev]);
      }
      
      // Record streak entry
      const streakResult = await recordJournalEntry();
      
      // Record achievement progress
      await recordAchievementProgress();
      
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add entry';
      if (mounted.current) {
        setError(errorMessage);
      }
      return { error: errorMessage };
    }
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (mounted.current) {
        setEntries(prev => prev.map(entry => 
          entry.id === id ? { ...entry, ...data } : entry
        ));
      }
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update entry';
      if (mounted.current) {
        setError(errorMessage);
      }
      return { error: errorMessage };
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      if (mounted.current) {
        setEntries(prev => prev.filter(entry => entry.id !== id));
      }
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete entry';
      if (mounted.current) {
        setError(errorMessage);
      }
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
}