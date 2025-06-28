/*
  # Create profiles table and setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `phone` (text)
      - `avatar_url` (text)
      - `role` (user_role enum)
      - `bio` (text)
      - `specialties` (text array)
      - `languages` (text array)
      - `emergency_contact` (jsonb)
      - `address` (jsonb)
      - `insurance_info` (jsonb)
      - `medical_info` (jsonb)
      - `preferences` (jsonb)
      - `two_factor_enabled` (boolean)
      - `biometric_enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policies for users to read/update their own profiles
    - Add policies for healthcare providers to read patient profiles

  3. Demo Data
    - Insert demo user profiles for testing
*/

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  phone text,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'patient',
  bio text,
  specialties text[],
  languages text[] DEFAULT ARRAY['en'],
  emergency_contact jsonb,
  address jsonb,
  insurance_info jsonb,
  medical_info jsonb,
  preferences jsonb DEFAULT '{
    "privacy": {
      "shareForResearch": false,
      "shareWithProviders": true,
      "marketingCommunications": false
    },
    "notifications": {
      "sms": true,
      "push": true,
      "email": true
    }
  }',
  two_factor_enabled boolean DEFAULT false,
  biometric_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY IF NOT EXISTS "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Healthcare providers can read patient profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert demo profiles (only if they don't exist)
INSERT INTO profiles (id, email, first_name, last_name, role, bio, specialties, languages)
VALUES 
  (
    'db888dc4-a9e3-40b6-a82f-bf88aca19922',
    'patient@healthwise.com',
    'John',
    'Patient',
    'patient',
    'Demo patient account for testing',
    NULL,
    ARRAY['en']
  ),
  (
    'doctor-demo-id-1234567890',
    'doctor@healthwise.com',
    'Sarah',
    'Johnson',
    'doctor',
    'Board-certified internal medicine physician',
    ARRAY['Internal Medicine', 'Primary Care'],
    ARRAY['en', 'es']
  ),
  (
    'nurse-demo-id-1234567890',
    'nurse@healthwise.com',
    'Emily',
    'Rodriguez',
    'nurse',
    'Registered nurse with 10+ years experience',
    ARRAY['Critical Care', 'Emergency Medicine'],
    ARRAY['en', 'es']
  )
ON CONFLICT (id) DO NOTHING;