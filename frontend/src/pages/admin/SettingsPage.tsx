import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Key, Shield, User } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold">Profile Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="input mt-1 w-full"
                value={user?.name}
                onChange={() => {}}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="input mt-1 w-full"
                value={user?.email}
                onChange={() => {}}
                placeholder="your.email@example.com"
              />
            </div>
            
            <button className="btn-primary btn-md w-full">
              Update Profile
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Key className="h-6 w-6 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                className="input mt-1 w-full"
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="input mt-1 w-full"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                className="input mt-1 w-full"
                placeholder="Confirm new password"
              />
            </div>
            
            <button className="btn-primary btn-md w-full">
              Change Password
            </button>
          </div>
        </div>

        {/* System Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <Shield className="h-6 w-6 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold">System Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
              <input
                type="number"
                className="input mt-1 w-full"
                placeholder="30"
              />
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600" />
                <span className="text-sm text-gray-700">Enable two-factor authentication</span>
              </label>
            </div>
            
            <button className="btn-primary btn-md w-full">
              Save System Settings
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-success-100 rounded-lg">
              <Bell className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600" />
                <span className="text-sm text-gray-700">Email notifications for system alerts</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600" />
                <span className="text-sm text-gray-700">Daily report summary</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-primary-600" />
                <span className="text-sm text-gray-700">User activity notifications</span>
              </label>
            </div>
            
            <button className="btn-primary btn-md w-full">
              Update Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;