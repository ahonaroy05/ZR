/*
  # Initial Schema Setup

  1. New Tables
    - `users` (auth.users reference table)
    - `profiles`
      - `id` (uuid, primary key, references users.id)
      - `email` (text, unique, not null)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    - `journal_entries`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, references users.id)
      - `content` (text, not null)
      - `mood` (text, not null, check constraint for valid values)
      - `stress_level` (integer, not null, check constraint for range 0-100)
      - `tags` (text array, default empty array)
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())
    - `stress_readings`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `user_id` (uuid, references users.id)
      - `stress_level` (integer, not null, check constraint for range 0-100)
      - `location` (text, nullable)
      - `activity` (text, nullable)
      - `created_at` (timestamp with time zone, default now())
  
  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for CRUD operations
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

-- Create policies for profiles
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  TO public
  USING (auth.uid() = id);

-- Create policies for journal_entries
CREATE POLICY "Users can insert own journal entries" 
  ON public.journal_entries 
  FOR INSERT 
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" 
  ON public.journal_entries 
  FOR UPDATE 
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own journal entries" 
  ON public.journal_entries 
  FOR SELECT 
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" 
  ON public.journal_entries 
  FOR DELETE 
  TO public
  USING (auth.uid() = user_id);

-- Create policies for stress_readings
CREATE POLICY "Users can insert own stress readings" 
  ON public.stress_readings 
  FOR INSERT 
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own stress readings" 
  ON public.stress_readings 
  FOR SELECT 
  TO public
  USING (auth.uid() = user_id);