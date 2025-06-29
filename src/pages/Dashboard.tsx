import React from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, isTomorrow, addWeeks, subWeeks } from 'date-fns';
import {
  Calendar,
  FileText,
  Activity,
  Bell,
  TrendingUp,
  Heart,
  Thermometer,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Plus,
  Clock,
  MapPin,
  Video,
  Phone,
  Search,
  Filter,
  Star,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Users,
  Award,
  Globe,
  X,
  Send,
  Eye,
  BookOpen,
  Target,
  Zap,
  Shield,
  Brain,
  Pill,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

// Mock data
const mockTestResults = [
  {
    id: '1',
    testName: 'Complete Blood Count',
    date: '2024-01-15',
    status: 'normal',
    summary: 'All values within normal range',
  },
  {
    id: '2',
    testName: 'Cholesterol Panel',
    date: '2024-01-10',
    status: 'high',
    summary: 'LDL cholesterol slightly elevated',
  },
  {
    id: '3',
    testName: 'Glucose Test',
    date: '2024-01-05',
    status: 'normal',
    summary: 'Blood sugar levels are good',
  },
];

const mockAppointments = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Primary Care',
    date: '2024-01-25',
    time: '10:00 AM',
    type: 'Follow-up',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    date: '2024-02-02',
    time: '2:30 PM',
    type: 'Consultation',
  },
];

const mockVitals = [
  { name: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', icon: Heart },
  { name: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', icon: Activity },
  { name: 'Temperature', value: '98.6', unit: '°F', status: 'normal', icon: Thermometer },
  { name: 'Weight', value: '165', unit: 'lbs', status: 'normal', icon: TrendingUp },
];

// Mock doctors data for appointment booking
const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Primary Care',
    subSpecialties: ['Internal Medicine', 'Preventive Care'],
    rating: 4.9,
    reviewCount: 127,
    languages: ['English', 'Spanish'],
    location: {
      address: '123 Medical Center Dr, Suite 200',
      city: 'San Francisco',
      state: 'CA',
      distance: '0.8 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Aetna', 'Kaiser', 'United Healthcare'],
    avatar: '👩‍⚕️',
    bio: 'Dr. Johnson is a board-certified internal medicine physician with over 10 years of experience in primary care.',
    availability: {
      nextAvailable: '2024-01-26',
      timeSlots: ['9:00 AM', '10:30 AM', '2:30 PM', '4:00 PM'],
    },
    isAcceptingPatients: true,
    telehealth: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    subSpecialties: ['Interventional Cardiology', 'Heart Failure'],
    rating: 4.8,
    reviewCount: 89,
    languages: ['English', 'Mandarin'],
    location: {
      address: '456 Heart Institute Blvd',
      city: 'San Francisco',
      state: 'CA',
      distance: '1.2 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Cigna', 'United Healthcare'],
    avatar: '👨‍⚕️',
    bio: 'Dr. Chen is a leading cardiologist specializing in minimally invasive cardiac procedures.',
    availability: {
      nextAvailable: '2024-02-02',
      timeSlots: ['10:00 AM', '1:00 PM', '3:30 PM'],
    },
    isAcceptingPatients: true,
    telehealth: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    subSpecialties: ['Cosmetic Dermatology', 'Skin Cancer'],
    rating: 4.7,
    reviewCount: 156,
    languages: ['English', 'Spanish', 'Portuguese'],
    location: {
      address: '789 Skin Care Plaza, Floor 3',
      city: 'San Francisco',
      state: 'CA',
      distance: '2.1 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Aetna', 'Kaiser'],
    avatar: '👩‍⚕️',
    bio: 'Dr. Rodriguez is a board-certified dermatologist with expertise in both medical and cosmetic dermatology.',
    availability: {
      nextAvailable: '2024-01-30',
      timeSlots: ['11:00 AM', '3:30 PM'],
    },
    isAcceptingPatients: false,
    telehealth: false,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    subSpecialties: ['Sports Medicine', 'Joint Replacement'],
    rating: 4.9,
    reviewCount: 203,
    languages: ['English'],
    location: {
      address: '321 Sports Medicine Center',
      city: 'San Francisco',
      state: 'CA',
      distance: '1.8 miles',
    },
    acceptedInsurance: ['Blue Cross', 'Aetna', 'United Healthcare', 'Cigna'],
    avatar: '👨‍⚕️',
    bio: 'Dr. Wilson is a renowned orthopedic surgeon specializing in sports injuries and joint replacement.',
    availability: {
      nextAvailable: '2024-02-05',
      timeSlots: ['8:00 AM', '12:00 PM'],
    },
    isAcceptingPatients: true,
    telehealth: false,
  },
];

const appointmentTypes = [
  { id: 'consultation', name: 'Consultation', duration: 30, description: 'Initial consultation or new patient visit' },
  { id: 'follow_up', name: 'Follow-up', duration: 15, description: 'Follow-up appointment for existing condition' },
  { id: 'procedure', name: 'Procedure', duration: 60, description: 'Medical procedure or treatment' },
  { id: 'test', name: 'Test/Screening', duration: 45, description: 'Diagnostic tests or health screenings' },
  { id: 'emergency', name: 'Urgent Care', duration: 30, description: 'Urgent medical attention needed' },
];

const timeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'schedule'>('overview');
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [currentWeek, setCurrentWeek] = React.useState(startOfWeek(new Date()));
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSpecialty, setSelectedSpecialty] = React.useState('all');
  const [appointmentStep, setAppointmentStep] = React.useState<'doctor' | 'datetime' | 'details' | 'confirm'>('doctor');
  const [appointmentData, setAppointmentData] = React.useState({
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation',
    location: 'office',
    notes: '',
    reason: '',
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const specialties = ['Primary Care', 'Cardiology', 'Dermatology', 'Orthopedics'];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'high': return 'warning';
      case 'low': return 'info';
      case 'critical': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-4 h-4" />;
      case 'high':
      case 'low':
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    setAppointmentData(prev => ({ ...prev, doctorId }));
    setSelectedDoctor(doctorId);
    setAppointmentStep('datetime');
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setAppointmentData(prev => ({ ...prev, date, time }));
    setAppointmentStep('details');
  };

  const handleAppointmentSubmit = () => {
    console.log('Booking appointment:', appointmentData);
    setShowScheduleModal(false);
    setAppointmentStep('doctor');
    setAppointmentData({
      doctorId: '',
      date: '',
      time: '',
      type: 'consultation',
      location: 'office',
      notes: '',
      reason: '',
    });
  };

  const ScheduleAppointmentModal = () => {
    const selectedDoctorData = mockDoctors.find(d => d.id === selectedDoctor);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Schedule Appointment</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {['doctor', 'datetime', 'details', 'confirm'].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        appointmentStep === step ? 'bg-primary-600 text-white' :
                        ['doctor', 'datetime', 'details', 'confirm'].indexOf(appointmentStep) > index ? 'bg-green-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      {index < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Step 1: Select Doctor */}
            {appointmentStep === 'doctor' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Healthcare Provider</h4>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <Input
                        placeholder="Search doctors by name or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                      />
                    </div>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="all">All Specialties</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Doctors List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedDoctor === doctor.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleDoctorSelect(doctor.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{doctor.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-gray-900">{doctor.name}</h5>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">{doctor.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            <MapPin className="w-3 h-3 mr-1" />
                            {doctor.location.distance}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {doctor.subSpecialties.slice(0, 2).map((sub, index) => (
                              <Badge key={index} variant="default" size="sm">
                                {sub}
                              </Badge>
                            ))}
                            {doctor.isAcceptingPatients && (
                              <Badge variant="success" size="sm">
                                Accepting Patients
                              </Badge>
                            )}
                            {doctor.telehealth && (
                              <Badge variant="info" size="sm">
                                Telehealth
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            Next available: {format(new Date(doctor.availability.nextAvailable), 'MMM d')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Date & Time */}
            {appointmentStep === 'datetime' && selectedDoctorData && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={() => setAppointmentStep('doctor')}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    ← Back to Doctor Selection
                  </button>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedDoctorData.avatar}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedDoctorData.name}</h4>
                      <p className="text-sm text-gray-600">{selectedDoctorData.specialty}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-4">Select Date</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h6 className="font-medium text-gray-900">
                          {format(currentWeek, 'MMMM yyyy')}
                        </h6>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                        {weekDays.map((day, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(day)}
                            className={`p-2 text-sm rounded transition-colors ${
                              isSameDay(day, selectedDate)
                                ? 'bg-primary-600 text-white'
                                : isToday(day)
                                  ? 'bg-primary-100 text-primary-700'
                                  : 'hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {format(day, 'd')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-4">
                      Available Times - {format(selectedDate, 'MMM d, yyyy')}
                    </h5>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {selectedDoctorData.availability.timeSlots.map((time, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateTimeSelect(format(selectedDate, 'yyyy-MM-dd'), time)}
                          className="p-3 text-sm border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-colors text-center"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Appointment Details */}
            {appointmentStep === 'details' && (
              <div className="space-y-6">
                <button
                  onClick={() => setAppointmentStep('datetime')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  ← Back to Date & Time
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <select
                      value={appointmentData.type}
                      onChange={(e) => setAppointmentData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {appointmentTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} ({type.duration} min)
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {appointmentTypes.find(t => t.id === appointmentData.type)?.description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visit Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="location"
                          value="office"
                          checked={appointmentData.location === 'office'}
                          onChange={(e) => setAppointmentData(prev => ({ ...prev, location: e.target.value }))}
                          className="mr-2"
                        />
                        <MapPin className="w-4 h-4 mr-2" />
                        In-Person Visit
                      </label>
                      {selectedDoctorData?.telehealth && (
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="location"
                            value="telehealth"
                            checked={appointmentData.location === 'telehealth'}
                            onChange={(e) => setAppointmentData(prev => ({ ...prev, location: e.target.value }))}
                            className="mr-2"
                          />
                          <Video className="w-4 h-4 mr-2" />
                          Telehealth Visit
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <Input
                    placeholder="Brief description of your concern or reason for the appointment"
                    value={appointmentData.reason}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any additional information you'd like to share with your healthcare provider"
                    value={appointmentData.notes}
                    onChange={(e) => setAppointmentData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setAppointmentStep('confirm')}>
                    Review Appointment
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {appointmentStep === 'confirm' && selectedDoctorData && (
              <div className="space-y-6">
                <button
                  onClick={() => setAppointmentStep('details')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  ← Back to Details
                </button>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Summary</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{selectedDoctorData.avatar}</span>
                      <div>
                        <h5 className="font-semibold text-gray-900">{selectedDoctorData.name}</h5>
                        <p className="text-sm text-gray-600">{selectedDoctorData.specialty}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Date & Time</p>
                        <p className="text-gray-900">
                          {format(new Date(appointmentData.date), 'EEEE, MMMM d, yyyy')} at {appointmentData.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Appointment Type</p>
                        <p className="text-gray-900">
                          {appointmentTypes.find(t => t.id === appointmentData.type)?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Visit Type</p>
                        <p className="text-gray-900 flex items-center">
                          {appointmentData.location === 'office' ? (
                            <>
                              <MapPin className="w-4 h-4 mr-1" />
                              In-Person Visit
                            </>
                          ) : (
                            <>
                              <Video className="w-4 h-4 mr-1" />
                              Telehealth Visit
                            </>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Location</p>
                        <p className="text-gray-900 text-sm">
                          {appointmentData.location === 'office' 
                            ? selectedDoctorData.location.address
                            : 'Video call link will be provided'
                          }
                        </p>
                      </div>
                    </div>

                    {appointmentData.reason && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reason for Visit</p>
                        <p className="text-gray-900">{appointmentData.reason}</p>
                      </div>
                    )}

                    {appointmentData.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Additional Notes</p>
                        <p className="text-gray-900">{appointmentData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900">Important Reminders</h5>
                      <ul className="text-sm text-blue-800 mt-1 space-y-1">
                        <li>• Please arrive 15 minutes early for in-person appointments</li>
                        <li>• Bring your insurance card and a valid ID</li>
                        <li>• You'll receive a confirmation email with additional details</li>
                        {appointmentData.location === 'telehealth' && (
                          <li>• Test your camera and microphone before the appointment</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAppointmentSubmit}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Confirm Appointment
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Good morning, {user?.first_name}! 👋
            </h1>
            <p className="text-primary-100 mb-4">
              Here's your health summary for today, {format(new Date(), 'MMMM d, yyyy')}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                3 recent test results
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                2 upcoming appointments
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4 mr-2" />
          Health Overview
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Appointment
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockVitals.map((vital, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{vital.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {vital.value}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          {vital.unit}
                        </span>
                      </p>
                    </div>
                    <div className="p-3 bg-primary-50 rounded-full">
                      <vital.icon className="w-6 h-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Badge variant={getStatusColor(vital.status) as any} size="sm">
                      {vital.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Test Results */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Recent Test Results</h3>
                </div>
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTestResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{result.testName}</h4>
                          <div className="ml-2">
                            {getStatusIcon(result.status)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{result.summary}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(result.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(result.status) as any}>
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                </div>
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(appointment.date), 'MMM d, yyyy')} at {appointment.time}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="info" size="sm">{appointment.type}</Badge>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">Join</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setShowScheduleModal(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule New Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Insights */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Health Insights</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-success-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Great Progress!</h4>
                  <p className="text-sm text-gray-600">Your cholesterol has improved by 15% since last month</p>
                </div>
                
                <div className="text-center p-4 bg-warning-50 rounded-lg">
                  <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-warning-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Reminder</h4>
                  <p className="text-sm text-gray-600">Don't forget to take your evening medication</p>
                </div>
                
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-6 h-6 text-primary-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Stay Active</h4>
                  <p className="text-sm text-gray-600">You're 200 steps away from your daily goal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Schedule Appointment Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowScheduleModal(true)}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Book New Appointment</h3>
                <p className="text-sm text-gray-600">Schedule with your healthcare provider</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telehealth Visit</h3>
                <p className="text-sm text-gray-600">Virtual consultation from home</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Urgent Care</h3>
                <p className="text-sm text-gray-600">Same-day appointments available</p>
              </CardContent>
            </Card>
          </div>

          {/* Featured Providers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Featured Healthcare Providers</h3>
                <Button variant="outline" size="sm">
                  View All Providers
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockDoctors.slice(0, 4).map((doctor) => (
                  <div key={doctor.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{doctor.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <MapPin className="w-3 h-3 mr-1" />
                          {doctor.location.distance}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {doctor.isAcceptingPatients && (
                            <Badge variant="success" size="sm">
                              Accepting Patients
                            </Badge>
                          )}
                          {doctor.telehealth && (
                            <Badge variant="info" size="sm">
                              Telehealth
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-600">
                            Next: {format(new Date(doctor.availability.nextAvailable), 'MMM d')}
                          </p>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedDoctor(doctor.id);
                              setShowScheduleModal(true);
                              setAppointmentStep('datetime');
                              setAppointmentData(prev => ({ ...prev, doctorId: doctor.id }));
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Appointment Types */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Types of Appointments</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointmentTypes.map((type) => (
                  <div key={type.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors">
                    <h4 className="font-medium text-gray-900 mb-2">{type.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{type.duration} minutes</span>
                      <Button variant="outline" size="sm">
                        Book {type.name}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showScheduleModal && <ScheduleAppointmentModal />}
    </div>
  );
};