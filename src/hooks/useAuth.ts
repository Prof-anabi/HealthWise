import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
  enableTwoFactor: () => Promise<string>; // Returns QR code
  disableTwoFactor: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default test credentials
const DEFAULT_CREDENTIALS = {
  patient: {
    email: 'patient@healthwise.com',
    password: 'demo123',
  },
  doctor: {
    email: 'doctor@healthwise.com',
    password: 'demo123',
  },
  nurse: {
    email: 'nurse@healthwise.com',
    password: 'demo123',
  }
};

// Mock implementation for demonstration
export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored auth token
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('healthwise_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockUser: User;
      
      // Check for doctor credentials
      if (email === DEFAULT_CREDENTIALS.doctor.email && password === DEFAULT_CREDENTIALS.doctor.password) {
        mockUser = {
          id: '2',
          email,
          firstName: 'Dr. Michael',
          lastName: 'Smith',
          dateOfBirth: '1980-01-01',
          phone: '+1234567890',
          role: 'doctor',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              sms: true,
              push: true,
            },
            privacy: {
              shareWithProviders: true,
              shareForResearch: false,
              marketingCommunications: false,
            },
          },
          twoFactorEnabled: false,
          biometricEnabled: false,
          consentHistory: [],
        };
      }
      // Check for nurse credentials
      else if (email === DEFAULT_CREDENTIALS.nurse.email && password === DEFAULT_CREDENTIALS.nurse.password) {
        mockUser = {
          id: '3',
          email,
          firstName: 'Jessica',
          lastName: 'Martinez',
          dateOfBirth: '1985-03-15',
          phone: '+1234567891',
          role: 'nurse',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              sms: true,
              push: true,
            },
            privacy: {
              shareWithProviders: true,
              shareForResearch: false,
              marketingCommunications: false,
            },
          },
          twoFactorEnabled: false,
          biometricEnabled: false,
          consentHistory: [],
        };
      }
      // Check for patient credentials or accept any email/password for demo
      else if ((email === DEFAULT_CREDENTIALS.patient.email && password === DEFAULT_CREDENTIALS.patient.password) || 
               (email && password)) {
        mockUser = {
          id: '1',
          email,
          firstName: email === DEFAULT_CREDENTIALS.patient.email ? 'Sarah' : 'John',
          lastName: email === DEFAULT_CREDENTIALS.patient.email ? 'Johnson' : 'Doe',
          dateOfBirth: '1990-01-01',
          phone: '+1234567890',
          role: 'patient',
          preferences: {
            language: 'en',
            notifications: {
              email: true,
              sms: true,
              push: true,
            },
            privacy: {
              shareWithProviders: true,
              shareForResearch: false,
              marketingCommunications: false,
            },
          },
          twoFactorEnabled: false,
          biometricEnabled: false,
          consentHistory: [],
        };
      } else {
        throw new Error('Invalid credentials');
      }
      
      setUser(mockUser);
      localStorage.setItem('healthwise_user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        dateOfBirth: userData.dateOfBirth!,
        phone: userData.phone!,
        role: 'patient',
        preferences: {
          language: 'en',
          notifications: {
            email: true,
            sms: true,
            push: true,
          },
          privacy: {
            shareWithProviders: true,
            shareForResearch: false,
            marketingCommunications: false,
          },
        },
        twoFactorEnabled: false,
        biometricEnabled: false,
        consentHistory: [],
      };
      
      setUser(newUser);
      localStorage.setItem('healthwise_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthwise_user');
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('healthwise_user', JSON.stringify(updatedUser));
  };

  const resetPassword = async (email: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const verifyTwoFactor = async (code: string) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const enableTwoFactor = async (): Promise<string> => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (user) {
      await updateUser({ twoFactorEnabled: true });
    }
    return 'mock_qr_code_url';
  };

  const disableTwoFactor = async () => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (user) {
      await updateUser({ twoFactorEnabled: false });
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    resetPassword,
    verifyTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
  };
};