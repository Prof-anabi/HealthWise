/*
  # Create Demo User Accounts

  1. Demo Users Setup
    - Creates demo user profiles for patient, doctor, and nurse roles
    - Sets up authentication credentials for demo accounts
    - Ensures proper role assignments and basic profile data

  2. Security
    - Uses existing RLS policies
    - Demo accounts follow same security model as regular users

  3. Demo Credentials
    - Patient: patient@healthwise.com / demo123
    - Doctor: doctor@healthwise.com / demo123  
    - Nurse: nurse@healthwise.com / demo123
*/

-- Insert demo user profiles
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
) VALUES 
-- Patient Demo User
(
  '11111111-1111-1111-1111-111111111111',
  'patient@healthwise.com',
  'John',
  'Doe',
  'patient',
  '1985-06-15',
  '+1-555-0123',
  'Demo patient account for testing the HealthWise platform.',
  NULL,
  ARRAY['en'],
  '{
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
  }'::jsonb,
  now(),
  now()
),
-- Doctor Demo User
(
  '22222222-2222-2222-2222-222222222222',
  'doctor@healthwise.com',
  'Dr. Sarah',
  'Johnson',
  'doctor',
  '1978-03-22',
  '+1-555-0456',
  'Board-certified family medicine physician with 15+ years of experience.',
  ARRAY['Family Medicine', 'Preventive Care', 'Chronic Disease Management'],
  ARRAY['en', 'es'],
  '{
    "privacy": {
      "shareForResearch": true,
      "shareWithProviders": true,
      "marketingCommunications": false
    },
    "notifications": {
      "sms": true,
      "push": true,
      "email": true
    }
  }'::jsonb,
  now(),
  now()
),
-- Nurse Demo User
(
  '33333333-3333-3333-3333-333333333333',
  'nurse@healthwise.com',
  'Maria',
  'Rodriguez',
  'nurse',
  '1982-11-08',
  '+1-555-0789',
  'Registered nurse specializing in patient care coordination and health education.',
  ARRAY['Patient Care', 'Health Education', 'Medication Management'],
  ARRAY['en', 'es'],
  '{
    "privacy": {
      "shareForResearch": true,
      "shareWithProviders": true,
      "marketingCommunications": false
    },
    "notifications": {
      "sms": true,
      "push": true,
      "email": true
    }
  }'::jsonb,
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Note: The actual user authentication records need to be created through Supabase Auth
-- This can be done via the Supabase dashboard or using the management API
-- The profiles above will be linked to auth users with matching IDs

-- Create some sample data for the demo accounts

-- Sample appointments for the patient
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
  'consultation',
  'scheduled',
  'Annual check-up and health assessment'
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE + INTERVAL '10 days',
  '14:30:00',
  45,
  'follow_up',
  'scheduled',
  'Follow-up on recent test results'
)
ON CONFLICT DO NOTHING;

-- Sample vital signs for the patient
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
  175.5,
  70.2,
  'Normal vital signs during routine check'
),
(
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  now() - INTERVAL '7 days',
  98.4,
  118,
  78,
  68,
  15,
  99,
  175.3,
  70.0,
  'Excellent vital signs'
)
ON CONFLICT DO NOTHING;

-- Sample medications for the patient
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
  '1000 IU',
  'Once daily',
  'oral',
  CURRENT_DATE - INTERVAL '60 days',
  'Take with meals for better absorption',
  true
)
ON CONFLICT DO NOTHING;

-- Sample test results for the patient
INSERT INTO test_results (
  patient_id,
  ordering_physician_id,
  test_name,
  test_type,
  test_date,
  values,
  interpretation,
  status,
  reviewed_by,
  reviewed_at
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Complete Blood Count (CBC)',
  'blood_work',
  CURRENT_DATE - INTERVAL '5 days',
  '{
    "hemoglobin": {"value": 14.2, "unit": "g/dL", "reference": "12.0-15.5"},
    "hematocrit": {"value": 42.1, "unit": "%", "reference": "36-46"},
    "white_blood_cells": {"value": 6.8, "unit": "K/uL", "reference": "4.5-11.0"},
    "platelets": {"value": 285, "unit": "K/uL", "reference": "150-450"}
  }'::jsonb,
  '{
    "overall": "normal",
    "notes": "All values within normal limits. No signs of anemia or infection."
  }'::jsonb,
  'completed',
  '22222222-2222-2222-2222-222222222222',
  now() - INTERVAL '4 days'
),
(
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Lipid Panel',
  'blood_work',
  CURRENT_DATE - INTERVAL '5 days',
  '{
    "total_cholesterol": {"value": 185, "unit": "mg/dL", "reference": "<200"},
    "ldl_cholesterol": {"value": 110, "unit": "mg/dL", "reference": "<100"},
    "hdl_cholesterol": {"value": 55, "unit": "mg/dL", "reference": ">40"},
    "triglycerides": {"value": 98, "unit": "mg/dL", "reference": "<150"}
  }'::jsonb,
  '{
    "overall": "borderline",
    "notes": "LDL slightly elevated. Recommend dietary modifications and follow-up in 3 months."
  }'::jsonb,
  'completed',
  '22222222-2222-2222-2222-222222222222',
  now() - INTERVAL '4 days'
)
ON CONFLICT DO NOTHING;

-- Sample notifications for all demo users
INSERT INTO notifications (
  user_id,
  title,
  message,
  notification_type,
  priority,
  is_read,
  action_url,
  metadata
) VALUES 
-- Patient notifications
(
  '11111111-1111-1111-1111-111111111111',
  'Upcoming Appointment',
  'You have an appointment with Dr. Johnson in 3 days at 10:00 AM',
  'appointment',
  'normal',
  false,
  '/appointments',
  '{"appointment_id": "upcoming"}'::jsonb
),
(
  '11111111-1111-1111-1111-111111111111',
  'Test Results Available',
  'Your recent blood work results are now available for review',
  'test_result',
  'normal',
  false,
  '/test-results',
  '{"test_id": "recent"}'::jsonb
),
-- Doctor notifications
(
  '22222222-2222-2222-2222-222222222222',
  'Patient Check-in',
  'John Doe has checked in for his 10:00 AM appointment',
  'appointment',
  'normal',
  false,
  '/appointments',
  '{"patient_id": "11111111-1111-1111-1111-111111111111"}'::jsonb
),
(
  '22222222-2222-2222-2222-222222222222',
  'Lab Results Review',
  'New lab results require your review for John Doe',
  'test_result',
  'high',
  false,
  '/test-results',
  '{"patient_id": "11111111-1111-1111-1111-111111111111"}'::jsonb
),
-- Nurse notifications
(
  '33333333-3333-3333-3333-333333333333',
  'Medication Due',
  'Patient John Doe is due for medication administration',
  'medication',
  'high',
  false,
  '/medications',
  '{"patient_id": "11111111-1111-1111-1111-111111111111"}'::jsonb
),
(
  '33333333-3333-3333-3333-333333333333',
  'Vital Signs Reminder',
  'Scheduled vital signs check for Room 205',
  'system',
  'normal',
  false,
  '/vital-signs',
  '{"room": "205"}'::jsonb
)
ON CONFLICT DO NOTHING;