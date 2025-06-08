import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Thermometer, 
  Droplets, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Users,
  Database
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isAdmin = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle sidebar toggle for mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Navigation items based on role
  const navItems = isAdmin 
    ? [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <Database size={20} />, label: 'Devices', path: '/admin/devices' },
        // { icon: <Users size={20} />, label: 'User Management', path: '/admin/users' },
        // { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
      ]
    : [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
      ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile, shown with overlay when toggled */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button - mobile only */}
        <button
          className="absolute right-4 top-4 lg:hidden"
          onClick={toggleMobileMenu}
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Logo */}
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-1">
              <div className="p-1.5 bg-primary-100 rounded-lg">
                <Thermometer size={20} className="text-primary-700" />
              </div>
              <div className="p-1.5 bg-secondary-100 rounded-lg relative left-1">
                <Droplets size={20} className="text-secondary-700" />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900">SensorHub</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout button at bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4">
          <button
            onClick={logout}
            className="flex w-full items-center rounded-md px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* Mobile menu button */}
            <button
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu size={24} />
            </button>

            {/* Page title - can be dynamic based on current route */}
            <h1 className="text-xl font-semibold text-gray-800 lg:ml-0">
              {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
            </h1>

            {/* User dropdown */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center">
                <span className="text-primary-700 font-medium text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;