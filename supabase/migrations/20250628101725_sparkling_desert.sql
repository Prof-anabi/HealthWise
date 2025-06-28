/*
  # Healthcare Database Schema

  1. New Tables
    - `profiles` - Extended user profiles with healthcare-specific data
    - `conversations` - Message conversations between users
    - `messages` - Individual messages within conversations
    - `appointments` - Healthcare appointments
    - `test_results` - Medical test results and lab work
    - `vital_signs` - Patient vital sign measurements
    - `medications` - Patient medications and prescriptions
    - `symptoms` - Patient-reported symptoms
    - `medical_conditions` - Patient medical conditions and allergies
    - `health_metrics` - General health tracking data
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Ensure HIPAA-compliant data handling

  3. Real-time Features
    - Enable real-time subscriptions for messages
    - Real-time updates for appointments and notifications
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'admin');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE appointment_type AS ENUM ('consultation', 'follow_up', 'procedure', 'test', 'emergency');
CREATE TYPE message_priority AS ENUM ('normal', 'high', 'urgent');
CREATE TYPE test_status AS ENUM ('normal', 'high', 'low', 'critical');
CREATE TYPE notification_type AS ENUM ('appointment', 'message', 'test_result', 'medication', 'system');

-- Profiles table (extends auth.users)
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
  specialties text[], -- For doctors
  languages text[] DEFAULT ARRAY['en'],
  emergency_contact jsonb,
  address jsonb,
  insurance_info jsonb,
  medical_info jsonb,
  preferences jsonb DEFAULT '{"notifications": {"email": true, "sms": true, "push": true}, "privacy": {"shareWithProviders": true, "shareForResearch": false, "marketingCommunications": false}}',
  two_factor_enabled boolean DEFAULT false,
  biometric_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  category text DEFAULT 'general',
  is_archived boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text',
  priority message_priority DEFAULT 'normal',
  attachments jsonb DEFAULT '[]',
  is_edited boolean DEFAULT false,
  edited_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  nurse_id uuid REFERENCES profiles(id),
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes integer DEFAULT 30,
  appointment_type appointment_type NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  location jsonb,
  notes text,
  reminders jsonb DEFAULT '{"email": true, "sms": true, "push": true}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ordering_physician_id uuid REFERENCES profiles(id),
  test_name text NOT NULL,
  test_type text NOT NULL,
  test_date date NOT NULL,
  values jsonb NOT NULL,
  interpretation jsonb,
  status text DEFAULT 'completed',
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Vital signs table
CREATE TABLE IF NOT EXISTS vital_signs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recorded_by uuid REFERENCES profiles(id),
  measurement_date timestamptz DEFAULT now(),
  temperature numeric(4,1),
  blood_pressure_systolic integer,
  blood_pressure_diastolic integer,
  heart_rate integer,
  respiratory_rate integer,
  oxygen_saturation integer,
  weight numeric(5,2),
  height numeric(5,2),
  pain_scale integer CHECK (pain_scale >= 0 AND pain_scale <= 10),
  notes text,
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prescribed_by uuid REFERENCES profiles(id),
  medication_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  route text DEFAULT 'oral',
  start_date date NOT NULL,
  end_date date,
  instructions text,
  side_effects text[],
  is_active boolean DEFAULT true,
  reminders jsonb DEFAULT '{"enabled": true, "times": []}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Medication administration records
CREATE TABLE IF NOT EXISTS medication_administrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id uuid REFERENCES medications(id) ON DELETE CASCADE,
  administered_by uuid REFERENCES profiles(id),
  scheduled_time timestamptz NOT NULL,
  actual_time timestamptz,
  status text DEFAULT 'scheduled', -- scheduled, given, refused, missed
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  symptom_name text NOT NULL,
  severity integer CHECK (severity >= 1 AND severity <= 5),
  onset_date timestamptz NOT NULL,
  duration text,
  triggers text[],
  associated_symptoms text[],
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Medical conditions table
CREATE TABLE IF NOT EXISTS medical_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  condition_name text NOT NULL,
  condition_type text DEFAULT 'condition', -- condition, allergy, family_history
  severity text,
  diagnosed_date date,
  status text DEFAULT 'active', -- active, resolved, chronic
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Health metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  metric_type text NOT NULL,
  value jsonb NOT NULL,
  unit text,
  measurement_date timestamptz DEFAULT now(),
  notes text,
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  notification_type notification_type NOT NULL,
  priority message_priority DEFAULT 'normal',
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Care tasks table (for nurses)
CREATE TABLE IF NOT EXISTS care_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES profiles(id),
  created_by uuid REFERENCES profiles(id),
  task_type text NOT NULL,
  description text NOT NULL,
  priority text DEFAULT 'medium',
  due_time timestamptz,
  completed_at timestamptz,
  completed_by uuid REFERENCES profiles(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_administrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Healthcare providers can read patient profiles"
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

-- Conversations policies
CREATE POLICY "Users can read own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Conversation participants policies
CREATE POLICY "Users can read conversation participants"
  ON conversation_participants
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join conversations"
  ON conversation_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can read messages in their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_id
      AND cp.user_id = auth.uid()
    )
  );

-- Appointments policies
CREATE POLICY "Patients can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Healthcare providers can read their appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    doctor_id = auth.uid() OR
    nurse_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

CREATE POLICY "Healthcare providers can manage appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (
    doctor_id = auth.uid() OR
    nurse_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Test results policies
CREATE POLICY "Patients can read own test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Healthcare providers can read patient test results"
  ON test_results
  FOR SELECT
  TO authenticated
  USING (
    ordering_physician_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

CREATE POLICY "Healthcare providers can create test results"
  ON test_results
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Vital signs policies
CREATE POLICY "Patients can read own vital signs"
  ON vital_signs
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Healthcare providers can read patient vital signs"
  ON vital_signs
  FOR SELECT
  TO authenticated
  USING (
    recorded_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

CREATE POLICY "Healthcare providers can record vital signs"
  ON vital_signs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    recorded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Medications policies
CREATE POLICY "Patients can read own medications"
  ON medications
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Healthcare providers can read patient medications"
  ON medications
  FOR SELECT
  TO authenticated
  USING (
    prescribed_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

CREATE POLICY "Healthcare providers can prescribe medications"
  ON medications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    prescribed_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse')
    )
  );

-- Medication administration policies
CREATE POLICY "Healthcare providers can read medication administrations"
  ON medication_administrations
  FOR SELECT
  TO authenticated
  USING (
    administered_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

CREATE POLICY "Healthcare providers can record medication administrations"
  ON medication_administrations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    administered_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse')
    )
  );

-- Symptoms policies
CREATE POLICY "Patients can manage own symptoms"
  ON symptoms
  FOR ALL
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Healthcare providers can read patient symptoms"
  ON symptoms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Medical conditions policies
CREATE POLICY "Patients can read own medical conditions"
  ON medical_conditions
  FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Healthcare providers can manage patient medical conditions"
  ON medical_conditions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Health metrics policies
CREATE POLICY "Patients can manage own health metrics"
  ON health_metrics
  FOR ALL
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Healthcare providers can read patient health metrics"
  ON health_metrics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Care tasks policies
CREATE POLICY "Healthcare providers can read care tasks"
  ON care_tasks
  FOR SELECT
  TO authenticated
  USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

CREATE POLICY "Healthcare providers can manage care tasks"
  ON care_tasks
  FOR ALL
  TO authenticated
  USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('doctor', 'nurse', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_test_results_patient ON test_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_date ON vital_signs(measurement_date);
CREATE INDEX IF NOT EXISTS idx_medications_patient ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_patient ON symptoms(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_conditions_patient ON medical_conditions(patient_id);
CREATE INDEX IF NOT EXISTS idx_health_metrics_patient ON health_metrics(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_care_tasks_assigned ON care_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_care_tasks_patient ON care_tasks(patient_id);

-- Create functions for real-time updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON medications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_conditions_updated_at
  BEFORE UPDATE ON medical_conditions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_care_tasks_updated_at
  BEFORE UPDATE ON care_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();