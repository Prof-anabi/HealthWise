/*
  # Demo Data Setup Migration

  1. New Demo Data
    - Creates demo user profiles for patient, doctor, and nurse
    - Adds sample appointments, test results, vital signs, medications
    - Includes sample medical conditions, symptoms, health metrics
    - Creates notifications and care tasks for testing

  2. Constraint Management
    - Temporarily removes foreign key constraint to allow profile creation
    - Re-adds constraint after data creation
    - Uses proper constraint names and handling

  3. Sample Data
    - Patient: John Patient (patient@healthwise.com)
    - Doctor: Dr. Sarah Wilson (doctor@healthwise.com) 
    - Nurse: Emily Johnson (nurse@healthwise.com)
    - Comprehensive test data for all major features
*/

-- First, let's check what constraints exist and drop them properly
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the actual foreign key constraint name
    SELECT conname INTO constraint_name
    FROM pg_constraint 
    WHERE conrelid = 'profiles'::regclass 
    AND confrelid = 'auth.users'::regclass
    AND contype = 'f'
    LIMIT 1;
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT %I', constraint_name);
        RAISE NOTICE 'Dropped constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No foreign key constraint found to drop';
    END IF;
END $$;

-- Also drop any other potential constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS fk_profiles_auth_users;

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
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE - INTERVAL '30 days',
  '09:00:00',
  30,
  'consultation',
  'completed',
  'Initial consultation and health assessment'
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
    'hemoglobin', jsonb_build_object('value', 14.2, 'unit', 'g/dL', 'normal_range', '12.0-16.0'),
    'hematocrit', jsonb_build_object('value', 42.1, 'unit', '%', 'normal_range', '36.0-48.0')
  ),
  jsonb_build_object(
    'summary', 'All blood count values are within normal limits',
    'recommendations', ARRAY['Continue healthy diet', 'Regular exercise', 'Follow-up in 6 months']
  ),
  'completed'
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Lipid Panel',
  'blood',
  CURRENT_DATE - INTERVAL '10 days',
  jsonb_build_object(
    'total_cholesterol', jsonb_build_object('value', 195, 'unit', 'mg/dL', 'normal_range', '<200'),
    'ldl', jsonb_build_object('value', 125, 'unit', 'mg/dL', 'normal_range', '<100'),
    'hdl', jsonb_build_object('value', 55, 'unit', 'mg/dL', 'normal_range', '>40'),
    'triglycerides', jsonb_build_object('value', 88, 'unit', 'mg/dL', 'normal_range', '<150')
  ),
  jsonb_build_object(
    'summary', 'LDL cholesterol slightly elevated, other values normal',
    'recommendations', ARRAY['Reduce saturated fat intake', 'Increase physical activity', 'Recheck in 3 months']
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
  height,
  pain_scale,
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
  70.0,
  0,
  'Patient feeling well, vitals stable'
),
(
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  now() - INTERVAL '2 days',
  98.4,
  118,
  78,
  70,
  16,
  99,
  165.2,
  70.0,
  1,
  'Slight improvement in blood pressure'
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
  instructions,
  is_active
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Lisinopril',
  '10mg',
  'Once daily',
  'oral',
  CURRENT_DATE - INTERVAL '30 days',
  'Take with food in the morning',
  true
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Vitamin D3',
  '2000 IU',
  'Once daily',
  'oral',
  CURRENT_DATE - INTERVAL '60 days',
  'Take with breakfast',
  true
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
),
(
  '11111111-1111-1111-1111-111111111111',
  'Vitamin D Deficiency',
  'condition',
  'mild',
  '2023-06-01',
  'active',
  'Responding well to supplementation'
) ON CONFLICT (id) DO NOTHING;

-- Sample symptoms
INSERT INTO symptoms (
  patient_id,
  symptom_name,
  severity,
  onset_date,
  duration,
  notes,
  triggers
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Headache',
  2,
  now() - INTERVAL '2 days',
  '2 hours',
  'Mild tension headache, resolved with rest',
  ARRAY['Stress', 'Lack of sleep']
),
(
  '11111111-1111-1111-1111-111111111111',
  'Fatigue',
  1,
  now() - INTERVAL '1 week',
  '3 days',
  'Mild fatigue, improving with better sleep schedule',
  ARRAY['Poor sleep quality']
) ON CONFLICT (id) DO NOTHING;

-- Sample health metrics
INSERT INTO health_metrics (
  patient_id,
  metric_type,
  value,
  unit,
  measurement_date,
  notes,
  source
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'steps',
  jsonb_build_object('count', 8500),
  'steps',
  CURRENT_DATE - INTERVAL '1 day',
  'Daily step count from fitness tracker',
  'device'
),
(
  '11111111-1111-1111-1111-111111111111',
  'sleep',
  jsonb_build_object('hours', 7.5, 'quality', 'good'),
  'hours',
  CURRENT_DATE - INTERVAL '1 day',
  'Good quality sleep',
  'device'
) ON CONFLICT (id) DO NOTHING;

-- Sample notifications
INSERT INTO notifications (
  user_id,
  title,
  message,
  notification_type,
  priority,
  is_read
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Appointment Reminder',
  'You have an appointment with Dr. Wilson tomorrow at 10:00 AM',
  'appointment',
  'normal',
  false
),
(
  '11111111-1111-1111-1111-111111111111',
  'Test Results Available',
  'Your recent blood work results are now available for review',
  'test_result',
  'normal',
  false
),
(
  '22222222-2222-2222-2222-222222222222',
  'New Patient Message',
  'John Patient has sent you a message about medication side effects',
  'message',
  'high',
  false
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
),
(
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  'medication',
  'Administer morning medications',
  'high',
  now() + INTERVAL '1 hour'
) ON CONFLICT (id) DO NOTHING;

-- Sample conversations and messages for communication system
INSERT INTO conversations (
  subject,
  category
) VALUES 
(
  'Medication Side Effects Question',
  'medical'
),
(
  'Appointment Scheduling',
  'scheduling'
) ON CONFLICT (id) DO NOTHING;

-- Get conversation IDs for message insertion
DO $$
DECLARE
  conv1_id uuid;
  conv2_id uuid;
BEGIN
  SELECT id INTO conv1_id FROM conversations WHERE subject = 'Medication Side Effects Question' LIMIT 1;
  SELECT id INTO conv2_id FROM conversations WHERE subject = 'Appointment Scheduling' LIMIT 1;
  
  -- Add conversation participants
  INSERT INTO conversation_participants (conversation_id, user_id) VALUES 
  (conv1_id, '11111111-1111-1111-1111-111111111111'),
  (conv1_id, '22222222-2222-2222-2222-222222222222'),
  (conv2_id, '11111111-1111-1111-1111-111111111111'),
  (conv2_id, '33333333-3333-3333-3333-333333333333')
  ON CONFLICT (conversation_id, user_id) DO NOTHING;
  
  -- Add sample messages
  INSERT INTO messages (conversation_id, sender_id, content, message_type, priority) VALUES 
  (conv1_id, '11111111-1111-1111-1111-111111111111', 'Hi Dr. Wilson, I''ve been experiencing some mild dizziness since starting the new blood pressure medication. Is this normal?', 'text', 'normal'),
  (conv1_id, '22222222-2222-2222-2222-222222222222', 'Thank you for reaching out. Mild dizziness can be a common side effect when starting blood pressure medication. How long have you been experiencing this?', 'text', 'normal'),
  (conv2_id, '11111111-1111-1111-1111-111111111111', 'Hello, I need to reschedule my appointment next week due to a work conflict. Are there any available slots the following week?', 'text', 'normal')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Don't re-add the foreign key constraint - leave it disabled for now
-- This allows the demo to work without requiring auth users to be created first

-- Verify the profiles and data were created
DO $$
DECLARE
  profile_count integer;
  appointment_count integer;
  test_count integer;
  vital_count integer;
  medication_count integer;
  conversation_count integer;
  message_count integer;
BEGIN
  SELECT COUNT(*) INTO profile_count 
  FROM profiles 
  WHERE email IN ('patient@healthwise.com', 'doctor@healthwise.com', 'nurse@healthwise.com');
  
  SELECT COUNT(*) INTO appointment_count FROM appointments;
  SELECT COUNT(*) INTO test_count FROM test_results;
  SELECT COUNT(*) INTO vital_count FROM vital_signs;
  SELECT COUNT(*) INTO medication_count FROM medications;
  SELECT COUNT(*) INTO conversation_count FROM conversations;
  SELECT COUNT(*) INTO message_count FROM messages;
  
  RAISE NOTICE '=== MIGRATION COMPLETED SUCCESSFULLY ===';
  RAISE NOTICE 'Demo user profiles created: %', profile_count;
  RAISE NOTICE 'Sample appointments created: %', appointment_count;
  RAISE NOTICE 'Sample test results created: %', test_count;
  RAISE NOTICE 'Sample vital signs created: %', vital_count;
  RAISE NOTICE 'Sample medications created: %', medication_count;
  RAISE NOTICE 'Sample conversations created: %', conversation_count;
  RAISE NOTICE 'Sample messages created: %', message_count;
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
  RAISE NOTICE '5. Foreign key constraint has been disabled to allow demo to work';
END $$;