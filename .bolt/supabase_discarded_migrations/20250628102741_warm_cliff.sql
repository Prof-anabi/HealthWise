/*
  # Demo Users Setup Migration

  1. Temporarily removes foreign key constraint on profiles table
  2. Creates demo user profiles with sample data
  3. Restores foreign key constraint
  4. Adds sample appointments, test results, vital signs, and medications

  Note: Auth users must still be created manually in Supabase dashboard
*/

-- Temporarily drop the foreign key constraint to allow profile creation without auth users
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

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

-- Sample medical conditions
INSERT INTO medical_conditions (
  patient_id,
  condition_name,
  condition_type,
  severity,
  diagnosed_date,
  status,
  notes
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Hypertension',
  'condition',
  'mild',
  '2023-01-15',
  'active',
  'Well controlled with medication and lifestyle changes'
) ON CONFLICT (id) DO NOTHING;

-- Sample symptoms
INSERT INTO symptoms (
  patient_id,
  symptom_name,
  severity,
  onset_date,
  duration,
  notes
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Headache',
  2,
  now() - INTERVAL '2 days',
  '2 hours',
  'Mild tension headache, resolved with rest'
) ON CONFLICT (id) DO NOTHING;

-- Sample health metrics
INSERT INTO health_metrics (
  patient_id,
  metric_type,
  value,
  unit,
  measurement_date,
  notes
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'steps',
  jsonb_build_object('count', 8500),
  'steps',
  CURRENT_DATE - INTERVAL '1 day',
  'Daily step count from fitness tracker'
) ON CONFLICT (id) DO NOTHING;

-- Sample notifications
INSERT INTO notifications (
  user_id,
  title,
  message,
  notification_type,
  priority
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Appointment Reminder',
  'You have an appointment with Dr. Wilson tomorrow at 10:00 AM',
  'appointment',
  'normal'
) ON CONFLICT (id) DO NOTHING;

-- Sample care tasks (for nurse)
INSERT INTO care_tasks (
  patient_id,
  assigned_to,
  created_by,
  task_type,
  description,
  priority,
  due_time
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'vitals',
  'Take and record vital signs',
  'medium',
  now() + INTERVAL '2 hours'
) ON CONFLICT (id) DO NOTHING;

-- Re-add the foreign key constraint (but make it deferrable to avoid issues)
ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) 
ON DELETE CASCADE 
DEFERRABLE INITIALLY DEFERRED;

-- Verify the profiles were created
DO $$
DECLARE
  profile_count integer;
  appointment_count integer;
  test_count integer;
  vital_count integer;
  medication_count integer;
BEGIN
  SELECT COUNT(*) INTO profile_count 
  FROM profiles 
  WHERE email IN ('patient@healthwise.com', 'doctor@healthwise.com', 'nurse@healthwise.com');
  
  SELECT COUNT(*) INTO appointment_count FROM appointments;
  SELECT COUNT(*) INTO test_count FROM test_results;
  SELECT COUNT(*) INTO vital_count FROM vital_signs;
  SELECT COUNT(*) INTO medication_count FROM medications;
  
  RAISE NOTICE '=== MIGRATION COMPLETED SUCCESSFULLY ===';
  RAISE NOTICE 'Demo user profiles created: %', profile_count;
  RAISE NOTICE 'Sample appointments created: %', appointment_count;
  RAISE NOTICE 'Sample test results created: %', test_count;
  RAISE NOTICE 'Sample vital signs created: %', vital_count;
  RAISE NOTICE 'Sample medications created: %', medication_count;
  RAISE NOTICE '';
  RAISE NOTICE '=== IMPORTANT: MANUAL SETUP REQUIRED ===';
  RAISE NOTICE 'You must create auth users in Supabase dashboard:';
  RAISE NOTICE '1. Go to Authentication > Users';
  RAISE NOTICE '2. Create these users with the EXACT UUIDs:';
  RAISE NOTICE '   - patient@healthwise.com (ID: 11111111-1111-1111-1111-111111111111)';
  RAISE NOTICE '   - doctor@healthwise.com (ID: 22222222-2222-2222-2222-222222222222)';
  RAISE NOTICE '   - nurse@healthwise.com (ID: 33333333-3333-3333-3333-333333333333)';
  RAISE NOTICE '3. Password for all: demo123';
  RAISE NOTICE '4. Set email_confirmed_at to current timestamp for each user';
END $$;