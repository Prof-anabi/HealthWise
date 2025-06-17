import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { NurseDashboard } from './pages/NurseDashboard';
import { TestResults } from './pages/TestResults';
import { Appointments } from './pages/Appointments';
import { Doctors } from './pages/Doctors';
import { Tracking } from './pages/Tracking';

// Placeholder components for other routes
const Learn = () => <div className="p-6"><h1 className="text-2xl font-bold">Learn</h1><p className="text-gray-600 mt-2">Educational resources coming soon...</p></div>;
const Community = () => <div className="p-6"><h1 className="text-2xl font-bold">Community</h1><p className="text-gray-600 mt-2">Support groups and forums coming soon...</p></div>;
const Notifications = () => <div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-gray-600 mt-2">Notification settings coming soon...</p></div>;
const Privacy = () => <div className="p-6"><h1 className="text-2xl font-bold">Privacy & Consent</h1><p className="text-gray-600 mt-2">Privacy management coming soon...</p></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-gray-600 mt-2">Account settings coming soon...</p></div>;
const Help = () => <div className="p-6"><h1 className="text-2xl font-bold">Help & Support</h1><p className="text-gray-600 mt-2">Help center coming soon...</p></div>;

function App() {
  const authValue = useAuthProvider();

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