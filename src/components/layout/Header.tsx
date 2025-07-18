import React from 'react';
import { Menu, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowUserMenu(false);
    navigate('/settings');
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setShowUserMenu(false);
    await logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left side - Menu button and breadcrumb */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 lg:ml-0">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome back, {user?.first_name}!
            </h2>
            <p className="text-sm text-gray-500">
              Stay on top of your health journey
            </p>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center space-x-3 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={handleSettingsClick}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};