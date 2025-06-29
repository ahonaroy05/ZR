/*
  # Fix duplicate policies error

  1. New Tables
    - Ensures tables exist without recreating them
  2. Security
    - Enables RLS on tables if not already enabled
    - Creates policies only if they don't already exist
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

-- Enable Row Level Security (only if not already enabled)
DO $$ 
BEGIN
  -- Enable RLS on profiles if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on journal_entries if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'journal_entries' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
  END IF;
  
  -- Enable RLS on stress_readings if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'stress_readings' AND rowsecurity = true
  ) THEN
    ALTER TABLE public.stress_readings ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies for profiles (only if they don't already exist)
DO $$ 
BEGIN
  -- Users can insert own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" 
      ON public.profiles 
      FOR INSERT 
      TO public
      WITH CHECK (auth.uid() = id);
  END IF;
  
  -- Users can update own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" 
      ON public.profiles 
      FOR UPDATE 
      TO public
      USING (auth.uid() = id);
  END IF;
  
  -- Users can view own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" 
      ON public.profiles 
      FOR SELECT 
      TO public
      USING (auth.uid() = id);
  END IF;
END $$;

-- Create policies for journal_entries (only if they don't already exist)
DO $$ 
BEGIN
  -- Users can insert own journal entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'journal_entries' AND policyname = 'Users can insert own journal entries'
  ) THEN
    CREATE POLICY "Users can insert own journal entries" 
      ON public.journal_entries 
      FOR INSERT 
      TO public
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  -- Users can update own journal entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'journal_entries' AND policyname = 'Users can update own journal entries'
  ) THEN
    CREATE POLICY "Users can update own journal entries" 
      ON public.journal_entries 
      FOR UPDATE 
      TO public
      USING (auth.uid() = user_id);
  END IF;
  
  -- Users can view own journal entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'journal_entries' AND policyname = 'Users can view own journal entries'
  ) THEN
    CREATE POLICY "Users can view own journal entries" 
      ON public.journal_entries 
      FOR SELECT 
      TO public
      USING (auth.uid() = user_id);
  END IF;
  
  -- Users can delete own journal entries
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'journal_entries' AND policyname = 'Users can delete own journal entries'
  ) THEN
    CREATE POLICY "Users can delete own journal entries" 
      ON public.journal_entries 
      FOR DELETE 
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create policies for stress_readings (only if they don't already exist)
DO $$ 
BEGIN
  -- Users can insert own stress readings
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'stress_readings' AND policyname = 'Users can insert own stress readings'
  ) THEN
    CREATE POLICY "Users can insert own stress readings" 
      ON public.stress_readings 
      FOR INSERT 
      TO public
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  -- Users can view own stress readings
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'stress_readings' AND policyname = 'Users can view own stress readings'
  ) THEN
    CREATE POLICY "Users can view own stress readings" 
      ON public.stress_readings 
      FOR SELECT 
      TO public
      USING (auth.uid() = user_id);
  END IF;
END $$;