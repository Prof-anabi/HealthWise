import React from 'react';
import { format, addDays, isSameDay, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  Plus,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

// Mock appointments data
const mockAppointments = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Primary Care',
    date: '2024-01-25',
    time: '10:00 AM',
    duration: 30,
    type: 'Follow-up',
    status: 'confirmed',
    location: {
      type: 'office',
      address: '123 Medical Center Dr, Suite 200',
    },
    notes: 'Annual physical exam and blood work review',
    avatar: '👩‍⚕️',
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    date: '2024-02-02',
    time: '2:30 PM',
    duration: 45,
    type: 'Consultation',
    status: 'scheduled',
    location: {
      type: 'telehealth',
      meetingLink: 'https://healthwise.com/meet/abc123',
    },
    notes: 'Discuss recent EKG results and treatment options',
    avatar: '👨‍⚕️',
  },
  {
    id: '3',
    doctorName: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    date: '2024-01-30',
    time: '11:15 AM',
    duration: 20,
    type: 'Procedure',
    status: 'completed',
    location: {
      type: 'office',
      address: '456 Skin Care Plaza, Floor 3',
    },
    notes: 'Mole removal and biopsy',
    avatar: '👩‍⚕️',
  },
];

const mockTimeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

export const Appointments: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [currentWeek, setCurrentWeek] = React.useState(startOfWeek(new Date()));
  const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list');
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'scheduled': return 'info';
      case 'completed': return 'default';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'office': return <MapPin className="w-4 h-4" />;
      case 'telehealth': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const BookingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Book New Appointment</h3>
            <button
              onClick={() => setShowBookingModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Doctor/Specialty" placeholder="Search doctors or specialties" />
            <Input label="Appointment Type" placeholder="Select appointment type" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Date
            </label>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`p-3 text-center rounded-lg border transition-colors ${
                    isSameDay(day, selectedDate)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-medium">
                    {format(day, 'EEE')}
                  </div>
                  <div className="text-lg font-bold">
                    {format(day, 'd')}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Available Times
            </label>
            <div className="grid grid-cols-3 gap-2">
              {mockTimeSlots.map((time, index) => (
                <button
                  key={index}
                  className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
          
          <Input
            label="Notes (Optional)"
            placeholder="Any specific concerns or notes for the doctor"
            type="textarea"
          />
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowBookingModal(false)}>
              Book Appointment
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
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">
            Manage your healthcare appointments and schedule new visits
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
          </div>
          <Button onClick={() => setShowBookingModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Week of {format(currentWeek, 'MMMM d, yyyy')}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium text-gray-900 mb-2">
                    {format(day, 'EEE d')}
                  </div>
                  <div className="space-y-2">
                    {filteredAppointments
                      .filter(apt => isSameDay(new Date(apt.date), day))
                      .map(appointment => (
                        <div
                          key={appointment.id}
                          className="p-2 bg-primary-50 border border-primary-200 rounded-lg text-xs"
                        >
                          <div className="font-medium text-primary-900">
                            {appointment.time}
                          </div>
                          <div className="text-primary-700">
                            {appointment.doctorName}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{appointment.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.doctorName}
                      </h3>
                      <Badge variant={getStatusColor(appointment.status) as any} size="sm">
                        <div className="flex items-center">
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{appointment.specialty}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(appointment.date), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.time} ({appointment.duration} min)
                      </div>
                      <div className="flex items-center">
                        {getLocationIcon(appointment.location.type)}
                        <span className="ml-1 capitalize">{appointment.location.type}</span>
                      </div>
                    </div>
                    
                    {appointment.location.address && (
                      <p className="text-sm text-gray-600 mb-2">
                        📍 {appointment.location.address}
                      </p>
                    )}
                    
                    {appointment.notes && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {appointment.location.type === 'telehealth' && appointment.status === 'confirmed' && (
                    <Button size="sm">
                      <Video className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showBookingModal && <BookingModal />}
    </div>
  );
};