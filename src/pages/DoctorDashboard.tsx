import React from 'react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import {
  Calendar,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Video,
  MessageSquare,
  TrendingUp,
  Activity,
  Heart,
  Thermometer,
  Pill,
  Stethoscope,
  Brain,
  Eye,
  Plus,
  Search,
  Filter,
  Bell,
  Star,
  MapPin,
  Download,
  Send,
  Edit,
  MoreHorizontal,
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
    age: 34,
    gender: 'Female',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-25',
    condition: 'Hypertension',
    priority: 'medium',
    avatar: '👩',
    phone: '+1234567890',
    email: 'sarah.j@email.com',
    insurance: 'Blue Cross',
    allergies: ['Penicillin'],
    currentMedications: ['Lisinopril 10mg'],
    recentVitals: {
      bloodPressure: '140/90',
      heartRate: 78,
      temperature: 98.6,
      weight: 165,
    },
    riskFactors: ['Family history of heart disease', 'Sedentary lifestyle'],
    notes: 'Patient responding well to medication. Needs lifestyle counseling.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 45,
    gender: 'Male',
    lastVisit: '2024-01-10',
    nextAppointment: '2024-01-26',
    condition: 'Diabetes Type 2',
    priority: 'high',
    avatar: '👨',
    phone: '+1234567891',
    email: 'michael.c@email.com',
    insurance: 'Aetna',
    allergies: ['Sulfa drugs'],
    currentMedications: ['Metformin 500mg', 'Insulin'],
    recentVitals: {
      bloodPressure: '130/85',
      heartRate: 82,
      temperature: 98.4,
      weight: 180,
      glucose: 145,
    },
    riskFactors: ['Obesity', 'Family history of diabetes'],
    notes: 'Blood sugar levels need better control. Consider insulin adjustment.',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    age: 28,
    gender: 'Female',
    lastVisit: '2024-01-12',
    nextAppointment: '2024-01-24',
    condition: 'Anxiety Disorder',
    priority: 'low',
    avatar: '👩',
    phone: '+1234567892',
    email: 'emily.r@email.com',
    insurance: 'Kaiser',
    allergies: ['None known'],
    currentMedications: ['Sertraline 50mg'],
    recentVitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      weight: 135,
    },
    riskFactors: ['Work stress', 'Sleep issues'],
    notes: 'Patient showing improvement with therapy and medication.',
  },
];

const mockAppointments = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientId: '1',
    time: '9:00 AM',
    duration: 30,
    type: 'Follow-up',
    status: 'confirmed',
    reason: 'Blood pressure check',
    isUrgent: false,
    location: 'Room 101',
    notes: 'Bring recent lab results',
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    patientId: '2',
    time: '10:30 AM',
    duration: 45,
    type: 'Consultation',
    status: 'confirmed',
    reason: 'Diabetes management',
    isUrgent: true,
    location: 'Telehealth',
    notes: 'Review insulin dosage',
  },
  {
    id: '3',
    patientName: 'Emily Rodriguez',
    patientId: '3',
    time: '2:00 PM',
    duration: 60,
    type: 'Therapy Session',
    status: 'scheduled',
    reason: 'Anxiety counseling',
    isUrgent: false,
    location: 'Room 203',
    notes: 'First session after medication adjustment',
  },
];

const mockLabResults = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    testName: 'Lipid Panel',
    date: '2024-01-20',
    status: 'abnormal',
    priority: 'high',
    results: {
      totalCholesterol: { value: 240, normal: '<200', status: 'high' },
      ldl: { value: 160, normal: '<100', status: 'high' },
      hdl: { value: 45, normal: '>40', status: 'normal' },
    },
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    testName: 'HbA1c',
    date: '2024-01-19',
    status: 'abnormal',
    priority: 'high',
    results: {
      hba1c: { value: 8.2, normal: '<7.0', status: 'high' },
    },
  },
  {
    id: '3',
    patientName: 'Emily Rodriguez',
    testName: 'Complete Blood Count',
    date: '2024-01-18',
    status: 'normal',
    priority: 'low',
    results: {
      wbc: { value: 7.5, normal: '4.0-10.0', status: 'normal' },
      rbc: { value: 4.2, normal: '4.2-5.8', status: 'normal' },
    },
  },
];

const mockMessages = [
  {
    id: '1',
    from: 'Sarah Johnson',
    subject: 'Question about medication',
    preview: 'Hi Dr. Smith, I have a question about my blood pressure medication...',
    time: '2 hours ago',
    isRead: false,
    priority: 'normal',
  },
  {
    id: '2',
    from: 'Michael Chen',
    subject: 'Side effects concern',
    preview: 'I\'ve been experiencing some side effects from the new insulin...',
    time: '4 hours ago',
    isRead: false,
    priority: 'high',
  },
  {
    id: '3',
    from: 'Emily Rodriguez',
    subject: 'Appointment rescheduling',
    preview: 'Could we reschedule my appointment for next week?',
    time: '1 day ago',
    isRead: true,
    priority: 'normal',
  },
];

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'patients' | 'appointments' | 'labs' | 'messages'>('overview');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showPatientModal, setShowPatientModal] = React.useState(false);

  const todayAppointments = mockAppointments.filter(apt => isToday(new Date()));
  const urgentLabs = mockLabResults.filter(lab => lab.priority === 'high');
  const unreadMessages = mockMessages.filter(msg => !msg.isRead);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'scheduled': return 'info';
      case 'completed': return 'default';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const PatientModal = () => {
    const patient = mockPatients.find(p => p.id === selectedPatient);
    if (!patient) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{patient.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-gray-600">{patient.age} years old • {patient.gender}</p>
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
                    <span className="text-sm">{patient.insurance}</span>
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
                    <span className="text-sm font-medium">{patient.recentVitals.bloodPressure} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Heart Rate:</span>
                    <span className="text-sm font-medium">{patient.recentVitals.heartRate} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Temperature:</span>
                    <span className="text-sm font-medium">{patient.recentVitals.temperature}°F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Weight:</span>
                    <span className="text-sm font-medium">{patient.recentVitals.weight} lbs</span>
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
                    {patient.currentMedications.map((med, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{med}</span>
                        <Pill className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h4 className="font-semibold text-gray-900">Allergies & Risk Factors</h4>
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
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Risk Factors:</h5>
                      <div className="space-y-1">
                        {patient.riskFactors.map((risk, index) => (
                          <div key={index} className="text-sm text-gray-600">• {risk}</div>
                        ))}
                      </div>
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
            Good morning, Dr. {user?.firstName}! 👨‍⚕️
          </h1>
          <p className="text-gray-600 mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} • {todayAppointments.length} appointments today
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Bell className="w-4 h-4 mr-2" />
            Notifications ({unreadMessages.length})
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Today's Appointments</p>
                <p className="text-3xl font-bold">{todayAppointments.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Patients</p>
                <p className="text-3xl font-bold">{mockPatients.length}</p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Urgent Labs</p>
                <p className="text-3xl font-bold">{urgentLabs.length}</p>
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
                <p className="text-3xl font-bold">{unreadMessages.length}</p>
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
          { id: 'labs', label: 'Lab Results', icon: FileText },
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
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {mockPatients.find(p => p.id === appointment.patientId)?.avatar}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-600">{appointment.reason}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{appointment.time}</span>
                          {appointment.isUrgent && (
                            <Badge variant="danger" size="sm">Urgent</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {appointment.location === 'Telehealth' ? (
                        <Button size="sm">
                          <Video className="w-4 h-4 mr-1" />
                          Join
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {appointment.location}
                        </Button>
                      )}
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
                {urgentLabs.map((lab) => (
                  <div key={lab.id} className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900">{lab.testName} - {lab.patientName}</h4>
                      <p className="text-sm text-red-700 mt-1">Abnormal results require attention</p>
                      <p className="text-xs text-red-600 mt-1">{format(new Date(lab.date), 'MMM d, yyyy')}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                ))}
                
                {unreadMessages.filter(msg => msg.priority === 'high').map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-900">{message.subject}</h4>
                      <p className="text-sm text-orange-700 mt-1">{message.preview}</p>
                      <p className="text-xs text-orange-600 mt-1">From: {message.from} • {message.time}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                  </div>
                ))}
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                    className="w-64"
                  />
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{patient.avatar}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">{patient.age} years • {patient.condition}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <span>Last visit: {format(new Date(patient.lastVisit), 'MMM d')}</span>
                          <span>Next: {format(new Date(patient.nextAppointment), 'MMM d')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={getPriorityColor(patient.priority) as any} size="sm">
                        {patient.priority} priority
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
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

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Appointment Management</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {mockPatients.find(p => p.id === appointment.patientId)?.avatar}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{appointment.patientName}</h4>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.time} ({appointment.duration} min)
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {appointment.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={getStatusColor(appointment.status) as any} size="sm">
                      {appointment.status}
                    </Badge>
                    {appointment.isUrgent && (
                      <Badge variant="danger" size="sm">Urgent</Badge>
                    )}
                    <div className="flex items-center space-x-1">
                      {appointment.location === 'Telehealth' ? (
                        <Button size="sm">
                          <Video className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lab Results Tab */}
      {activeTab === 'labs' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Laboratory Results</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockLabResults.map((lab) => (
                <div key={lab.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{lab.testName}</h4>
                      <p className="text-sm text-gray-600">{lab.patientName}</p>
                      <p className="text-xs text-gray-500">{format(new Date(lab.date), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={lab.status === 'normal' ? 'success' : 'warning'} size="sm">
                        {lab.status}
                      </Badge>
                      <Badge variant={getPriorityColor(lab.priority) as any} size="sm">
                        {lab.priority} priority
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(lab.results).map(([key, result]) => (
                        <div key={key} className="text-center">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">{key}</p>
                          <p className="text-lg font-bold text-gray-900">{result.value}</p>
                          <p className="text-xs text-gray-600">Normal: {result.normal}</p>
                          <Badge variant={result.status === 'normal' ? 'success' : 'warning'} size="sm">
                            {result.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3">
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Patient Messages</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg transition-colors ${
                    message.isRead ? 'border-gray-200 bg-white' : 'border-primary-200 bg-primary-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{message.subject}</h4>
                      <p className="text-sm text-gray-600">From: {message.from}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {message.priority === 'high' && (
                        <Badge variant="danger" size="sm">High Priority</Badge>
                      )}
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{message.preview}</p>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      Mark as Read
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

      {selectedPatient && <PatientModal />}
    </div>
  );
};