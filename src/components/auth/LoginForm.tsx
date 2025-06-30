import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Fingerprint, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = React.useState({
    email: 'patient@healthwise.com',
    password: 'demo123',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDemoLogin = async (role: 'patient' | 'doctor' | 'nurse') => {
    setIsLoading(true);
    setError('');
    
    const credentials = {
      patient: { email: 'patient@healthwise.com', password: 'demo123' },
      doctor: { email: 'doctor@healthwise.com', password: 'demo123' },
      nurse: { email: 'nurse@healthwise.com', password: 'demo123' },
    };
    
    try {
      await login(credentials[role].email, credentials[role].password);
    } catch (err) {
      setError('Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to HealthWise
            </h1>
            <p className="text-gray-600">
              Sign in to access your health dashboard
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Demo Credentials Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-3">Demo Accounts</h4>
              
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <div className="text-sm text-blue-800 space-y-1 mb-2">
                    <p><strong>Patient Account:</strong></p>
                    <p>Email: patient@healthwise.com</p>
                    <p>Password: demo123</p>
                  </div>
                  <Button 
                    onClick={() => handleDemoLogin('patient')}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    isLoading={isLoading}
                  >
                    Login as Patient
                  </Button>
                </div>
                
                <div className="p-3 bg-white rounded border">
                  <div className="text-sm text-blue-800 space-y-1 mb-2">
                    <p><strong>Doctor Account:</strong></p>
                    <p>Email: doctor@healthwise.com</p>
                    <p>Password: demo123</p>
                  </div>
                  <Button 
                    onClick={() => handleDemoLogin('doctor')}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-green-300 text-green-700 hover:bg-green-100"
                    isLoading={isLoading}
                  >
                    Login as Doctor
                  </Button>
                </div>

                <div className="p-3 bg-white rounded border">
                  <div className="text-sm text-blue-800 space-y-1 mb-2">
                    <p><strong>Nurse Account:</strong></p>
                    <p>Email: nurse@healthwise.com</p>
                    <p>Password: demo123</p>
                  </div>
                  <Button 
                    onClick={() => handleDemoLogin('nurse')}
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                    isLoading={isLoading}
                  >
                    Login as Nurse
                  </Button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                leftIcon={<Mail className="w-4 h-4" />}
                placeholder="Enter your email"
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                leftIcon={<Lock className="w-4 h-4" />}
                placeholder="Enter your password"
                required
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Fingerprint className="w-4 h-4 mr-2" />
                  Biometric
                </Button>
                <Button variant="outline" className="w-full">
                  <Smartphone className="w-4 h-4 mr-2" />
                  2FA
                </Button>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up
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
                
                src="https://drive.google.com/file/d/1NUs4zAKlQGbmIohbEwd-LNOpxu0waMAZ/view?usp=drive_link"
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