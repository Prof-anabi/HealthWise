import React from 'react';
import {
  User,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Bell,
  Globe,
  Eye,
  EyeOff,
  Smartphone,
  Fingerprint,
  Key,
  Download,
  Upload,
  Trash2,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Heart,
  Activity,
  FileText,
  Lock,
  Users,
  Database,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  Plus,
  Minus,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export const Settings: React.FC = () => {
  const { user, updateUser, logout, enableTwoFactor, disableTwoFactor } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'profile' | 'health' | 'privacy' | 'security' | 'notifications' | 'account'>('profile');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  const [formData, setFormData] = React.useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.date_of_birth || '',
    bio: user?.bio || '',
    emergencyContact: {
      name: user?.emergency_contact?.name || '',
      relationship: user?.emergency_contact?.relationship || '',
      phone: user?.emergency_contact?.phone || '',
    },
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
    },
    insurance: {
      provider: user?.insurance_info?.provider || '',
      policyNumber: user?.insurance_info?.policyNumber || '',
      groupNumber: user?.insurance_info?.groupNumber || '',
    },
    medicalInfo: {
      bloodType: user?.medical_info?.bloodType || '',
      allergies: user?.medical_info?.allergies || [],
      medications: user?.medical_info?.medications || [],
      conditions: user?.medical_info?.conditions || [],
    },
    preferences: {
      privacy: {
        shareWithProviders: user?.preferences?.privacy?.shareWithProviders ?? true,
        shareForResearch: user?.preferences?.privacy?.shareForResearch ?? false,
        marketingCommunications: user?.preferences?.privacy?.marketingCommunications ?? false,
      },
      notifications: {
        email: user?.preferences?.notifications?.email ?? true,
        sms: user?.preferences?.notifications?.sms ?? true,
        push: user?.preferences?.notifications?.push ?? true,
      },
    },
  });

  // Track changes to form data
  React.useEffect(() => {
    const hasChanges = 
      formData.firstName !== (user?.first_name || '') ||
      formData.lastName !== (user?.last_name || '') ||
      formData.phone !== (user?.phone || '') ||
      formData.dateOfBirth !== (user?.date_of_birth || '') ||
      formData.bio !== (user?.bio || '') ||
      JSON.stringify(formData.emergencyContact) !== JSON.stringify(user?.emergency_contact || {}) ||
      JSON.stringify(formData.address) !== JSON.stringify(user?.address || {}) ||
      JSON.stringify(formData.insurance) !== JSON.stringify(user?.insurance_info || {}) ||
      JSON.stringify(formData.medicalInfo) !== JSON.stringify(user?.medical_info || {}) ||
      JSON.stringify(formData.preferences) !== JSON.stringify(user?.preferences || {});

    setHasUnsavedChanges(hasChanges);
  }, [formData, user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;

    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Prepare the update data
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        bio: formData.bio,
        emergency_contact: formData.emergencyContact,
        address: formData.address,
        insurance_info: formData.insurance,
        medical_info: formData.medicalInfo,
        preferences: formData.preferences,
      };

      await updateUser(updateData);
      
      setSaveSuccess(true);
      setIsEditing(false);
      setHasUnsavedChanges(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.date_of_birth || '',
      bio: user?.bio || '',
      emergencyContact: {
        name: user?.emergency_contact?.name || '',
        relationship: user?.emergency_contact?.relationship || '',
        phone: user?.emergency_contact?.phone || '',
      },
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        zipCode: user?.address?.zipCode || '',
      },
      insurance: {
        provider: user?.insurance_info?.provider || '',
        policyNumber: user?.insurance_info?.policyNumber || '',
        groupNumber: user?.insurance_info?.groupNumber || '',
      },
      medicalInfo: {
        bloodType: user?.medical_info?.bloodType || '',
        allergies: user?.medical_info?.allergies || [],
        medications: user?.medical_info?.medications || [],
        conditions: user?.medical_info?.conditions || [],
      },
      preferences: {
        privacy: {
          shareWithProviders: user?.preferences?.privacy?.shareWithProviders ?? true,
          shareForResearch: user?.preferences?.privacy?.shareForResearch ?? false,
          marketingCommunications: user?.preferences?.privacy?.marketingCommunications ?? false,
        },
        notifications: {
          email: user?.preferences?.notifications?.email ?? true,
          sms: user?.preferences?.notifications?.sms ?? true,
          push: user?.preferences?.notifications?.push ?? true,
        },
      },
    });
    
    setIsEditing(false);
    setSaveError(null);
    setSaveSuccess(false);
    setHasUnsavedChanges(false);
  };

  const handleArrayAdd = (section: string, field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: [...(prev[section as keyof typeof prev] as any)[field], value.trim()],
        },
      }));
    }
  };

  const handleArrayRemove = (section: string, field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: (prev[section as keyof typeof prev] as any)[field].filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'health', label: 'Health Info', icon: Heart },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: SettingsIcon },
  ];

  const TwoFactorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Enable Two-Factor Authentication</h3>
            <button
              onClick={() => setShowTwoFactorModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <div className="text-xs text-gray-500">QR Code would appear here</div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
          </div>
          
          <Input label="Verification Code" placeholder="Enter 6-digit code" />
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowTwoFactorModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              enableTwoFactor();
              setShowTwoFactorModal(false);
            }}>
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const DeleteAccountModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-red-900">Delete Account</h3>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">This action cannot be undone</h4>
                <p className="text-sm text-red-800 mt-1">
                  Deleting your account will permanently remove all your health data, appointments, and medical records.
                </p>
              </div>
            </div>
          </div>
          
          <Input 
            label="Type 'DELETE' to confirm" 
            placeholder="DELETE"
          />
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your profile, privacy, and security settings
          </p>
        </div>
        
        {/* Save/Cancel Actions */}
        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Changes saved successfully!</span>
            </div>
          )}
          
          {saveError && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm">{saveError}</span>
            </div>
          )}
          
          {(isEditing || hasUnsavedChanges) && (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={!hasUnsavedChanges || isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
          
          {!isEditing && !hasUnsavedChanges && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-yellow-900 font-medium">You have unsaved changes</p>
                <p className="text-yellow-800 text-sm">Don't forget to save your changes before leaving this page.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-12 h-12 text-primary-600" />
                      </div>
                      {(isEditing || hasUnsavedChanges) && (
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</h4>
                      <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
                      {(isEditing || hasUnsavedChanges) && (
                        <div className="mt-2 space-x-2">
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-1" />
                            Upload
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      disabled={true} // Email should not be editable
                      leftIcon={<Mail className="w-4 h-4" />}
                      helperText="Contact support to change your email address"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<Phone className="w-4 h-4" />}
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<Calendar className="w-4 h-4" />}
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Name"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<User className="w-4 h-4" />}
                    />
                    <Input
                      label="Relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<Users className="w-4 h-4" />}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<Phone className="w-4 h-4" />}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="Street Address"
                      value={formData.address.street}
                      onChange={(e) => handleNestedInputChange('address', 'street', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                      leftIcon={<MapPin className="w-4 h-4" />}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        value={formData.address.city}
                        onChange={(e) => handleNestedInputChange('address', 'city', e.target.value)}
                        disabled={!isEditing && !hasUnsavedChanges}
                      />
                      <Input
                        label="State"
                        value={formData.address.state}
                        onChange={(e) => handleNestedInputChange('address', 'state', e.target.value)}
                        disabled={!isEditing && !hasUnsavedChanges}
                      />
                      <Input
                        label="ZIP Code"
                        value={formData.address.zipCode}
                        onChange={(e) => handleNestedInputChange('address', 'zipCode', e.target.value)}
                        disabled={!isEditing && !hasUnsavedChanges}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Health Info Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              {/* Medical Information */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Blood Type
                      </label>
                      <select
                        value={formData.medicalInfo.bloodType}
                        onChange={(e) => handleNestedInputChange('medicalInfo', 'bloodType', e.target.value)}
                        disabled={!isEditing && !hasUnsavedChanges}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                      >
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  {/* Allergies */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <div className="space-y-2">
                      {formData.medicalInfo.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-lg">
                          <span className="text-sm text-red-900">{allergy}</span>
                          {(isEditing || hasUnsavedChanges) && (
                            <button
                              onClick={() => handleArrayRemove('medicalInfo', 'allergies', index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {(isEditing || hasUnsavedChanges) && (
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add allergy..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleArrayAdd('medicalInfo', 'allergies', (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Current Medications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medications
                    </label>
                    <div className="space-y-2">
                      {formData.medicalInfo.medications.map((medication, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <span className="text-sm text-blue-900">{medication}</span>
                          {(isEditing || hasUnsavedChanges) && (
                            <button
                              onClick={() => handleArrayRemove('medicalInfo', 'medications', index)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {(isEditing || hasUnsavedChanges) && (
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add medication..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleArrayAdd('medicalInfo', 'medications', (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Medical Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions
                    </label>
                    <div className="space-y-2">
                      {formData.medicalInfo.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <span className="text-sm text-yellow-900">{condition}</span>
                          {(isEditing || hasUnsavedChanges) && (
                            <button
                              onClick={() => handleArrayRemove('medicalInfo', 'conditions', index)}
                              className="text-yellow-600 hover:text-yellow-800"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      {(isEditing || hasUnsavedChanges) && (
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add condition..."
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleArrayAdd('medicalInfo', 'conditions', (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Insurance Information</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Insurance Provider"
                      value={formData.insurance.provider}
                      onChange={(e) => handleNestedInputChange('insurance', 'provider', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                    />
                    <Input
                      label="Policy Number"
                      value={formData.insurance.policyNumber}
                      onChange={(e) => handleNestedInputChange('insurance', 'policyNumber', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                    />
                    <Input
                      label="Group Number"
                      value={formData.insurance.groupNumber}
                      onChange={(e) => handleNestedInputChange('insurance', 'groupNumber', e.target.value)}
                      disabled={!isEditing && !hasUnsavedChanges}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Share with Healthcare Providers</h4>
                        <p className="text-sm text-gray-600">Allow your healthcare providers to access your health data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.privacy.shareWithProviders}
                          onChange={(e) => handleNestedInputChange('preferences', 'privacy', {
                            ...formData.preferences.privacy,
                            shareWithProviders: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Research Participation</h4>
                        <p className="text-sm text-gray-600">Allow anonymized data to be used for medical research</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.privacy.shareForResearch}
                          onChange={(e) => handleNestedInputChange('preferences', 'privacy', {
                            ...formData.preferences.privacy,
                            shareForResearch: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Marketing Communications</h4>
                        <p className="text-sm text-gray-600">Receive promotional emails and health tips</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.privacy.marketingCommunications}
                          onChange={(e) => handleNestedInputChange('preferences', 'privacy', {
                            ...formData.preferences.privacy,
                            marketingCommunications: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Data Usage Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Key className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">
                          {user?.two_factor_enabled ? 'Enabled' : 'Add an extra layer of security'}
                        </p>
                      </div>
                    </div>
                    {user?.two_factor_enabled ? (
                      <Button variant="outline" size="sm" onClick={() => disableTwoFactor()}>
                        Disable
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setShowTwoFactorModal(true)}>
                        Enable
                      </Button>
                    )}
                  </div>

                  {/* Biometric Authentication */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <Fingerprint className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
                        <p className="text-sm text-gray-600">
                          {user?.biometric_enabled ? 'Enabled' : 'Use fingerprint or face recognition'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {user?.biometric_enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Login Activity</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-900">Current Session</p>
                        <p className="text-xs text-green-700">Chrome on macOS • San Francisco, CA</p>
                      </div>
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">iPhone App</p>
                        <p className="text-xs text-gray-600">2 hours ago • San Francisco, CA</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications.email}
                          onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                            ...formData.preferences.notifications,
                            email: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via text message</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications.sms}
                          onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                            ...formData.preferences.notifications,
                            sms: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications on your device</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.preferences.notifications.push}
                          onChange={(e) => handleNestedInputChange('preferences', 'notifications', {
                            ...formData.preferences.notifications,
                            push: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Notification Types</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Appointment Reminders', description: 'Get reminded about upcoming appointments' },
                    { name: 'Test Results', description: 'Notifications when new test results are available' },
                    { name: 'Medication Reminders', description: 'Reminders to take your medications' },
                    { name: 'Health Tips', description: 'Personalized health and wellness tips' },
                    { name: 'System Updates', description: 'Important updates about the platform' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Account Management</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Language</h4>
                      <p className="text-sm text-gray-600">Choose your preferred language</p>
                    </div>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Time Zone</h4>
                      <p className="text-sm text-gray-600">Pacific Standard Time (PST)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Export Data</h4>
                      <p className="text-sm text-gray-600">Download all your health data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Support</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help Center
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Terms of Service
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-800 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTwoFactorModal && <TwoFactorModal />}
      {showDeleteModal && <DeleteAccountModal />}
    </div>
  );
};