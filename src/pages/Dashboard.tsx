import React from 'react';
import { format } from 'date-fns';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
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

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Good morning, {user?.firstName}! 👋
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
              <Button className="w-full" variant="outline">
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
    </div>
  );
};