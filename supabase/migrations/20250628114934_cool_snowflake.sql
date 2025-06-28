/*
  # Fix profiles table with correct user IDs
  
  1. Tables
    - Create profiles table with proper structure
    - Add correct demo user profiles with real IDs
  
  2. Security
    - Enable RLS on profiles table
    - Add policies that don't cause infinite recursion
    - Allow authenticated users basic access
  
  3. Data
    - Insert demo profiles with correct IDs:
      - Patient: db888dc4-a9e3-40b6-a82f-bf88aca19922
      - Doctor: 1bf8b111-f4ab-4f82-8b38-b0ed5d78b1f5
      - Nurse: dad1458f-c206-480a-a1c4-7e1299ae1632
*/

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
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
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create simple policies that don't cause recursion
CREATE POLICY "profiles_select_policy"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_update_policy"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert demo profiles with correct IDs
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
    '1bf8b111-f4ab-4f82-8b38-b0ed5d78b1f5',
    'doctor@healthwise.com',
    'Sarah',
    'Johnson',
    'doctor',
    'Board-certified internal medicine physician',
    ARRAY['Internal Medicine', 'Primary Care'],
    ARRAY['en', 'es']
  ),
  (
    'dad1458f-c206-480a-a1c4-7e1299ae1632',
    'nurse@healthwise.com',
    'Emily',
    'Rodriguez',
    'nurse',
    'Registered nurse with 10+ years experience',
    ARRAY['Critical Care', 'Emergency Medicine'],
    ARRAY['en', 'es']
  );