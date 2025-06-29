import React from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Users,
  Database,
  Share2,
  Download,
  Trash2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info,
  Globe,
  Smartphone,
  Mail,
  Bell,
  FileText,
  Key,
  Clock,
  MapPin,
  Activity,
  Heart,
  Stethoscope,
  Pill,
  Calendar,
  MessageSquare,
  Camera,
  Fingerprint,
  Zap,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';

// Mock data for privacy settings
const dataCategories = [
  {
    id: 'health_records',
    name: 'Health Records',
    description: 'Medical history, diagnoses, treatments, and clinical notes',
    icon: Stethoscope,
    dataPoints: 156,
    lastUpdated: '2024-01-20',
    sharing: {
      healthcare_providers: true,
      research: false,
      family: false,
      insurance: true,
    },
  },
  {
    id: 'test_results',
    name: 'Test Results',
    description: 'Lab results, imaging studies, and diagnostic test outcomes',
    icon: FileText,
    dataPoints: 23,
    lastUpdated: '2024-01-18',
    sharing: {
      healthcare_providers: true,
      research: true,
      family: false,
      insurance: false,
    },
  },
  {
    id: 'medications',
    name: 'Medications',
    description: 'Current and past medications, dosages, and administration records',
    icon: Pill,
    dataPoints: 8,
    lastUpdated: '2024-01-19',
    sharing: {
      healthcare_providers: true,
      research: false,
      family: true,
      insurance: true,
    },
  },
  {
    id: 'vital_signs',
    name: 'Vital Signs',
    description: 'Blood pressure, heart rate, temperature, and other vital measurements',
    icon: Heart,
    dataPoints: 89,
    lastUpdated: '2024-01-20',
    sharing: {
      healthcare_providers: true,
      research: true,
      family: false,
      insurance: false,
    },
  },
  {
    id: 'appointments',
    name: 'Appointments',
    description: 'Scheduled visits, appointment history, and provider information',
    icon: Calendar,
    dataPoints: 34,
    lastUpdated: '2024-01-15',
    sharing: {
      healthcare_providers: true,
      research: false,
      family: true,
      insurance: true,
    },
  },
  {
    id: 'communications',
    name: 'Communications',
    description: 'Messages with healthcare providers and care team communications',
    icon: MessageSquare,
    dataPoints: 67,
    lastUpdated: '2024-01-20',
    sharing: {
      healthcare_providers: true,
      research: false,
      family: false,
      insurance: false,
    },
  },
];

const privacySettings = [
  {
    id: 'profile_visibility',
    name: 'Profile Visibility',
    description: 'Control who can see your basic profile information',
    options: ['Public', 'Healthcare Providers Only', 'Private'],
    current: 'Healthcare Providers Only',
  },
  {
    id: 'search_visibility',
    name: 'Search Visibility',
    description: 'Allow others to find you in directory searches',
    options: ['Enabled', 'Disabled'],
    current: 'Disabled',
  },
  {
    id: 'activity_tracking',
    name: 'Activity Tracking',
    description: 'Track your app usage for personalized recommendations',
    options: ['Enabled', 'Disabled'],
    current: 'Enabled',
  },
  {
    id: 'location_services',
    name: 'Location Services',
    description: 'Use your location to find nearby healthcare providers',
    options: ['Always', 'While Using App', 'Never'],
    current: 'While Using App',
  },
];

const consentHistory = [
  {
    id: '1',
    type: 'Privacy Policy',
    version: '2.1',
    date: '2024-01-01',
    status: 'Active',
    description: 'Updated privacy policy with enhanced data protection measures',
  },
  {
    id: '2',
    type: 'Terms of Service',
    version: '1.8',
    date: '2024-01-01',
    status: 'Active',
    description: 'Updated terms of service with new community guidelines',
  },
  {
    id: '3',
    type: 'Data Sharing Agreement',
    version: '1.2',
    date: '2023-12-15',
    status: 'Active',
    description: 'Consent for sharing anonymized data for medical research',
  },
  {
    id: '4',
    type: 'Marketing Communications',
    version: '1.0',
    date: '2023-11-20',
    status: 'Declined',
    description: 'Consent for receiving marketing communications and newsletters',
  },
];

export const Privacy: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'data' | 'sharing' | 'consent' | 'security'>('overview');
  const [showDataExportModal, setShowDataExportModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const DataExportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Export Your Data</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            We'll prepare a comprehensive export of all your health data. This may take a few minutes.
          </p>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm">Health Records</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm">Test Results</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm">Medications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm">Vital Signs</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm">Communications</span>
            </label>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium">Export Format</p>
                <p className="text-sm text-blue-800">Data will be exported in JSON format with a summary PDF report.</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowDataExportModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowDataExportModal(false)}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const DeleteDataModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-red-900">Delete Account & Data</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">This action cannot be undone</h4>
                <p className="text-sm text-red-800 mt-1">
                  Deleting your account will permanently remove all your health data, 
                  appointments, and medical records from our system.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Before proceeding, please note:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Your healthcare providers will lose access to your shared data</li>
              <li>• Scheduled appointments will need to be rescheduled manually</li>
              <li>• You'll lose access to all community discussions and groups</li>
              <li>• This action cannot be reversed</li>
            </ul>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type "DELETE" to confirm
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="DELETE"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Privacy & Data Control
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Manage your privacy settings, control how your health data is shared, 
          and understand your rights regarding your personal health information.
        </p>
      </div>

      {/* Privacy Score */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Privacy Score: 85/100</h3>
                <p className="text-gray-600">Your privacy settings are well configured</p>
              </div>
            </div>
            <div className="text-right">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Improve Score
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'data', label: 'My Data', icon: Database },
          { id: 'sharing', label: 'Data Sharing', icon: Share2 },
          { id: 'consent', label: 'Consent History', icon: FileText },
          { id: 'security', label: 'Security', icon: Lock },
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
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">View My Data</h3>
                <p className="text-sm text-gray-600">See what health information we have about you</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowDataExportModal(true)}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Export Data</h3>
                <p className="text-sm text-gray-600">Download a copy of all your health data</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowDeleteModal(true)}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Delete Data</h3>
                <p className="text-sm text-gray-600">Permanently remove your account and data</p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Settings Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privacySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{setting.name}</h4>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="info" size="sm">{setting.current}</Badge>
                      <Button variant="ghost" size="sm" className="ml-2">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* HIPAA Compliance */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">HIPAA Compliance</h3>
                  <p className="text-blue-800 mb-4">
                    HealthWise is fully HIPAA compliant. Your health information is protected by federal law 
                    and industry-standard security measures. We never sell your personal health data.
                  </p>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Read HIPAA Notice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* My Data Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dataCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Data Points</p>
                      <p className="font-semibold text-gray-900">{category.dataPoints}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(category.lastUpdated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 mb-2">Shared with:</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(category.sharing).map(([key, value]) => (
                        value && (
                          <Badge key={key} variant="info" size="sm">
                            {key.replace('_', ' ')}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Data Sharing Tab */}
      {activeTab === 'sharing' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Data Sharing Preferences</h3>
              <p className="text-gray-600">Control who can access your health information</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Healthcare Providers */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Healthcare Providers</h4>
                        <p className="text-sm text-gray-600">Doctors, nurses, and care team members</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dataCategories.slice(0, 4).map((category) => (
                      <label key={category.id} className="flex items-center text-sm">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2" />
                        {category.name}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Research */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Medical Research</h4>
                        <p className="text-sm text-gray-600">Anonymized data for advancing medical science</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      Your data would be completely anonymized and used only for approved medical research studies.
                    </p>
                  </div>
                </div>

                {/* Family Members */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">Family Members</h4>
                        <p className="text-sm text-gray-600">Designated family members and caregivers</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Family Member
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Consent History Tab */}
      {activeTab === 'consent' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Consent & Agreement History</h3>
              <p className="text-gray-600">Track your consent decisions and agreement history</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentHistory.map((consent) => (
                  <div key={consent.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        consent.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{consent.type}</h4>
                        <p className="text-sm text-gray-600">{consent.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Version {consent.version} • {new Date(consent.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={consent.status === 'Active' ? 'success' : 'danger'} size="sm">
                        {consent.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Security & Access</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">
                        {user?.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security to your account'}
                      </p>
                    </div>
                  </div>
                  <Button variant={user?.twoFactorEnabled ? 'outline' : 'primary'} size="sm">
                    {user?.twoFactorEnabled ? 'Manage' : 'Enable'}
                  </Button>
                </div>

                {/* Biometric Authentication */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Fingerprint className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
                      <p className="text-sm text-gray-600">
                        {user?.biometricEnabled ? 'Enabled' : 'Use fingerprint or face recognition to sign in'}
                      </p>
                    </div>
                  </div>
                  <Button variant={user?.biometricEnabled ? 'outline' : 'primary'} size="sm">
                    {user?.biometricEnabled ? 'Manage' : 'Enable'}
                  </Button>
                </div>

                {/* Session Management */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Active Sessions</h4>
                      <p className="text-sm text-gray-600">Manage your active login sessions across devices</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Sessions
                  </Button>
                </div>

                {/* Data Encryption */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">Data Encryption</h4>
                      <p className="text-sm text-gray-600">Your data is encrypted both in transit and at rest</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Recommendations */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Security Recommendations</h3>
                  <ul className="text-yellow-800 space-y-1 text-sm">
                    <li>• Enable two-factor authentication for enhanced security</li>
                    <li>• Use a strong, unique password for your HealthWise account</li>
                    <li>• Regularly review your active sessions and sign out unused devices</li>
                    <li>• Keep your contact information up to date for security notifications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      {showDataExportModal && <DataExportModal />}
      {showDeleteModal && <DeleteDataModal />}
    </div>
  );
};