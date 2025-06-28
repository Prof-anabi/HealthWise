import { supabase, handleSupabaseError } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type VitalSigns = Database['public']['Tables']['vital_signs']['Row'];
type VitalSignsInsert = Database['public']['Tables']['vital_signs']['Insert'];
type TestResult = Database['public']['Tables']['test_results']['Row'];
type TestResultInsert = Database['public']['Tables']['test_results']['Insert'];
type Medication = Database['public']['Tables']['medications']['Row'];
type MedicationInsert = Database['public']['Tables']['medications']['Insert'];
type Symptom = Database['public']['Tables']['symptoms']['Row'];
type SymptomInsert = Database['public']['Tables']['symptoms']['Insert'];
type HealthMetric = Database['public']['Tables']['health_metrics']['Row'];
type HealthMetricInsert = Database['public']['Tables']['health_metrics']['Insert'];

export class HealthDataService {
  // Vital Signs
  static async getVitalSigns(patientId: string, limit: number = 50): Promise<VitalSigns[]> {
    try {
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('measurement_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  static async recordVitalSigns(vitalData: VitalSignsInsert): Promise<VitalSigns | null> {
    try {
      const { data, error } = await supabase
        .from('vital_signs')
        .insert(vitalData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Test Results
  static async getTestResults(patientId: string): Promise<TestResult[]> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          *,
          ordering_physician:profiles!test_results_ordering_physician_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('patient_id', patientId)
        .order('test_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  static async createTestResult(testData: TestResultInsert): Promise<TestResult | null> {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert(testData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Medications
  static async getMedications(patientId: string): Promise<Medication[]> {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select(`
          *,
          prescribed_by:profiles!medications_prescribed_by_fkey (
            first_name,
            last_name
          )
        `)
        .eq('patient_id', patientId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  static async addMedication(medicationData: MedicationInsert): Promise<Medication | null> {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert(medicationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  static async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication | null> {
    try {
      const { data, error } = await supabase
        .from('medications')
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

  // Symptoms
  static async getSymptoms(patientId: string): Promise<Symptom[]> {
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .select('*')
        .eq('patient_id', patientId)
        .order('onset_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  static async logSymptom(symptomData: SymptomInsert): Promise<Symptom | null> {
    try {
      const { data, error } = await supabase
        .from('symptoms')
        .insert(symptomData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }

  // Health Metrics
  static async getHealthMetrics(patientId: string, metricType?: string): Promise<HealthMetric[]> {
    try {
      let query = supabase
        .from('health_metrics')
        .select('*')
        .eq('patient_id', patientId);

      if (metricType) {
        query = query.eq('metric_type', metricType);
      }

      const { data, error } = await query.order('measurement_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error);
      return [];
    }
  }

  static async recordHealthMetric(metricData: HealthMetricInsert): Promise<HealthMetric | null> {
    try {
      const { data, error } = await supabase
        .from('health_metrics')
        .insert(metricData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }
}