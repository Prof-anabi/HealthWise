import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  UserPlus, 
  Eye, 
  EyeOff,
  Stethoscope,
  Heart,
  UserCheck,
  Shield,
  Chrome,
  Apple,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';

const roleOptions = [
  {
    id: 'patient',
    name: 'Patient',
    description: 'I want to manage my health and connect with healthcare providers',
    icon: Heart,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconColor: 'text-blue-600'
  },
  {
    id: 'doctor',
    name: 'Doctor',
    description: 'I am a licensed physician providing medical care',
    icon: Stethoscope,
    color: 'bg-green-50 border-green-200 text-green-700',
    iconColor: 'text-green-600'
  },
  {
    id: 'nurse',
    name: 'Nurse',
    description: 'I am a registered nurse providing patient care',
    icon: UserCheck,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconColor: 'text-purple-600'
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'I manage healthcare systems and operations',
    icon: Shield,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconColor: 'text-orange-600'
  }
];

export const SignupForm: React.FC = () => {
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = React.useState<'role' | 'info' | 'credentials'>('role');
  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    marketingConsent: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleNextStep = () => {
    if (currentStep === 'role' && selectedRole) {
      setCurrentStep('info');
    } else if (currentStep === 'info') {
      setCurrentStep('credentials');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'credentials') {
      setCurrentStep('info');
    } else if (currentStep === 'info') {
      setCurrentStep('role');
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.agreeToTerms) return 'You must agree to the Terms of Service';
    if (!formData.agreeToPrivacy) return 'You must agree to the Privacy Policy';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const userData = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        role: selectedRole as 'patient' | 'doctor' | 'nurse' | 'admin',
        preferences: {
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          privacy: {
            shareWithProviders: true,
            shareForResearch: false,
            marketingCommunications: formData.marketingConsent,
          },
        },
      };

      await register(userData, formData.password);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: 'google' | 'apple') => {
    // In a real implementation, this would integrate with Supabase social auth
    console.log(`Signup with ${provider}`);
    setError(`${provider} signup will be implemented with Supabase social authentication`);
  };

  const selectedRoleData = roleOptions.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Join HealthWise
            </h1>
            <p className="text-gray-600">
              Create your account to start managing your health journey
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mt-6">
              {['role', 'info', 'credentials'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step 
                      ? 'bg-primary-600 text-white' 
                      : ['role', 'info', 'credentials'].indexOf(currentStep) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {['role', 'info', 'credentials'].indexOf(currentStep) > index ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      ['role', 'info', 'credentials'].indexOf(currentStep) > index 
                        ? 'bg-green-500' 
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-6 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-danger-600 mr-2" />
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              </div>
            )}

            {/* Step 1: Role Selection */}
            {currentStep === 'role' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What best describes your role?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleOptions.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                          selectedRole === role.id
                            ? role.color
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${
                            selectedRole === role.id ? 'bg-white' : 'bg-gray-100'
                          }`}>
                            <role.icon className={`w-5 h-5 ${
                              selectedRole === role.id ? role.iconColor : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{role.name}</h4>
                            <p className="text-sm text-gray-600">{role.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleNextStep}
                    disabled={!selectedRole}
                    className="px-8"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 'info' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h3>
                  {selectedRoleData && (
                    <Badge variant="info" className="flex items-center">
                      <selectedRoleData.icon className="w-3 h-3 mr-1" />
                      {selectedRoleData.name}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name *"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    leftIcon={<User className="w-4 h-4" />}
                    placeholder="Enter your first name"
                    required
                  />
                  
                  <Input
                    label="Last Name *"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    leftIcon={<User className="w-4 h-4" />}
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <Input
                  label="Email Address *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  leftIcon={<Mail className="w-4 h-4" />}
                  placeholder="Enter your email address"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    leftIcon={<Phone className="w-4 h-4" />}
                    placeholder="+1 (555) 123-4567"
                  />
                  
                  <Input
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNextStep}>
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Credentials & Consent */}
            {currentStep === 'credentials' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account Security
                  </h3>
                  {selectedRoleData && (
                    <Badge variant="info" className="flex items-center">
                      <selectedRoleData.icon className="w-3 h-3 mr-1" />
                      {selectedRoleData.name}
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      leftIcon={<Lock className="w-4 h-4" />}
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm Password *"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      leftIcon={<Lock className="w-4 h-4" />}
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-center">
                      <CheckCircle className={`w-3 h-3 mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-3 h-3 mr-2 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className={`w-3 h-3 mr-2 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                      One number
                    </li>
                  </ul>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                      required
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-500 underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-500 underline">
                        Privacy Policy
                      </Link>
                      *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                      required
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I understand how my health data will be used and protected under HIPAA *
                    </span>
                  </label>

                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="marketingConsent"
                      checked={formData.marketingConsent}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I would like to receive health tips and product updates via email (optional)
                    </span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="px-8"
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            )}

            {/* Social Signup Options (shown on credentials step) */}
            {currentStep === 'credentials' && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSocialSignup('google')}
                  >
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleSocialSignup('apple')}
                  >
                    <Apple className="w-4 h-4 mr-2" />
                    Apple
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-4">
            Protected by industry-standard encryption and HIPAA compliance
          </p>
          
          {/* Bolt.new Badge */}
          <div className="flex justify-center">
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <img
                src="/src/assets/black_circle_360x360.svg"
                alt="Built with Bolt.new"
                className="h-12 w-12"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};