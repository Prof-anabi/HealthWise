export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  avatar?: string;
  role: 'patient' | 'doctor' | 'nurse' | 'admin';
  preferences: {
    language: 'en' | 'es';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    privacy: {
      shareWithProviders: boolean;
      shareForResearch: boolean;
      marketingCommunications: boolean;
    };
  };
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  consentHistory: ConsentRecord[];
}

export interface ConsentRecord {
  id: string;
  type: 'privacy_policy' | 'terms_of_service' | 'data_sharing' | 'marketing';
  version: string;
  consentedAt: string;
  ipAddress: string;
}

export interface TestResult {
  id: string;
  testName: string;
  testType: 'blood' | 'urine' | 'imaging' | 'biopsy' | 'genetic';
  date: string;
  values: {
    name: string;
    value: string | number;
    unit?: string;
    normalRange?: string;
    status: 'normal' | 'high' | 'low' | 'critical';
  }[];
  interpretation: {
    summary: string;
    plainLanguage: string;
    concerns?: string[];
    recommendations?: string[];
  };
  orderingPhysician: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number; // minutes
  type: 'consultation' | 'follow-up' | 'procedure' | 'test';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  location: {
    type: 'office' | 'telehealth' | 'hospital';
    address?: string;
    room?: string;
    meetingLink?: string;
  };
  notes?: string;
  reminders: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  subSpecialties: string[];
  languages: string[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  reviewCount: number;
  acceptedInsurance: string[];
  education: {
    degree: string;
    school: string;
    year: number;
  }[];
  certifications: string[];
  avatar?: string;
  bio: string;
  availability: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
}

export interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'weight' | 'glucose' | 'heart_rate' | 'temperature' | 'oxygen';
  value: number | { systolic: number; diastolic: number };
  unit: string;
  date: string;
  notes?: string;
  source: 'manual' | 'device' | 'lab';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
  sideEffects?: string[];
  reminders: boolean;
  reminderTimes: string[];
}

export interface Symptom {
  id: string;
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  date: string;
  duration: string;
  notes?: string;
  triggers?: string[];
  associatedSymptoms?: string[];
}