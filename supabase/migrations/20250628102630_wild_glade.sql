/*
  # Create Demo User Profiles

  1. New Records
    - Creates profile records for demo users (patient, doctor, nurse)
    - Sets up proper roles and sample data for each user type
    
  2. Sample Data
    - Patient profile with medical information
    - Doctor profile with specialties and bio
    - Nurse profile with care specialties
    
  3. Notes
    - Auth users must be created manually in Supabase dashboard
    - This migration only creates the profile records
    - UUIDs are generated for demo purposes
*/

-- Create demo user profiles with fixed UUIDs for consistency
DO $$
DECLARE
  patient_id uuid := '11111111-1111-1111-1111-111111111111';
  doctor_id uuid := '22222222-2222-2222-2222-222222222222';
  nurse_id uuid := '33333333-3333-3333-3333-333333333333';
BEGIN
  -- Insert patient profile
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    date_of_birth,
    phone,
    address,
    emergency_contact,
    medical_info,
    preferences,
    created_at,
    updated_at
  ) VALUES (
    patient_id,
    'patient@healthwise.com',
    'John',
    'Patient',
    'patient',
    '1985-06-15',
    '+1-555-0123',
    jsonb_build_object(
      'street', '123 Main St',
      'city', 'Anytown',
      'state', 'CA',
      'zip', '12345',
      'country', 'USA'
    ),
    jsonb_build_object(
      'name', 'Jane Patient',
      'relationship', 'Spouse',
      'phone', '+1-555-0124'
    ),
    jsonb_build_object(
      'allergies', ARRAY['Penicillin'],
      'bloodType', 'O+',
      'chronicConditions', ARRAY[]::text[],
      'medications', ARRAY[]::text[]
    ),
    jsonb_build_object(
      'privacy', jsonb_build_object(
        'shareForResearch', false,
        'shareWithProviders', true,
        'marketingCommunications', false
      ),
      'notifications', jsonb_build_object(
        'sms', true,
        'push', true,
        'email', true
      )
    ),
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = now();

  -- Insert doctor profile
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    date_of_birth,
    phone,
    bio,
    specialties,
    languages,
    preferences,
    created_at,
    updated_at
  ) VALUES (
    doctor_id,
    'doctor@healthwise.com',
    'Dr. Sarah',
    'Wilson',
    'doctor',
    '1975-03-20',
    '+1-555-0125',
    'Experienced family physician with over 15 years of practice. Specializes in preventive care and chronic disease management.',
    ARRAY['Family Medicine', 'Internal Medicine', 'Preventive Care'],
    ARRAY['en', 'es'],
    jsonb_build_object(
      'privacy', jsonb_build_object(
        'shareForResearch', true,
        'shareWithProviders', true,
        'marketingCommunications', false
      ),
      'notifications', jsonb_build_object(
        'sms', true,
        'push', true,
        'email', true
      )
    ),
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = now();

  -- Insert nurse profile
  INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    date_of_birth,
    phone,
    bio,
    specialties,
    languages,
    preferences,
    created_at,
    updated_at
  ) VALUES (
    nurse_id,
    'nurse@healthwise.com',
    'Emily',
    'Johnson',
    'nurse',
    '1988-09-12',
    '+1-555-0126',
    'Registered nurse with 8 years of experience in patient care, health monitoring, and medication administration.',
    ARRAY['Patient Care', 'Health Monitoring', 'Medication Administration'],
    ARRAY['en'],
    jsonb_build_object(
      'privacy', jsonb_build_object(
        'shareForResearch', false,
        'shareWithProviders', true,
        'marketingCommunications', false
      ),
      'notifications', jsonb_build_object(
        'sms', true,
        'push', true,
        'email', true
      )
    ),
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = now();

  RAISE NOTICE 'Demo user profiles created successfully:';
  RAISE NOTICE 'Patient ID: %', patient_id;
  RAISE NOTICE 'Doctor ID: %', doctor_id;
  RAISE NOTICE 'Nurse ID: %', nurse_id;
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANT: You must manually create the auth users in Supabase dashboard:';
  RAISE NOTICE '1. Go to Authentication > Users in your Supabase dashboard';
  RAISE NOTICE '2. Create user: patient@healthwise.com with password: demo123';
  RAISE NOTICE '3. Create user: doctor@healthwise.com with password: demo123';
  RAISE NOTICE '4. Create user: nurse@healthwise.com with password: demo123';
  RAISE NOTICE '5. Update each user ID to match the profile IDs above';
END $$;

-- Create some sample data for testing

-- Sample appointments
INSERT INTO appointments (
  patient_id,
  doctor_id,
  appointment_date,
  appointment_time,
  duration_minutes,
  appointment_type,
  status,
  notes
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE + INTERVAL '3 days',
  '10:00:00',
  30,
  'follow_up',
  'scheduled',
  'Regular checkup and blood pressure monitoring'
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE + INTERVAL '7 days',
  '14:30:00',
  45,
  'consultation',
  'scheduled',
  'Discuss test results and treatment plan'
) ON CONFLICT (id) DO NOTHING;

-- Sample test results
INSERT INTO test_results (
  patient_id,
  ordering_physician_id,
  test_name,
  test_type,
  test_date,
  values,
  interpretation,
  status
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Complete Blood Count',
  'blood',
  CURRENT_DATE - INTERVAL '5 days',
  jsonb_build_object(
    'wbc', jsonb_build_object('value', 7.2, 'unit', 'K/uL', 'normal_range', '4.0-10.0'),
    'rbc', jsonb_build_object('value', 4.5, 'unit', 'M/uL', 'normal_range', '4.2-5.8'),
    'hemoglobin', jsonb_build_object('value', 14.2, 'unit', 'g/dL', 'normal_range', '12.0-16.0')
  ),
  jsonb_build_object(
    'summary', 'All blood count values are within normal limits',
    'recommendations', ARRAY['Continue healthy diet', 'Regular exercise', 'Follow-up in 6 months']
  ),
  'completed'
) ON CONFLICT (id) DO NOTHING;

-- Sample vital signs
INSERT INTO vital_signs (
  patient_id,
  recorded_by,
  measurement_date,
  temperature,
  blood_pressure_systolic,
  blood_pressure_diastolic,
  heart_rate,
  respiratory_rate,
  oxygen_saturation,
  weight,
  notes
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  now() - INTERVAL '1 day',
  98.6,
  120,
  80,
  72,
  16,
  98,
  165.5,
  'Patient feeling well, vitals stable'
) ON CONFLICT (id) DO NOTHING;

-- Sample medications
INSERT INTO medications (
  patient_id,
  prescribed_by,
  medication_name,
  dosage,
  frequency,
  route,
  start_date,
  instructions
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Lisinopril',
  '10mg',
  'Once daily',
  'oral',
  CURRENT_DATE - INTERVAL '30 days',
  'Take with food in the morning'
) ON CONFLICT (id) DO NOTHING;

-- Verify the profiles were created
DO $$
DECLARE
  profile_count integer;
BEGIN
  SELECT COUNT(*) INTO profile_count 
  FROM profiles 
  WHERE email IN ('patient@healthwise.com', 'doctor@healthwise.com', 'nurse@healthwise.com');
  
  IF profile_count = 3 THEN
    RAISE NOTICE 'SUCCESS: All 3 demo user profiles verified in database';
  ELSE
    RAISE WARNING 'WARNING: Only % demo user profiles found', profile_count;
  END IF;
END $$;