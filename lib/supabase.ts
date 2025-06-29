import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Check if environment variables are properly configured
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://placeholder.supabase.co' || 
    supabaseAnonKey === 'placeholder-key') {
  console.warn('⚠️ Supabase environment variables are not configured properly. Please set up your .env file with valid Supabase credentials.');
}

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

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key', 
  {
    auth: {
      storage: createStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

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