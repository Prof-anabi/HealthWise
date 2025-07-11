import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Dashboard } from './pages/Dashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { NurseDashboard } from './pages/NurseDashboard';
import { TestResults } from './pages/TestResults';
import { Appointments } from './pages/Appointments';
import { Doctors } from './pages/Doctors';
import { Tracking } from './pages/Tracking';
import { Settings } from './pages/Settings';
import { Messages } from './pages/Messages';
import { Learn } from './pages/Learn';
import { Community } from './pages/Community';
import { Privacy } from './pages/Privacy';
import { Help } from './pages/Help';
import { Notifications } from './pages/Notifications';

function App() {
  const authValue = useAuthProvider();

  console.log('App render - Auth state:', {
    isLoading: authValue.isLoading,
    isAuthenticated: authValue.isAuthenticated,
    user: authValue.user?.email
  });

  if (authValue.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading HealthWise...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="App">
          {!authValue.isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            <Layout>
              <Routes>
                {/* Route based on user role */}
                <Route 
                  path="/dashboard" 
                  element={
                    authValue.user?.role === 'doctor' ? 
                    <DoctorDashboard /> : 
                    authValue.user?.role === 'nurse' ?
                    <NurseDashboard /> :
                    <Dashboard />
                  } 
                />
                <Route path="/results" element={<TestResults />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/community" element={<Community />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;