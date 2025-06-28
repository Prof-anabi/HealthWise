export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          phone: string | null
          avatar_url: string | null
          role: 'patient' | 'doctor' | 'nurse' | 'admin'
          bio: string | null
          specialties: string[] | null
          languages: string[]
          emergency_contact: Json | null
          address: Json | null
          insurance_info: Json | null
          medical_info: Json | null
          preferences: Json
          two_factor_enabled: boolean
          biometric_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'patient' | 'doctor' | 'nurse' | 'admin'
          bio?: string | null
          specialties?: string[] | null
          languages?: string[]
          emergency_contact?: Json | null
          address?: Json | null
          insurance_info?: Json | null
          medical_info?: Json | null
          preferences?: Json
          two_factor_enabled?: boolean
          biometric_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'patient' | 'doctor' | 'nurse' | 'admin'
          bio?: string | null
          specialties?: string[] | null
          languages?: string[]
          emergency_contact?: Json | null
          address?: Json | null
          insurance_info?: Json | null
          medical_info?: Json | null
          preferences?: Json
          two_factor_enabled?: boolean
          biometric_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          subject: string
          category: string
          is_archived: boolean
          is_starred: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subject: string
          category?: string
          is_archived?: boolean
          is_starred?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subject?: string
          category?: string
          is_archived?: boolean
          is_starred?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          joined_at: string
          last_read_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          joined_at?: string
          last_read_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          joined_at?: string
          last_read_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          message_type: string
          priority: 'normal' | 'high' | 'urgent'
          attachments: Json
          is_edited: boolean
          edited_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          message_type?: string
          priority?: 'normal' | 'high' | 'urgent'
          attachments?: Json
          is_edited?: boolean
          edited_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          message_type?: string
          priority?: 'normal' | 'high' | 'urgent'
          attachments?: Json
          is_edited?: boolean
          edited_at?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          nurse_id: string | null
          appointment_date: string
          appointment_time: string
          duration_minutes: number
          appointment_type: 'consultation' | 'follow_up' | 'procedure' | 'test' | 'emergency'
          status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          location: Json | null
          notes: string | null
          reminders: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          nurse_id?: string | null
          appointment_date: string
          appointment_time: string
          duration_minutes?: number
          appointment_type: 'consultation' | 'follow_up' | 'procedure' | 'test' | 'emergency'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          location?: Json | null
          notes?: string | null
          reminders?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          nurse_id?: string | null
          appointment_date?: string
          appointment_time?: string
          duration_minutes?: number
          appointment_type?: 'consultation' | 'follow_up' | 'procedure' | 'test' | 'emergency'
          status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
          location?: Json | null
          notes?: string | null
          reminders?: Json
          created_at?: string
          updated_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          patient_id: string
          ordering_physician_id: string | null
          test_name: string
          test_type: string
          test_date: string
          values: Json
          interpretation: Json | null
          status: string
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          ordering_physician_id?: string | null
          test_name: string
          test_type: string
          test_date: string
          values: Json
          interpretation?: Json | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          ordering_physician_id?: string | null
          test_name?: string
          test_type?: string
          test_date?: string
          values?: Json
          interpretation?: Json | null
          status?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      vital_signs: {
        Row: {
          id: string
          patient_id: string
          recorded_by: string | null
          measurement_date: string
          temperature: number | null
          blood_pressure_systolic: number | null
          blood_pressure_diastolic: number | null
          heart_rate: number | null
          respiratory_rate: number | null
          oxygen_saturation: number | null
          weight: number | null
          height: number | null
          pain_scale: number | null
          notes: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          recorded_by?: string | null
          measurement_date?: string
          temperature?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          heart_rate?: number | null
          respiratory_rate?: number | null
          oxygen_saturation?: number | null
          weight?: number | null
          height?: number | null
          pain_scale?: number | null
          notes?: string | null
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          recorded_by?: string | null
          measurement_date?: string
          temperature?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          heart_rate?: number | null
          respiratory_rate?: number | null
          oxygen_saturation?: number | null
          weight?: number | null
          height?: number | null
          pain_scale?: number | null
          notes?: string | null
          source?: string
          created_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          patient_id: string
          prescribed_by: string | null
          medication_name: string
          dosage: string
          frequency: string
          route: string
          start_date: string
          end_date: string | null
          instructions: string | null
          side_effects: string[] | null
          is_active: boolean
          reminders: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          prescribed_by?: string | null
          medication_name: string
          dosage: string
          frequency: string
          route?: string
          start_date: string
          end_date?: string | null
          instructions?: string | null
          side_effects?: string[] | null
          is_active?: boolean
          reminders?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          prescribed_by?: string | null
          medication_name?: string
          dosage?: string
          frequency?: string
          route?: string
          start_date?: string
          end_date?: string | null
          instructions?: string | null
          side_effects?: string[] | null
          is_active?: boolean
          reminders?: Json
          created_at?: string
          updated_at?: string
        }
      }
      medication_administrations: {
        Row: {
          id: string
          medication_id: string
          administered_by: string | null
          scheduled_time: string
          actual_time: string | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medication_id: string
          administered_by?: string | null
          scheduled_time: string
          actual_time?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medication_id?: string
          administered_by?: string | null
          scheduled_time?: string
          actual_time?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      symptoms: {
        Row: {
          id: string
          patient_id: string
          symptom_name: string
          severity: number
          onset_date: string
          duration: string | null
          triggers: string[] | null
          associated_symptoms: string[] | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          symptom_name: string
          severity: number
          onset_date: string
          duration?: string | null
          triggers?: string[] | null
          associated_symptoms?: string[] | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          symptom_name?: string
          severity?: number
          onset_date?: string
          duration?: string | null
          triggers?: string[] | null
          associated_symptoms?: string[] | null
          notes?: string | null
          created_at?: string
        }
      }
      medical_conditions: {
        Row: {
          id: string
          patient_id: string
          condition_name: string
          condition_type: string
          severity: string | null
          diagnosed_date: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          condition_name: string
          condition_type?: string
          severity?: string | null
          diagnosed_date?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          condition_name?: string
          condition_type?: string
          severity?: string | null
          diagnosed_date?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_metrics: {
        Row: {
          id: string
          patient_id: string
          metric_type: string
          value: Json
          unit: string | null
          measurement_date: string
          notes: string | null
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          metric_type: string
          value: Json
          unit?: string | null
          measurement_date?: string
          notes?: string | null
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          metric_type?: string
          value?: Json
          unit?: string | null
          measurement_date?: string
          notes?: string | null
          source?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          notification_type: 'appointment' | 'message' | 'test_result' | 'medication' | 'system'
          priority: 'normal' | 'high' | 'urgent'
          is_read: boolean
          action_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          notification_type: 'appointment' | 'message' | 'test_result' | 'medication' | 'system'
          priority?: 'normal' | 'high' | 'urgent'
          is_read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          notification_type?: 'appointment' | 'message' | 'test_result' | 'medication' | 'system'
          priority?: 'normal' | 'high' | 'urgent'
          is_read?: boolean
          action_url?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      care_tasks: {
        Row: {
          id: string
          patient_id: string
          assigned_to: string | null
          created_by: string | null
          task_type: string
          description: string
          priority: string
          due_time: string | null
          completed_at: string | null
          completed_by: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          assigned_to?: string | null
          created_by?: string | null
          task_type: string
          description: string
          priority?: string
          due_time?: string | null
          completed_at?: string | null
          completed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          assigned_to?: string | null
          created_by?: string | null
          task_type?: string
          description?: string
          priority?: string
          due_time?: string | null
          completed_at?: string | null
          completed_by?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'patient' | 'doctor' | 'nurse' | 'admin'
      appointment_status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
      appointment_type: 'consultation' | 'follow_up' | 'procedure' | 'test' | 'emergency'
      message_priority: 'normal' | 'high' | 'urgent'
      test_status: 'normal' | 'high' | 'low' | 'critical'
      notification_type: 'appointment' | 'message' | 'test_result' | 'medication' | 'system'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}