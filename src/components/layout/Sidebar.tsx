import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Home,
  FileText,
  Calendar,
  Users,
  Activity,
  BookOpen,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Heart,
  Stethoscope,
  UserCheck,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const patientNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Test Results', href: '/results', icon: FileText },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Find Doctors', href: '/doctors', icon: Users },
  { name: 'Health Tracking', href: '/tracking', icon: Activity },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Community', href: '/community', icon: Heart },
];

const doctorNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Patients', href: '/patients', icon: UserCheck },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Lab Results', href: '/results', icon: FileText },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Resources', href: '/learn', icon: BookOpen },
];

const secondaryNavigation = [
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Privacy & Consent', href: '/privacy', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigation = user?.role === 'doctor' ? doctorNavigation : patientNavigation;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user?.role === 'doctor' ? (
                  <Stethoscope className="w-8 h-8 text-primary-600" />
                ) : (
                  <Heart className="w-8 h-8 text-primary-600" />
                )}
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">HealthWise</h1>
                <p className="text-sm text-gray-500">
                  {user?.role === 'doctor' ? 'Provider Portal' : 'Your Health, Simplified'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )
                  }
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Secondary Navigation */}
            <div className="px-4 py-6 border-t border-gray-200">
              <nav className="space-y-1">
                {secondaryNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      clsx(
                        'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )
                    }
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    <item.icon
                      className="mr-3 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};