/*
  # Create Demo Users

  1. Demo Users Setup
    - Creates three demo user accounts (patient, doctor, nurse)
    - Sets up corresponding profiles with appropriate roles
    - Uses Supabase's auth.users table and profiles table

  2. Security
    - Uses secure password hashing
    - Maintains RLS policies
    - Creates proper profile relationships

  3. Demo Accounts
    - patient@healthwise.com (Patient role)
    - doctor@healthwise.com (Doctor role) 
    - nurse@healthwise.com (Nurse role)
    - All with password: demo123
*/

-- First, let's create a function to safely create demo users
CREATE OR REPLACE FUNCTION create_demo_user(
  user_email text,
  user_password text,
  user_role user_role,
  first_name text,
  last_name text
) RETURNS uuid AS $$
DECLARE
  user_id uuid;
  encrypted_password text;
BEGIN
  -- Generate a new UUID for the user
  user_id := gen_random_uuid();
  
  -- Create encrypted password (this is a simplified approach)
  -- In production, Supabase handles this automatically
  encrypted_password := crypt(user_password, gen_salt('bf'));
  
  -- Insert into auth.users (this simulates what Supabase auth does)
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    user_id,
    '00000000-0000-0000-0000-000000000000',
    user_email,
    encrypted_password,
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) ON CONFLICT (email) DO NOTHING;
  
  -- Insert corresponding profile
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    user_email,
    first_name,
    last_name,
    user_role,
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = now();
    
  RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create demo users
DO $$
DECLARE
  patient_id uuid;
  doctor_id uuid;
  nurse_id uuid;
BEGIN
  -- Create patient user
  patient_id := create_demo_user(
    'patient@healthwise.com',
    'demo123',
    'patient',
    'John',
    'Patient'
  );
  
  -- Create doctor user  
  doctor_id := create_demo_user(
    'doctor@healthwise.com',
    'demo123',
    'doctor',
    'Dr. Sarah',
    'Wilson'
  );
  
  -- Create nurse user
  nurse_id := create_demo_user(
    'nurse@healthwise.com', 
    'demo123',
    'nurse',
    'Emily',
    'Johnson'
  );
  
  -- Update doctor profile with additional info
  UPDATE profiles SET
    bio = 'Experienced family physician with over 10 years of practice.',
    specialties = ARRAY['Family Medicine', 'Internal Medicine'],
    languages = ARRAY['en', 'es']
  WHERE id = doctor_id;
  
  -- Update nurse profile with additional info
  UPDATE profiles SET
    bio = 'Registered nurse specializing in patient care and health monitoring.',
    specialties = ARRAY['Patient Care', 'Health Monitoring'],
    languages = ARRAY['en']
  WHERE id = nurse_id;
  
  -- Update patient profile with sample data
  UPDATE profiles SET
    date_of_birth = '1985-06-15',
    phone = '+1-555-0123',
    address = jsonb_build_object(
      'street', '123 Main St',
      'city', 'Anytown',
      'state', 'CA',
      'zip', '12345',
      'country', 'USA'
    ),
    emergency_contact = jsonb_build_object(
      'name', 'Jane Patient',
      'relationship', 'Spouse',
      'phone', '+1-555-0124'
    ),
    medical_info = jsonb_build_object(
      'allergies', ARRAY['Penicillin'],
      'bloodType', 'O+',
      'chronicConditions', ARRAY[]::text[]
    )
  WHERE id = patient_id;
  
  RAISE NOTICE 'Demo users created successfully:';
  RAISE NOTICE 'Patient ID: %', patient_id;
  RAISE NOTICE 'Doctor ID: %', doctor_id;
  RAISE NOTICE 'Nurse ID: %', nurse_id;
END $$;

-- Clean up the helper function
DROP FUNCTION IF EXISTS create_demo_user(text, text, user_role, text, text);

-- Verify the users were created
DO $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count 
  FROM profiles 
  WHERE email IN ('patient@healthwise.com', 'doctor@healthwise.com', 'nurse@healthwise.com');
  
  IF user_count = 3 THEN
    RAISE NOTICE 'All 3 demo users verified in profiles table';
  ELSE
    RAISE WARNING 'Only % demo users found in profiles table', user_count;
  END IF;
END $$;