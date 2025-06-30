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
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching profile for user ID:', userId);
      
      // Add timeout to the query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000);
      });

      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.error('❌ Profile fetch error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // If profile doesn't exist, create a basic one
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating basic profile...');
          
          // Get user email from auth
          const { data: { user: authUser } } = await supabase.auth.getUser();
          
          if (authUser?.email) {
            const newProfile = {
              id: userId,
              email: authUser.email,
              first_name: 'User',
              last_name: 'Demo',
              role: 'patient' as const,
              preferences: {
                privacy: {
                  shareForResearch: false,
                  shareWithProviders: true,
                  marketingCommunications: false
                },
                notifications: {
                  sms: true,
                  push: true,
                  email: true
                }
              }
            };

            console.log('🔨 Creating new profile:', newProfile);
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();

            if (createError) {
              console.error('❌ Failed to create profile:', createError);
              throw createError;
            }

            console.log('✅ Profile created successfully:', createdProfile);
            setUser(createdProfile);
            return createdProfile;
          }
        }
        
        throw error;
      }

      console.log('✅ Profile fetched successfully:', {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        role: data.role
      });
      
      setUser(data);
      return data;
    } catch (error) {
      console.error('💥 Error in fetchUserProfile:', error);
      
      // If it's a timeout or connection error, don't sign out the user
      if (error instanceof Error && error.message.includes('Profile fetch timeout')) {
        console.log('⏰ Profile fetch timed out, but keeping user signed in');
        setIsLoading(false);
        return null;
      }
      
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    console.log('🚀 Auth hook initializing...');

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('⏰ Auth check timeout - setting loading to false');
        setIsLoading(false);
        setIsInitialized(true);
      }
    }, 15000); // 15 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 Checking for existing session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) {
          console.log('🚫 Component unmounted, aborting session check');
          return;
        }
        
        if (error) {
          console.error('❌ Session error:', error);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }
        
        if (session?.user) {
          console.log('👤 Found existing session for user:', session.user.id);
          console.log('📧 User email:', session.user.email);
          
          try {
            await fetchUserProfile(session.user.id);
            console.log('✅ Profile loaded successfully');
          } catch (profileError) {
            console.error('❌ Failed to load profile:', profileError);
          }
        } else {
          console.log('🚫 No existing session found');
        }
        
        setIsLoading(false);
        setIsInitialized(true);
      } catch (error) {
        console.error('💥 Error getting initial session:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    console.log('👂 Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) {
          console.log('🚫 Component unmounted, ignoring auth change');
          return;
        }
        
        console.log('🔄 Auth state changed:', event);
        console.log('👤 Session user:', session?.user?.id);
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ User signed in, fetching profile...');
            setIsLoading(true);
            await fetchUserProfile(session.user.id);
            setIsLoading(false);
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 User signed out');
            setUser(null);
            setIsLoading(false);
          } else if (event === 'TOKEN_REFRESHED' && session?.user) {
            console.log('🔄 Token refreshed');
            // Only fetch profile if we don't have user data
            if (!user) {
              console.log('👤 No user data, fetching profile after token refresh...');
              await fetchUserProfile(session.user.id);
            }
          }
          
          if (!isInitialized) {
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('💥 Error handling auth state change:', error);
          setIsLoading(false);
        }
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth hook...');
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to prevent loops

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Login error:', error);
        setIsLoading(false);
        throw error;
      }

      console.log('✅ Login successful for user:', data.user?.id);
      console.log('📧 User email:', data.user?.email);
      
      // The auth state change listener will handle profile fetching
      // But let's also try to fetch it directly to be sure
      if (data.user) {
        try {
          console.log('🔍 Fetching profile immediately after login...');
          await fetchUserProfile(data.user.id);
          setIsLoading(false);
        } catch (profileError) {
          console.error('❌ Failed to fetch profile after login:', profileError);
          setIsLoading(false);
          // Don't throw the error here, let the user proceed
        }
      }
    } catch (error) {
      console.error('💥 Login failed:', error);
      setIsLoading(false);
      handleSupabaseError(error);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      console.log('📝 Attempting registration for:', userData.email);

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
        console.log('✅ User registered, creating profile...');
        
        // Create profile
        const profileData = {
          id: authData.user.id,
          email: userData.email,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          date_of_birth: userData.date_of_birth,
          phone: userData.phone,
          role: userData.role || 'patient',
          preferences: userData.preferences || {
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

        if (profileError) {
          console.error('❌ Profile creation error:', profileError);
          throw profileError;
        }
        
        console.log('✅ Profile created successfully');
        
        // Fetch the created profile
        await fetchUserProfile(authData.user.id);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('💥 Registration failed:', error);
      setIsLoading(false);
      handleSupabaseError(error);
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Logging out user');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsInitialized(true);
    } catch (error) {
      console.error('💥 Logout error:', error);
      handleSupabaseError(error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error('No user logged in');

      console.log('📝 Updating user profile...');
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Profile updated successfully');
      setUser(data);
    } catch (error) {
      console.error('💥 Profile update error:', error);
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

  // Debug logging
  console.log('🔍 Auth state:', {
    isLoading,
    isAuthenticated: !!user,
    userEmail: user?.email,
    userRole: user?.role,
    isInitialized
  });

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