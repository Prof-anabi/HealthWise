import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export interface AppointmentWithDetails extends Appointment {
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  doctor: {
    id: string;
    first_name: string;
    last_name: string;
    specialties?: string[];
    avatar_url?: string;
  };
  nurse?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export class AppointmentService {
  // Get appointments for a user
  static async getAppointments(userId: string, userRole: string): Promise<AppointmentWithDetails[]> {
    try {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          patient:profiles!appointments_patient_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          doctor:profiles!appointments_doctor_id_fkey (
            id,
            first_name,
            last_name,
            specialties,
            avatar_url
          ),
          nurse:profiles!appointments_nurse_id_fkey (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `);

      // Filter based on user role
      if (userRole === 'patient') {
        query = query.eq('patient_id', userId);
      } else if (userRole === 'doctor') {
        query = query.eq('doctor_id', userId);
      } else if (userRole === 'nurse') {
        query = query.eq('nurse_id', userId);
      }

      const { data, error } = await query.order('appointment_date', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  // Create a new appointment
  static async createAppointment(appointmentData: AppointmentInsert): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Update an appointment
  static async updateAppointment(id: string, updates: AppointmentUpdate): Promise<Appointment | null> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Cancel an appointment
  static async cancelAppointment(id: string, reason?: string): Promise<boolean> {
    try {
      const updates: AppointmentUpdate = {
        status: 'cancelled',
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
      };

      const { error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  }

  // Get available time slots for a doctor
  static async getAvailableSlots(doctorId: string, date: string): Promise<string[]> {
    try {
      // Get existing appointments for the doctor on the specified date
      const { data: existingAppointments, error } = await supabase
        .from('appointments')
        .select('appointment_time, duration_minutes')
        .eq('doctor_id', doctorId)
        .eq('appointment_date', date)
        .in('status', ['scheduled', 'confirmed']);

      if (error) throw error;

      // Generate available slots (simplified - in real app, consider doctor's schedule)
      const allSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
      ];

      const bookedSlots = existingAppointments?.map(apt => apt.appointment_time) || [];
      
      return allSlots.filter(slot => !bookedSlots.includes(slot));
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }
}