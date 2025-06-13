import React from 'react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Heart,
  Thermometer,
  Activity,
  Droplets,
  Weight,
  Moon,
  Pill,
  AlertCircle,
  Calendar,
  Download,
  Target,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock health data
const mockVitals = [
  {
    id: '1',
    type: 'blood_pressure',
    name: 'Blood Pressure',
    icon: Heart,
    unit: 'mmHg',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    currentValue: { systolic: 120, diastolic: 80 },
    target: { systolic: 120, diastolic: 80 },
    trend: 'stable',
    lastReading: '2024-01-20',
    readings: [
      { date: '2024-01-15', value: { systolic: 125, diastolic: 82 } },
      { date: '2024-01-16', value: { systolic: 122, diastolic: 79 } },
      { date: '2024-01-17', value: { systolic: 118, diastolic: 78 } },
      { date: '2024-01-18', value: { systolic: 120, diastolic: 80 } },
      { date: '2024-01-19', value: { systolic: 119, diastolic: 81 } },
      { date: '2024-01-20', value: { systolic: 120, diastolic: 80 } },
    ],
  },
  {
    id: '2',
    type: 'heart_rate',
    name: 'Heart Rate',
    icon: Activity,
    unit: 'bpm',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    currentValue: 72,
    target: 70,
    trend: 'up',
    lastReading: '2024-01-20',
    readings: [
      { date: '2024-01-15', value: 68 },
      { date: '2024-01-16', value: 70 },
      { date: '2024-01-17', value: 69 },
      { date: '2024-01-18', value: 71 },
      { date: '2024-01-19', value: 73 },
      { date: '2024-01-20', value: 72 },
    ],
  },
  {
    id: '3',
    type: 'weight',
    name: 'Weight',
    icon: Weight,
    unit: 'lbs',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    currentValue: 165,
    target: 160,
    trend: 'down',
    lastReading: '2024-01-20',
    readings: [
      { date: '2024-01-15', value: 168 },
      { date: '2024-01-16', value: 167 },
      { date: '2024-01-17', value: 166 },
      { date: '2024-01-18', value: 166 },
      { date: '2024-01-19', value: 165 },
      { date: '2024-01-20', value: 165 },
    ],
  },
  {
    id: '4',
    type: 'glucose',
    name: 'Blood Glucose',
    icon: Droplets,
    unit: 'mg/dL',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    currentValue: 95,
    target: 100,
    trend: 'stable',
    lastReading: '2024-01-20',
    readings: [
      { date: '2024-01-15', value: 98 },
      { date: '2024-01-16', value: 96 },
      { date: '2024-01-17', value: 94 },
      { date: '2024-01-18', value: 97 },
      { date: '2024-01-19', value: 95 },
      { date: '2024-01-20', value: 95 },
    ],
  },
];

const mockSymptoms = [
  {
    id: '1',
    name: 'Headache',
    severity: 3,
    date: '2024-01-20',
    duration: '2 hours',
    notes: 'Mild tension headache, possibly from stress',
    triggers: ['Stress', 'Lack of sleep'],
  },
  {
    id: '2',
    name: 'Fatigue',
    severity: 2,
    date: '2024-01-19',
    duration: 'All day',
    notes: 'Feeling tired throughout the day',
    triggers: ['Poor sleep quality'],
  },
];

const mockMedications = [
  {
    id: '1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    timesTaken: [{ date: '2024-01-20', time: '8:00 AM', taken: true }],
    nextDue: '2024-01-21 8:00 AM',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: '2024-01-01',
    instructions: 'Take with food in the morning',
  },
  {
    id: '2',
    name: 'Vitamin D3',
    dosage: '2000 IU',
    frequency: 'Once daily',
    timesTaken: [{ date: '2024-01-20', time: '8:00 AM', taken: true }],
    nextDue: '2024-01-21 8:00 AM',
    prescribedBy: 'Dr. Sarah Johnson',
    startDate: '2024-01-01',
    instructions: 'Take with breakfast',
  },
];

export const Tracking: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'vitals' | 'symptoms' | 'medications'>('vitals');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) return 'success';
    if (severity <= 3) return 'warning';
    return 'danger';
  };

  const AddVitalModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Add Health Reading</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metric Type
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>Blood Pressure</option>
              <option>Heart Rate</option>
              <option>Weight</option>
              <option>Blood Glucose</option>
              <option>Temperature</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Systolic" placeholder="120" />
            <Input label="Diastolic" placeholder="80" />
          </div>
          
          <Input label="Date & Time" type="datetime-local" />
          <Input label="Notes (Optional)" placeholder="Any additional notes..." />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddModal(false)}>
              Save Reading
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
          <h1 className="text-2xl font-bold text-gray-900">Health Tracking</h1>
          <p className="text-gray-600 mt-1">
            Monitor your health metrics, symptoms, and medications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Reading
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'vitals', label: 'Vital Signs', icon: Activity },
          { id: 'symptoms', label: 'Symptoms', icon: AlertCircle },
          { id: 'medications', label: 'Medications', icon: Pill },
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

      {/* Vitals Tab */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockVitals.map((vital) => (
              <Card
                key={vital.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedMetric === vital.id ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => setSelectedMetric(selectedMetric === vital.id ? null : vital.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${vital.bgColor}`}>
                      <vital.icon className={`w-6 h-6 ${vital.color}`} />
                    </div>
                    {getTrendIcon(vital.trend)}
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1">{vital.name}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {typeof vital.currentValue === 'object' 
                      ? `${vital.currentValue.systolic}/${vital.currentValue.diastolic}`
                      : vital.currentValue
                    }
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {vital.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Target: {typeof vital.target === 'object' 
                        ? `${vital.target.systolic}/${vital.target.diastolic}`
                        : vital.target
                      }
                    </span>
                    <span className="text-gray-400">
                      {format(new Date(vital.lastReading), 'MMM d')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Chart */}
          {selectedMetric && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mockVitals.find(v => v.id === selectedMetric)?.name} Trend
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">7 days</Button>
                    <Button variant="outline" size="sm">30 days</Button>
                    <Button variant="outline" size="sm">90 days</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm">Showing trend for the last 7 days</p>
                  </div>
                </div>
                
                {/* Recent Readings */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Readings</h4>
                  <div className="space-y-2">
                    {mockVitals.find(v => v.id === selectedMetric)?.readings.slice(-5).reverse().map((reading, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {format(new Date(reading.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {typeof reading.value === 'object' 
                            ? `${reading.value.systolic}/${reading.value.diastolic}`
                            : reading.value
                          } {mockVitals.find(v => v.id === selectedMetric)?.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Symptoms Tab */}
      {activeTab === 'symptoms' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Symptoms</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Symptom
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSymptoms.map((symptom) => (
                  <div key={symptom.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{symptom.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={getSeverityColor(symptom.severity) as any} size="sm">
                            Severity: {symptom.severity}/5
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Duration: {symptom.duration}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(symptom.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    {symptom.notes && (
                      <p className="text-sm text-gray-700 mb-2">{symptom.notes}</p>
                    )}
                    
                    {symptom.triggers.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 mr-1">Triggers:</span>
                        {symptom.triggers.map((trigger, index) => (
                          <Badge key={index} variant="default" size="sm">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    )}
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
                <h3 className="text-lg font-semibold text-gray-900">Current Medications</h3>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockMedications.map((medication) => (
                  <div key={medication.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <p className="text-sm text-gray-600">
                          {medication.dosage} • {medication.frequency}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Prescribed by {medication.prescribedBy}
                        </p>
                      </div>
                      <Badge variant="success" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        On track
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">{medication.instructions}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Next dose: {medication.nextDue}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          Mark Taken
                        </Button>
                        <Button variant="outline" size="sm">
                          Skip
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

      {showAddModal && <AddVitalModal />}
    </div>
  );
};