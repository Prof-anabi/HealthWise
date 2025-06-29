import React from 'react';
import { format, addHours, isAfter, isBefore } from 'date-fns';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Thermometer,
  Heart,
  Activity,
  Droplets,
  Wind,
  Pill,
  FileText,
  MessageSquare,
  Bell,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Video,
  Camera,
  Upload,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
  AlertCircle,
  BookOpen,
  Coffee,
  Timer,
  Clipboard,
  Stethoscope,
  Shield,
  Target,
  Zap,
  Eye,
  Edit,
  Send,
  Flag,
  UserCheck,
  Briefcase,
  X,
  Mail,
  Save,
  Download,
  Share2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

// Mock data for doctor dashboard
const mockPatients = [
  {
    id: '1',
    name: 'Sarah Johnson',
    room: '101A',
    age: 34,
    condition: 'Post-surgical recovery',
    admissionDate: '2024-01-18',
    acuityLevel: 'medium',
    allergies: ['Penicillin'],
    diet: 'Regular',
    mobility: 'Bed rest',
    isolation: null,
    primaryNurse: 'You',
    email: 'sarah.johnson@email.com',
    phone: '+1234567890',
    vitals: {
      temperature: 98.6,
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      lastTaken: '2024-01-20 14:30',
    },
    tasks: [
      { id: '1', type: 'vitals', description: 'Take vital signs', dueTime: '15:00', priority: 'high', completed: false },
      { id: '2', type: 'medication', description: 'Administer pain medication', dueTime: '15:30', priority: 'high', completed: false },
      { id: '3', type: 'assessment', description: 'Wound assessment', dueTime: '16:00', priority: 'medium', completed: false },
    ],
    medications: [
      { name: 'Morphine 5mg', time: '15:30', status: 'due', route: 'IV', notes: 'For pain management' },
      { name: 'Antibiotics', time: '18:00', status: 'scheduled', route: 'PO', notes: 'With food' },
    ],
    notes: 'Patient reports pain level 6/10. Surgical site clean and dry. Ambulating with assistance.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    room: '102B',
    age: 67,
    condition: 'CHF exacerbation',
    admissionDate: '2024-01-19',
    acuityLevel: 'high',
    allergies: ['Sulfa'],
    diet: 'Low sodium',
    mobility: 'Chair rest',
    isolation: null,
    primaryNurse: 'You',
    email: 'michael.chen@email.com',
    phone: '+1234567891',
    vitals: {
      temperature: 99.2,
      bloodPressure: { systolic: 150, diastolic: 95 },
      heartRate: 88,
      respiratoryRate: 22,
      oxygenSaturation: 94,
      lastTaken: '2024-01-20 14:00',
    },
    tasks: [
      { id: '4', type: 'vitals', description: 'Monitor vitals q2h', dueTime: '15:00', priority: 'high', completed: false },
      { id: '5', type: 'assessment', description: 'Respiratory assessment', dueTime: '15:15', priority: 'high', completed: false },
      { id: '6', type: 'intake', description: 'Record I&O', dueTime: '16:00', priority: 'medium', completed: false },
    ],
    medications: [
      { name: 'Furosemide 40mg', time: '15:00', status: 'due', route: 'IV', notes: 'Monitor output' },
      { name: 'Lisinopril 10mg', time: '18:00', status: 'scheduled', route: 'PO', notes: 'Hold if SBP <100' },
    ],
    notes: 'Shortness of breath improved. Edema +2 bilateral lower extremities. O2 at 2L NC.',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    room: '103A',
    age: 28,
    condition: 'Pneumonia',
    admissionDate: '2024-01-20',
    acuityLevel: 'low',
    allergies: ['None known'],
    diet: 'Regular',
    mobility: 'Up ad lib',
    isolation: 'Droplet precautions',
    primaryNurse: 'You',
    email: 'emily.rodriguez@email.com',
    phone: '+1234567892',
    vitals: {
      temperature: 100.4,
      bloodPressure: { systolic: 110, diastolic: 70 },
      heartRate: 95,
      respiratoryRate: 20,
      oxygenSaturation: 96,
      lastTaken: '2024-01-20 13:30',
    },
    tasks: [
      { id: '7', type: 'medication', description: 'Antibiotic administration', dueTime: '15:00', priority: 'high', completed: false },
      { id: '8', type: 'education', description: 'Incentive spirometer teaching', dueTime: '16:00', priority: 'medium', completed: false },
    ],
    medications: [
      { name: 'Ceftriaxone 1g', time: '15:00', status: 'due', route: 'IV', notes: 'Infuse over 30 min' },
      { name: 'Albuterol inhaler', time: 'PRN', status: 'prn', route: 'Inhaled', notes: 'For SOB' },
    ],
    notes: 'Cough productive with yellow sputum. Tolerating oral intake well. Afebrile this morning.',
  },
];

const mockMessages = [
  {
    id: '1',
    from: 'Dr. Sarah Johnson',
    to: 'Nursing Staff',
    subject: 'Patient Chen - New Orders',
    message: 'Please increase Furosemide to 80mg IV BID and monitor strict I&O. Call if urine output <30ml/hr.',
    time: '14:45',
    priority: 'high',
    read: false,
    attachments: [],
  },
  {
    id: '2',
    from: 'Lab Department',
    to: 'Floor 3 Nurses',
    subject: 'Critical Lab Value',
    message: 'Patient Johnson (Room 101A) - Hemoglobin 7.2. Please notify physician immediately.',
    time: '14:30',
    priority: 'critical',
    read: false,
    attachments: [],
  },
  {
    id: '3',
    from: 'Pharmacy',
    to: 'All Nurses',
    subject: 'Medication Shortage Alert',
    message: 'Morphine 10mg vials temporarily unavailable. Use 5mg vials x2 as substitute.',
    time: '13:15',
    priority: 'medium',
    read: true,
    attachments: [],
  },
];

const mockEducationAlerts = [
  {
    id: '1',
    title: 'Hand Hygiene Compliance Update',
    type: 'mandatory',
    dueDate: '2024-01-25',
    completed: false,
    description: 'New WHO guidelines for hand hygiene in clinical settings',
  },
  {
    id: '2',
    title: 'Fall Prevention Protocol',
    type: 'policy',
    dueDate: '2024-01-30',
    completed: true,
    description: 'Updated fall risk assessment and prevention strategies',
  },
];

const testTypes = [
  { id: 'blood', name: 'Blood Work', icon: Droplets },
  { id: 'imaging', name: 'Imaging', icon: Camera },
  { id: 'urine', name: 'Urine Analysis', icon: FileText },
  { id: 'cardiac', name: 'Cardiac Tests', icon: Heart },
  { id: 'pulmonary', name: 'Pulmonary Tests', icon: Wind },
  { id: 'other', name: 'Other Tests', icon: Clipboard },
];

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'patients' | 'appointments' | 'labs' | 'messages'>('overview');
  const [shiftStartTime] = React.useState(new Date('2024-01-20 07:00'));
  const [currentTime] = React.useState(new Date('2024-01-20 15:00'));
  const [showVitalsModal, setShowVitalsModal] = React.useState(false);
  const [showMedicationModal, setShowMedicationModal] = React.useState(false);
  const [showMessageModal, setShowMessageModal] = React.useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = React.useState(false);
  const [showLabReportModal, setShowLabReportModal] = React.useState(false);
  const [patients, setPatients] = React.useState(mockPatients);

  const shiftDuration = Math.floor((currentTime.getTime() - shiftStartTime.getTime()) / (1000 * 60 * 60));
  const allTasks = mockPatients.flatMap(patient => 
    patient.tasks.map(task => ({ ...task, patientName: patient.name, room: patient.room }))
  );
  const overdueTasks = allTasks.filter(task => 
    !task.completed && isBefore(new Date(`2024-01-20 ${task.dueTime}`), currentTime)
  );
  const upcomingTasks = allTasks.filter(task => 
    !task.completed && isAfter(new Date(`2024-01-20 ${task.dueTime}`), currentTime) &&
    isBefore(new Date(`2024-01-20 ${task.dueTime}`), addHours(currentTime, 2))
  );

  const getAcuityColor = (level: string) => {
    switch (level) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'vitals': return <Thermometer className="w-4 h-4" />;
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'assessment': return <Stethoscope className="w-4 h-4" />;
      case 'intake': return <Droplets className="w-4 h-4" />;
      case 'education': return <BookOpen className="w-4 h-4" />;
      default: return <Clipboard className="w-4 h-4" />;
    }
  };

  const AddPatientModal = () => {
    const [formData, setFormData] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      insurance: '',
      allergies: '',
      medicalHistory: '',
      currentMedications: '',
      primaryConcern: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Create new patient object
      const newPatient = {
        id: `new_${Date.now()}`,
        name: `${formData.firstName} ${formData.lastName}`,
        room: 'Pending Assignment',
        age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
        condition: formData.primaryConcern || 'Initial Assessment',
        admissionDate: new Date().toISOString().split('T')[0],
        acuityLevel: 'medium' as const,
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        diet: 'Regular',
        mobility: 'Up ad lib',
        isolation: null,
        primaryNurse: 'Unassigned',
        email: formData.email,
        phone: formData.phone,
        vitals: {
          temperature: 98.6,
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          lastTaken: new Date().toISOString(),
        },
        tasks: [],
        medications: [],
        notes: `New patient admitted. Primary concern: ${formData.primaryConcern}`,
      };

      // Add to patients list
      setPatients(prev => [...prev, newPatient]);
      
      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        insurance: '',
        allergies: '',
        medicalHistory: '',
        currentMedications: '',
        primaryConcern: '',
      });
      setShowAddPatientModal(false);
      
      // Show success message (in real app, this would be a toast notification)
      alert(`Patient ${newPatient.name} has been successfully added to your patient list.`);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Add New Patient</h3>
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Emergency Contact Name"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  required
                />
                <Input
                  label="Emergency Contact Phone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h4>
              <Input
                label="Insurance Provider"
                value={formData.insurance}
                onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.value }))}
                placeholder="e.g., Blue Cross Blue Shield, Aetna, etc."
              />
            </div>

            {/* Medical Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h4>
              <div className="space-y-4">
                <Input
                  label="Known Allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="Separate multiple allergies with commas"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Previous surgeries, chronic conditions, family history, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  <textarea
                    value={formData.currentMedications}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentMedications: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="List current medications, dosages, and frequency"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Concern/Reason for Visit</label>
                  <textarea
                    value={formData.primaryConcern}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryConcern: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Describe the main reason for this visit or admission"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setShowAddPatientModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <UserCheck className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const LabReportModal = () => {
    const [formData, setFormData] = React.useState({
      patientId: '',
      testType: '',
      testName: '',
      testDate: new Date().toISOString().split('T')[0],
      results: [
        { name: '', value: '', unit: '', normalRange: '', status: 'normal' }
      ],
      interpretation: '',
      recommendations: '',
      priority: 'normal' as 'normal' | 'high' | 'urgent',
      notifyPatient: true,
      attachments: [] as File[],
    });

    const addResult = () => {
      setFormData(prev => ({
        ...prev,
        results: [...prev.results, { name: '', value: '', unit: '', normalRange: '', status: 'normal' }]
      }));
    };

    const removeResult = (index: number) => {
      setFormData(prev => ({
        ...prev,
        results: prev.results.filter((_, i) => i !== index)
      }));
    };

    const updateResult = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        results: prev.results.map((result, i) => 
          i === index ? { ...result, [field]: value } : result
        )
      }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
    };

    const removeAttachment = (index: number) => {
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      if (!selectedPatient) return;

      // Create lab report object
      const labReport = {
        id: `lab_${Date.now()}`,
        patientId: formData.patientId,
        patientName: selectedPatient.name,
        testType: formData.testType,
        testName: formData.testName,
        testDate: formData.testDate,
        results: formData.results.filter(r => r.name && r.value),
        interpretation: formData.interpretation,
        recommendations: formData.recommendations,
        priority: formData.priority,
        orderingPhysician: `${user?.first_name} ${user?.last_name}`,
        createdAt: new Date().toISOString(),
        status: 'completed',
      };

      // In a real app, this would save to the database
      console.log('Lab report created:', labReport);

      // Send notification to patient if requested
      if (formData.notifyPatient) {
        // In a real app, this would trigger a notification
        console.log(`Notification sent to ${selectedPatient.name} about new lab results`);
      }

      // Reset form and close modal
      setFormData({
        patientId: '',
        testType: '',
        testName: '',
        testDate: new Date().toISOString().split('T')[0],
        results: [{ name: '', value: '', unit: '', normalRange: '', status: 'normal' }],
        interpretation: '',
        recommendations: '',
        priority: 'normal',
        notifyPatient: true,
        attachments: [],
      });
      setShowLabReportModal(false);

      // Show success message
      alert(`Lab report for ${selectedPatient.name} has been created and ${formData.notifyPatient ? 'patient has been notified' : 'saved to patient record'}.`);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Create Lab Report</h3>
              <button
                onClick={() => setShowLabReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Test Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.room}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                  <select
                    value={formData.testType}
                    onChange={(e) => setFormData(prev => ({ ...prev, testType: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Test Type</option>
                    {testTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Test Name"
                  value={formData.testName}
                  onChange={(e) => setFormData(prev => ({ ...prev, testName: e.target.value }))}
                  placeholder="e.g., Complete Blood Count, Lipid Panel"
                  required
                />
                <Input
                  label="Test Date"
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, testDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Test Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Test Results</h4>
                <Button type="button" variant="outline" size="sm" onClick={addResult}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Result
                </Button>
              </div>
              <div className="space-y-4">
                {formData.results.map((result, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">Result {index + 1}</h5>
                      {formData.results.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResult(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <Input
                        label="Test Parameter"
                        value={result.name}
                        onChange={(e) => updateResult(index, 'name', e.target.value)}
                        placeholder="e.g., Hemoglobin"
                      />
                      <Input
                        label="Value"
                        value={result.value}
                        onChange={(e) => updateResult(index, 'value', e.target.value)}
                        placeholder="e.g., 14.2"
                      />
                      <Input
                        label="Unit"
                        value={result.unit}
                        onChange={(e) => updateResult(index, 'unit', e.target.value)}
                        placeholder="e.g., g/dL"
                      />
                      <Input
                        label="Normal Range"
                        value={result.normalRange}
                        onChange={(e) => updateResult(index, 'normalRange', e.target.value)}
                        placeholder="e.g., 12.0-16.0"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={result.status}
                          onChange={(e) => updateResult(index, 'status', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interpretation and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Interpretation</label>
                <textarea
                  value={formData.interpretation}
                  onChange={(e) => setFormData(prev => ({ ...prev, interpretation: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Provide clinical interpretation of the results..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                <textarea
                  value={formData.recommendations}
                  onChange={(e) => setFormData(prev => ({ ...prev, recommendations: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Provide recommendations for follow-up care..."
                />
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload files or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG up to 10MB each</p>
                  </div>
                </label>
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex items-center space-x-3 pt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notifyPatient}
                    onChange={(e) => setFormData(prev => ({ ...prev, notifyPatient: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Notify patient immediately</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setShowLabReportModal(false)}>
                Cancel
              </Button>
              <Button type="button" variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button type="submit">
                <Send className="w-4 h-4 mr-2" />
                Send Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const VitalsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Record Vital Signs</h3>
            <button
              onClick={() => setShowVitalsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - Room {patient.room}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
              <Input type="datetime-local" defaultValue={format(currentTime, "yyyy-MM-dd'T'HH:mm")} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input label="Temperature (°F)" placeholder="98.6" />
            <Input label="Systolic BP" placeholder="120" />
            <Input label="Diastolic BP" placeholder="80" />
            <Input label="Heart Rate" placeholder="72" />
            <Input label="Respiratory Rate" placeholder="16" />
            <Input label="O2 Saturation %" placeholder="98" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pain Scale (0-10)</label>
            <div className="flex space-x-2">
              {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
                <button
                  key={num}
                  className="w-8 h-8 rounded-full border border-gray-300 hover:bg-primary-50 hover:border-primary-300 text-sm"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          <Input label="Notes" placeholder="Any observations or patient comments..." />
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowVitalsModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowVitalsModal(false)}>
              Save Vitals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const MedicationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Medication Administration</h3>
            <button
              onClick={() => setShowMedicationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Medication Safety Check</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Verify the 5 Rights: Right patient, medication, dose, route, and time
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Patient:</span>
              <span>Sarah Johnson - Room 101A</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Medication:</span>
              <span>Morphine 5mg IV</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Scheduled Time:</span>
              <span>15:30</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Administration Time</label>
              <Input type="time" defaultValue="15:30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>IV</option>
                <option>PO</option>
                <option>IM</option>
                <option>SQ</option>
              </select>
            </div>
          </div>
          
          <Input label="Notes" placeholder="Patient response, site condition, etc." />
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowMedicationModal(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              Mark as Refused
            </Button>
            <Button onClick={() => setShowMedicationModal(false)}>
              Mark as Given
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const PatientModal = () => {
    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{patient.name.charAt(0)}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-gray-600">{patient.age} years old • {patient.room}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Patient Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{patient.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{patient.email}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">Room {patient.room}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-gray-900">Recent Vitals</h4>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Blood Pressure:</span>
                    <span className="text-sm font-medium">{patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Heart Rate:</span>
                    <span className="text-sm font-medium">{patient.vitals.heartRate} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Temperature:</span>
                    <span className="text-sm font-medium">{patient.vitals.temperature}°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">O2 Saturation:</span>
                    <span className="text-sm font-medium">{patient.vitals.oxygenSaturation}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Medical Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-gray-900">Current Medications</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patient.medications.map((med, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{med.name}</span>
                        <Pill className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-gray-900">Allergies & Condition</h4>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Allergies:</h5>
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="danger" size="sm">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Current Condition:</h5>
                      <p className="text-sm text-gray-600">{patient.condition}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Clinical Notes */}
            <Card>
              <CardHeader>
                <h4 className="font-semibold text-gray-900">Clinical Notes</h4>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{patient.notes}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Add Note
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    View History
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowLabReportModal(true)}>
                    <Send className="w-4 h-4 mr-1" />
                    Send Lab Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, Dr. {user?.first_name}! 👨‍⚕️
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • {patients.length} patients under your care
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications ({mockMessages.filter(m => !m.read).length})
          </Button>
          <Button onClick={() => setShowAddPatientModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Patients</p>
                <p className="text-3xl font-bold">{patients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Critical Patients</p>
                <p className="text-3xl font-bold">
                  {patients.filter(p => p.acuityLevel === 'high').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pending Lab Reports</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <FileText className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Unread Messages</p>
                <p className="text-3xl font-bold">
                  {mockMessages.filter(m => !m.read).length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'patients', label: 'Patients', icon: Users },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
          { id: 'labs', label: 'Lab Reports', icon: FileText },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.slice(0, 3).map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.condition}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Room {patient.room}</span>
                          <Badge variant={getAcuityColor(patient.acuityLevel) as any} size="sm">
                            {patient.acuityLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={() => setSelectedPatient(patient.id)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Priority Alerts</h3>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900">Critical Lab Results</h4>
                    <p className="text-sm text-red-700 mt-1">Patient Chen - Hemoglobin 7.2 g/dL</p>
                    <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-orange-900">Urgent Message</h4>
                    <p className="text-sm text-orange-700 mt-1">Nursing staff requesting medication order review</p>
                    <p className="text-xs text-orange-600 mt-1">From: Floor 3 Nursing • 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Reply
                  </Button>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900">Lab Report Pending</h4>
                    <p className="text-sm text-blue-700 mt-1">3 lab reports awaiting your review and signature</p>
                    <p className="text-xs text-blue-600 mt-1">Due today</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowLabReportModal(true)}>
                    Create Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Patient Management</h3>
                <div className="flex items-center space-x-3">
                  <Input
                    placeholder="Search patients..."
                    leftIcon={<Search className="w-4 h-4" />}
                    className="w-64"
                  />
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button onClick={() => setShowLabReportModal(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Lab Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{patient.name.charAt(0)}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.age} years • {patient.condition}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>Room: {patient.room}</span>
                          <span>Admitted: {format(new Date(patient.admissionDate), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getAcuityColor(patient.acuityLevel) as any} size="sm">
                        {patient.acuityLevel} priority
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Labs Tab */}
      {activeTab === 'labs' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Laboratory Reports</h3>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Reports
                  </Button>
                  <Button onClick={() => setShowLabReportModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sample lab reports */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Complete Blood Count</h4>
                      <p className="text-sm text-gray-600">Sarah Johnson - Room 101A</p>
                      <p className="text-xs text-gray-500">{format(new Date(), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="warning" size="sm">Pending Review</Badge>
                      <Badge variant="warning" size="sm">High Priority</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Hemoglobin</p>
                        <p className="text-lg font-bold text-red-600">7.2 g/dL</p>
                        <p className="text-xs text-gray-600">Normal: 12.0-16.0</p>
                        <Badge variant="danger" size="sm">Critical Low</Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">WBC</p>
                        <p className="text-lg font-bold text-gray-900">8.5 K/uL</p>
                        <p className="text-xs text-gray-600">Normal: 4.0-10.0</p>
                        <Badge variant="success" size="sm">Normal</Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Platelets</p>
                        <p className="text-lg font-bold text-gray-900">250 K/uL</p>
                        <p className="text-xs text-gray-600">Normal: 150-450</p>
                        <Badge variant="success" size="sm">Normal</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-1" />
                      Send to Patient
                    </Button>
                  </div>
                </div>

                {/* More sample reports */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Lipid Panel</h4>
                      <p className="text-sm text-gray-600">Michael Chen - Room 102B</p>
                      <p className="text-xs text-gray-500">{format(new Date(Date.now() - 24 * 60 * 60 * 1000), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">Completed</Badge>
                      <Badge variant="info" size="sm">Normal Priority</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Cholesterol</p>
                        <p className="text-lg font-bold text-gray-900">185 mg/dL</p>
                        <p className="text-xs text-gray-600">Normal: &lt;200</p>
                        <Badge variant="success" size="sm">Normal</Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">LDL</p>
                        <p className="text-lg font-bold text-gray-900">95 mg/dL</p>
                        <p className="text-xs text-gray-600">Normal: &lt;100</p>
                        <Badge variant="success" size="sm">Normal</Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">HDL</p>
                        <p className="text-lg font-bold text-gray-900">55 mg/dL</p>
                        <p className="text-xs text-gray-600">Normal: &gt;40</p>
                        <Badge variant="success" size="sm">Normal</Badge>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Triglycerides</p>
                        <p className="text-lg font-bold text-gray-900">120 mg/dL</p>
                        <p className="text-xs text-gray-600">Normal: &lt;150</p>
                        <Badge variant="success" size="sm">Normal</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Other tabs remain the same... */}
      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Appointment Management</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Appointment content would go here */}
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Management</h3>
                <p className="text-gray-600">View and manage your patient appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Team Communications</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg ${
                    message.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{message.subject}</h4>
                        <Badge variant={getPriorityColor(message.priority) as any} size="sm">
                          {message.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">From: {message.from} • To: {message.to}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{message.time}</span>
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{message.message}</p>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      <Flag className="w-4 h-4 mr-1" />
                      Flag
                    </Button>
                    <Button size="sm">
                      <Send className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {selectedPatient && <PatientModal />}
      {showAddPatientModal && <AddPatientModal />}
      {showLabReportModal && <LabReportModal />}
      {showVitalsModal && <VitalsModal />}
      {showMedicationModal && <MedicationModal />}
    </div>
  );
};