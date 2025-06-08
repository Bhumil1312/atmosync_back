import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import DeviceManagementPage from './pages/admin/DeviceManagementPage';
import AdminDeviceDetailPage from './pages/admin/DeviceDetailPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminSettingsPage from './pages/admin/SettingsPage';

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode; 
  requiredRole?: 'admin' | 'user';
}) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LoginPage />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <DashboardLayout isAdmin />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} />
        <Route path="devices" element={<DeviceManagementPage />} />
        <Route path="devices/:deviceId" element={<AdminDeviceDetailPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
      
      {/* Redirect any unknown routes */}
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
}

export default App;