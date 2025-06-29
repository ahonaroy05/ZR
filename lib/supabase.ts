import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Use placeholder values for demo purposes - these will be replaced with real values from .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0NzQ0MDAsImV4cCI6MTk5MjA1MDQwMH0.placeholder';

// Simple storage implementation for different platforms
const createStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => {
        try {
          return Promise.resolve(localStorage.getItem(key));
        } catch {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
    };
  }
  
  // For native platforms, use a simple in-memory storage as fallback
  const storage = new Map<string, string>();
  return {
    getItem: (key: string) => Promise.resolve(storage.get(key) || null),
    setItem: (key: string, value: string) => {
      storage.set(key, value);
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      storage.delete(key);
      return Promise.resolve();
    },
  };
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: fetch
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          mood: 'great' | 'good' | 'neutral' | 'stressed' | 'anxious';
          stress_level: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          mood: 'great' | 'good' | 'neutral' | 'stressed' | 'anxious';
          stress_level: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          mood?: 'great' | 'good' | 'neutral' | 'stressed' | 'anxious';
          stress_level?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      stress_readings: {
        Row: {
          id: string;
          user_id: string;
          stress_level: number;
          location: string | null;
          activity: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stress_level: number;
          location?: string | null;
          activity?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stress_level?: number;
          location?: string | null;
          activity?: string | null;
          created_at?: string;
        };
      };
    };
  };
};