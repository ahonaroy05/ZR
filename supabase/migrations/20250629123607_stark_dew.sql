/*
  # Fix Database Schema and Policies

  1. New Tables
    - Ensures tables exist: users, profiles, journal_entries, stress_readings
    - Each table has appropriate columns and constraints
  
  2. Security
    - Enables RLS on all tables
    - Adds policies for authenticated users to manage their own data
    - Uses conditional policy creation to avoid "already exists" errors
*/

-- Create users table (if it doesn't exist already)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  mood text NOT NULL,
  stress_level integer NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT journal_entries_mood_check CHECK (mood IN ('great', 'good', 'neutral', 'stressed', 'anxious')),
  CONSTRAINT journal_entries_stress_level_check CHECK (stress_level >= 0 AND stress_level <= 100)
);

-- Create stress_readings table
CREATE TABLE IF NOT EXISTS public.stress_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stress_level integer NOT NULL,
  location text,
  activity text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT stress_readings_stress_level_check CHECK (stress_level >= 0 AND stress_level <= 100)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stress_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" 
      ON public.profiles 
      FOR INSERT 
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" 
      ON public.profiles 
      FOR UPDATE 
      TO public
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" 
      ON public.profiles 
      FOR SELECT 
      TO public
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create policies for journal_entries (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can insert own journal entries'
  ) THEN
    CREATE POLICY "Users can insert own journal entries" 
      ON public.journal_entries 
      FOR INSERT 
      TO public
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can update own journal entries'
  ) THEN
    CREATE POLICY "Users can update own journal entries" 
      ON public.journal_entries 
      FOR UPDATE 
      TO public
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can view own journal entries'
  ) THEN
    CREATE POLICY "Users can view own journal entries" 
      ON public.journal_entries 
      FOR SELECT 
      TO public
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'journal_entries' AND policyname = 'Users can delete own journal entries'
  ) THEN
    CREATE POLICY "Users can delete own journal entries" 
      ON public.journal_entries 
      FOR DELETE 
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for stress_readings (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stress_readings' AND policyname = 'Users can insert own stress readings'
  ) THEN
    CREATE POLICY "Users can insert own stress readings" 
      ON public.stress_readings 
      FOR INSERT 
      TO public
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'stress_readings' AND policyname = 'Users can view own stress readings'
  ) THEN
    CREATE POLICY "Users can view own stress readings" 
      ON public.stress_readings 
      FOR SELECT 
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;