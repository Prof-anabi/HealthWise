import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface User extends Profile {
  // Add any additional user properties if needed
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<void>;
  enableTwoFactor: () => Promise<string>;
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

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      handleSupabaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);

      if (!userData.email) {
        throw new Error('Email is required');
      }

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const profileData = {
          id: authData.user.id,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          date_of_birth: userData.date_of_birth,
          phone: userData.phone,
          role: userData.role || 'patient',
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
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) throw profileError;

        await fetchUserProfile(authData.user.id);
      }
    } catch (error) {
      handleSupabaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      handleSupabaseError(error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      handleSupabaseError(error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  };

  const verifyTwoFactor = async (code: string) => {
    // Mock implementation - in real app, verify with Supabase
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const enableTwoFactor = async (): Promise<string> => {
    try {
      if (!user) throw new Error('No user logged in');

      await updateUser({ two_factor_enabled: true });
      return 'mock_qr_code_url';
    } catch (error) {
      handleSupabaseError(error);
      return '';
    }
  };

  const disableTwoFactor = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      await updateUser({ two_factor_enabled: false });
    } catch (error) {
      handleSupabaseError(error);
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