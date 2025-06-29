import React from 'react';
import { format, isToday, isYesterday, subDays } from 'date-fns';
import {
  Bell,
  Check,
  CheckCircle,
  X,
  Trash2,
  Filter,
  Search,
  Settings,
  MessageSquare,
  Calendar,
  FileText,
  Pill,
  AlertTriangle,
  Info,
  Heart,
  Activity,
  User,
  Stethoscope,
  Clock,
  Star,
  Archive,
  MoreHorizontal,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Globe,
  Zap,
  Target,
  Shield,
  Download,
  Share2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'message',
    title: 'New message from Dr. Sarah Johnson',
    message: 'I\'ve reviewed your recent blood work results. Everything looks good, but I\'d like to discuss adjusting your medication dosage.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    priority: 'high',
    actionUrl: '/messages?conversation=1',
    metadata: { 
      senderId: '1', 
      senderName: 'Dr. Sarah Johnson',
      senderRole: 'doctor',
      conversationId: '1' 
    },
    category: 'communication',
    canDismiss: true,
    requiresAction: true,
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment reminder',
    message: 'You have an appointment with Dr. Johnson tomorrow at 10:00 AM. Please arrive 15 minutes early.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    priority: 'normal',
    actionUrl: '/appointments',
    metadata: { 
      appointmentId: '123',
      doctorName: 'Dr. Sarah Johnson',
      appointmentTime: '10:00 AM',
      appointmentDate: '2024-01-21'
    },
    category: 'appointment',
    canDismiss: true,
    requiresAction: false,
  },
  {
    id: '3',
    type: 'test_result',
    title: 'Test results available',
    message: 'Your blood work results from January 18th are now available for review.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
    priority: 'normal',
    actionUrl: '/test-results',
    metadata: { 
      testId: '456',
      testName: 'Complete Blood Count',
      testDate: '2024-01-18'
    },
    category: 'health',
    canDismiss: true,
    requiresAction: false,
  },
  {
    id: '4',
    type: 'medication',
    title: 'Medication reminder',
    message: 'Time to take your evening medication: Lisinopril 10mg',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true,
    priority: 'normal',
    actionUrl: '/tracking',
    metadata: { 
      medicationId: '789',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      scheduledTime: '18:00'
    },
    category: 'medication',
    canDismiss: true,
    requiresAction: false,
  },
  {
    id: '5',
    type: 'system',
    title: 'Security alert',
    message: 'New login detected from Chrome on Windows. If this wasn\'t you, please secure your account immediately.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: false,
    priority: 'urgent',
    actionUrl: '/settings?tab=security',
    metadata: { 
      loginLocation: 'San Francisco, CA',
      loginDevice: 'Chrome on Windows',
      loginTime: '2024-01-19 14:30'
    },
    category: 'security',
    canDismiss: false,
    requiresAction: true,
  },
  {
    id: '6',
    type: 'appointment',
    title: 'Appointment confirmed',
    message: 'Your appointment with Dr. Michael Chen on January 25th at 2:30 PM has been confirmed.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    priority: 'normal',
    actionUrl: '/appointments',
    metadata: { 
      appointmentId: '124',
      doctorName: 'Dr. Michael Chen',
      appointmentTime: '2:30 PM',
      appointmentDate: '2024-01-25'
    },
    category: 'appointment',
    canDismiss: true,
    requiresAction: false,
  },
];

const notificationCategories = [
  { id: 'all', label: 'All Notifications', icon: Bell, count: mockNotifications.length },
  { id: 'unread', label: 'Unread', icon: Eye, count: mockNotifications.filter(n => !n.isRead).length },
  { id: 'communication', label: 'Messages', icon: MessageSquare, count: mockNotifications.filter(n => n.category === 'communication').length },
  { id: 'appointment', label: 'Appointments', icon: Calendar, count: mockNotifications.filter(n => n.category === 'appointment').length },
  { id: 'health', label: 'Health Updates', icon: Heart, count: mockNotifications.filter(n => n.category === 'health').length },
  { id: 'medication', label: 'Medications', icon: Pill, count: mockNotifications.filter(n => n.category === 'medication').length },
  { id: 'security', label: 'Security', icon: Shield, count: mockNotifications.filter(n => n.category === 'security').length },
];

const notificationSettings = [
  {
    id: 'push_notifications',
    name: 'Push Notifications',
    description: 'Receive notifications on your device',
    enabled: true,
    channels: ['browser', 'mobile'],
  },
  {
    id: 'email_notifications',
    name: 'Email Notifications',
    description: 'Receive notifications via email',
    enabled: true,
    channels: ['email'],
  },
  {
    id: 'sms_notifications',
    name: 'SMS Notifications',
    description: 'Receive notifications via text message',
    enabled: false,
    channels: ['sms'],
  },
];

export const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showSettings, setShowSettings] = React.useState(false);
  const [notifications, setNotifications] = React.useState(mockNotifications);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'unread' && !notification.isRead) ||
      notification.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-5 h-5" />;
      case 'appointment': return <Calendar className="w-5 h-5" />;
      case 'test_result': return <FileText className="w-5 h-5" />;
      case 'medication': return <Pill className="w-5 h-5" />;
      case 'system': return <Settings className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'normal': return 'info';
      default: return 'default';
    }
  };

  const formatNotificationTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM d');
    }
  };

  const NotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          <p className="text-gray-600">Choose how you want to receive notifications</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{setting.name}</h4>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {setting.channels.map((channel) => (
                      <Badge key={channel} variant="default" size="sm">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setting.enabled}
                    className="sr-only peer"
                    onChange={() => {
                      // Handle toggle
                    }}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Notification Types</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Appointment Reminders', description: 'Get reminded about upcoming appointments', enabled: true },
              { name: 'Test Results', description: 'Notifications when new test results are available', enabled: true },
              { name: 'Medication Reminders', description: 'Reminders to take your medications', enabled: true },
              { name: 'Message Notifications', description: 'New messages from healthcare providers', enabled: true },
              { name: 'Health Tips', description: 'Personalized health and wellness tips', enabled: false },
              { name: 'System Updates', description: 'Important updates about the platform', enabled: true },
              { name: 'Security Alerts', description: 'Important security notifications', enabled: true },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600">
              Stay updated with your health information and communications
            </p>
            {unreadCount > 0 && (
              <Badge variant="primary" size="sm">
                {unreadCount} unread
              </Badge>
            )}
            {urgentCount > 0 && (
              <Badge variant="danger" size="sm">
                {urgentCount} urgent
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{notifications.length}</h3>
            <p className="text-sm text-gray-600">Total Notifications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{unreadCount}</h3>
            <p className="text-sm text-gray-600">Unread</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{urgentCount}</h3>
            <p className="text-sm text-gray-600">Urgent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              {notifications.filter(n => n.requiresAction && !n.isRead).length}
            </h3>
            <p className="text-sm text-gray-600">Action Required</p>
          </CardContent>
        </Card>
      </div>

      {showSettings ? (
        <NotificationSettings />
      ) : (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {notificationCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {notificationCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <category.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{category.label}</span>
                  {category.count > 0 && (
                    <Badge variant="default" size="sm">
                      {category.count}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'Try adjusting your search terms.' : 'You\'re all caught up!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`hover:shadow-md transition-shadow ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                        notification.priority === 'high' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <Badge variant={getPriorityColor(notification.priority) as any} size="sm">
                                {notification.priority}
                              </Badge>
                              {notification.requiresAction && (
                                <Badge variant="warning" size="sm">
                                  Action Required
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{notification.message}</p>
                            <p className="text-sm text-gray-500">
                              {formatNotificationTime(notification.timestamp)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            )}
                            {notification.canDismiss && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {notification.requiresAction && (
                          <div className="flex items-center space-x-2 mt-3">
                            <Button size="sm">
                              View Details
                            </Button>
                            {notification.type === 'message' && (
                              <Button variant="outline" size="sm">
                                Reply
                              </Button>
                            )}
                            {notification.type === 'appointment' && (
                              <Button variant="outline" size="sm">
                                Confirm
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};