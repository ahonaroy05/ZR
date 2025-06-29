import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Check if environment variables are properly configured
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Use valid fallback URLs to prevent URL construction errors
const defaultUrl = 'https://demo.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MjU0MjM4MCwiZXhwIjoxOTU4MTE4MzgwfQ.BinSx3VLlsYuGK_FagbI_gzTKzIajJm-TKdRq8Y0UI4';

// Validate environment variables
const isPlaceholder = !supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'https://placeholder.supabase.co' || 
    supabaseAnonKey === 'placeholder-key';

if (isPlaceholder) {
  console.warn('⚠️ Supabase environment variables are not configured properly. Please set up your .env file with valid Supabase credentials.');
}

// Simple storage implementation for different platforms
const createStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => {
        try {
          return Promise.resolve(localStorage.getItem(key));
        } catch (e) {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch (e) {
          return Promise.resolve();
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch (e) {
          return Promise.resolve();
        }
      }
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
    }
  };
};

export const supabase = createClient(
  (supabaseUrl && !isPlaceholder) ? supabaseUrl : defaultUrl, 
  (supabaseAnonKey && !isPlaceholder) ? supabaseAnonKey : defaultKey, 
  {
    auth: {
      storage: createStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    }
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