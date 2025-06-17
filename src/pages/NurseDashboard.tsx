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
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

// Mock data for nurse dashboard
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

export const NurseDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'tasks' | 'vitals' | 'medications' | 'messages' | 'education'>('overview');
  const [shiftStartTime] = React.useState(new Date('2024-01-20 07:00'));
  const [currentTime] = React.useState(new Date('2024-01-20 15:00'));
  const [showVitalsModal, setShowVitalsModal] = React.useState(false);
  const [showMedicationModal, setShowMedicationModal] = React.useState(false);
  const [showMessageModal, setShowMessageModal] = React.useState(false);

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
                {mockPatients.map(patient => (
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good afternoon, Nurse {user?.firstName}! 👩‍⚕️
          </h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Shift: {shiftDuration}h {Math.floor(((currentTime.getTime() - shiftStartTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {mockPatients.length} patients assigned
            </div>
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {overdueTasks.length} overdue tasks
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Coffee className="w-4 h-4 mr-2" />
            Break Timer
          </Button>
          <Button onClick={() => setShowVitalsModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Quick Entry
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Overdue Tasks</p>
                <p className="text-3xl font-bold">{overdueTasks.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Due Soon</p>
                <p className="text-3xl font-bold">{upcomingTasks.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Critical Patients</p>
                <p className="text-3xl font-bold">
                  {mockPatients.filter(p => p.acuityLevel === 'high').length}
                </p>
              </div>
              <Heart className="w-8 h-8 text-blue-200" />
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
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'tasks', label: 'Tasks', icon: Clipboard },
          { id: 'vitals', label: 'Vitals', icon: Thermometer },
          { id: 'medications', label: 'Medications', icon: Pill },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'education', label: 'Education', icon: BookOpen },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Assignment */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">My Patients</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search patients..."
                      className="w-48"
                      leftIcon={<Search className="w-4 h-4" />}
                    />
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-200 transition-colors cursor-pointer"
                      onClick={() => setSelectedPatient(patient.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{patient.name}</h4>
                            <Badge variant={getAcuityColor(patient.acuityLevel) as any} size="sm">
                              {patient.acuityLevel} acuity
                            </Badge>
                            {patient.isolation && (
                              <Badge variant="warning" size="sm">
                                <Shield className="w-3 h-3 mr-1" />
                                Isolation
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Room {patient.room} • {patient.age}y • {patient.condition}
                          </p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>Admitted: {format(new Date(patient.admissionDate), 'MMM d')}</div>
                          <div>Vitals: {format(new Date(patient.vitals.lastTaken), 'HH:mm')}</div>
                        </div>
                      </div>
                      
                      {/* Quick Vitals */}
                      <div className="grid grid-cols-5 gap-2 mb-3 text-xs">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium">Temp</div>
                          <div className={patient.vitals.temperature > 100.4 ? 'text-red-600' : 'text-gray-900'}>
                            {patient.vitals.temperature}°F
                          </div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium">BP</div>
                          <div className={patient.vitals.bloodPressure.systolic > 140 ? 'text-red-600' : 'text-gray-900'}>
                            {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium">HR</div>
                          <div className={patient.vitals.heartRate > 100 ? 'text-red-600' : 'text-gray-900'}>
                            {patient.vitals.heartRate}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium">RR</div>
                          <div className={patient.vitals.respiratoryRate > 20 ? 'text-red-600' : 'text-gray-900'}>
                            {patient.vitals.respiratoryRate}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-medium">SpO2</div>
                          <div className={patient.vitals.oxygenSaturation < 95 ? 'text-red-600' : 'text-gray-900'}>
                            {patient.vitals.oxygenSaturation}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Pending Tasks */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {patient.tasks.filter(task => !task.completed).slice(0, 3).map((task) => (
                            <Badge key={task.id} variant={getPriorityColor(task.priority) as any} size="sm">
                              {getTaskIcon(task.type)}
                              <span className="ml-1">{task.dueTime}</span>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="outline" size="sm">
                            <Thermometer className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Pill className="w-4 h-4" />
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

          {/* Urgent Alerts & Messages */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Urgent Alerts</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-900">{task.description}</p>
                            <p className="text-xs text-red-700">{task.patientName} - {task.room}</p>
                            <p className="text-xs text-red-600">Due: {task.dueTime}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockMessages.slice(0, 3).map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg border ${
                        message.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{message.subject}</p>
                          <p className="text-xs text-gray-600">From: {message.from}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge variant={getPriorityColor(message.priority) as any} size="sm">
                            {message.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Task Manager</h3>
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>All Tasks</option>
                    <option>Overdue</option>
                    <option>Due Soon</option>
                    <option>Completed</option>
                  </select>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg ${
                      task.completed 
                        ? 'bg-green-50 border-green-200' 
                        : isBefore(new Date(`2024-01-20 ${task.dueTime}`), currentTime)
                          ? 'bg-red-50 border-red-200'
                          : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            task.completed 
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-primary-500'
                          }`}
                        >
                          {task.completed && <CheckCircle className="w-3 h-3" />}
                        </button>
                        <div className="flex items-center space-x-2">
                          {getTaskIcon(task.type)}
                          <div>
                            <h4 className="font-medium text-gray-900">{task.description}</h4>
                            <p className="text-sm text-gray-600">
                              {task.patientName} - Room {task.room}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={getPriorityColor(task.priority) as any} size="sm">
                          {task.priority}
                        </Badge>
                        <span className={`text-sm font-medium ${
                          isBefore(new Date(`2024-01-20 ${task.dueTime}`), currentTime) && !task.completed
                            ? 'text-red-600'
                            : 'text-gray-900'
                        }`}>
                          {task.dueTime}
                        </span>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
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

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Vital Signs Dashboard</h3>
                <Button onClick={() => setShowVitalsModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record Vitals
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockPatients.map((patient) => (
                  <div key={patient.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">Room {patient.room} • Last taken: {format(new Date(patient.vitals.lastTaken), 'MMM d, HH:mm')}</p>
                      </div>
                      <Badge variant={getAcuityColor(patient.acuityLevel) as any} size="sm">
                        {patient.acuityLevel} acuity
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Thermometer className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Temperature</div>
                        <div className={`text-lg font-bold ${patient.vitals.temperature > 100.4 ? 'text-red-600' : 'text-gray-900'}`}>
                          {patient.vitals.temperature}°F
                        </div>
                        {patient.vitals.temperature > 100.4 && (
                          <Badge variant="danger" size="sm">High</Badge>
                        )}
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Blood Pressure</div>
                        <div className={`text-lg font-bold ${patient.vitals.bloodPressure.systolic > 140 ? 'text-red-600' : 'text-gray-900'}`}>
                          {patient.vitals.bloodPressure.systolic}/{patient.vitals.bloodPressure.diastolic}
                        </div>
                        {patient.vitals.bloodPressure.systolic > 140 && (
                          <Badge variant="danger" size="sm">High</Badge>
                        )}
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Activity className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Heart Rate</div>
                        <div className={`text-lg font-bold ${patient.vitals.heartRate > 100 ? 'text-red-600' : 'text-gray-900'}`}>
                          {patient.vitals.heartRate} bpm
                        </div>
                        {patient.vitals.heartRate > 100 && (
                          <Badge variant="warning" size="sm">Elevated</Badge>
                        )}
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Wind className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Respiratory</div>
                        <div className={`text-lg font-bold ${patient.vitals.respiratoryRate > 20 ? 'text-red-600' : 'text-gray-900'}`}>
                          {patient.vitals.respiratoryRate} /min
                        </div>
                        {patient.vitals.respiratoryRate > 20 && (
                          <Badge variant="warning" size="sm">High</Badge>
                        )}
                      </div>
                      
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">O2 Saturation</div>
                        <div className={`text-lg font-bold ${patient.vitals.oxygenSaturation < 95 ? 'text-red-600' : 'text-gray-900'}`}>
                          {patient.vitals.oxygenSaturation}%
                        </div>
                        {patient.vitals.oxygenSaturation < 95 && (
                          <Badge variant="danger" size="sm">Low</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Trends
                      </Button>
                      <Button size="sm" onClick={() => setShowVitalsModal(true)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Medication Administration Record (MAR)</h3>
                <div className="flex items-center space-x-2">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option>All Patients</option>
                    {mockPatients.map(patient => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add PRN
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockPatients.map((patient) => (
                  <div key={patient.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{patient.name}</h4>
                        <p className="text-sm text-gray-600">Room {patient.room}</p>
                        {patient.allergies.length > 0 && (
                          <div className="flex items-center mt-1">
                            <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-sm text-red-600">
                              Allergies: {patient.allergies.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {patient.medications.map((medication, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            medication.status === 'due' 
                              ? 'bg-yellow-50 border-yellow-200'
                              : medication.status === 'given'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Pill className="w-5 h-5 text-blue-600" />
                              <div>
                                <h5 className="font-medium text-gray-900">{medication.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {medication.route} • {medication.time}
                                </p>
                                {medication.notes && (
                                  <p className="text-xs text-gray-500 mt-1">{medication.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={
                                  medication.status === 'due' ? 'warning' :
                                  medication.status === 'given' ? 'success' : 'default'
                                } 
                                size="sm"
                              >
                                {medication.status}
                              </Badge>
                              {medication.status === 'due' && (
                                <Button size="sm" onClick={() => setShowMedicationModal(true)}>
                                  Give
                                </Button>
                              )}
                              {medication.status === 'scheduled' && (
                                <Button variant="outline" size="sm">
                                  Prepare
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Team Communications</h3>
                <Button onClick={() => setShowMessageModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Message
                </Button>
              </div>
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
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Education & Training</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEducationAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg ${
                      alert.completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {alert.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-yellow-600 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{alert.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Due: {format(new Date(alert.dueDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={alert.type === 'mandatory' ? 'danger' : 'info'} 
                          size="sm"
                        >
                          {alert.type}
                        </Badge>
                        {!alert.completed && (
                          <Button size="sm">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Quick Reference</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Drug Calculations</h4>
                  <p className="text-sm text-blue-800">Quick reference for medication dosing</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Open Calculator
                  </Button>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Normal Values</h4>
                  <p className="text-sm text-green-800">Reference ranges for vital signs</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Chart
                  </Button>
                </div>
                
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Emergency Protocols</h4>
                  <p className="text-sm text-purple-800">Code blue and rapid response</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Protocols
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      {showVitalsModal && <VitalsModal />}
      {showMedicationModal && <MedicationModal />}
    </div>
  );
};