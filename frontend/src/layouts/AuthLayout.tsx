import React from 'react';
import { Outlet } from 'react-router-dom';
import { Thermometer, Droplets } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="flex w-full">
        {/* Left side - Auth forms */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center px-6 py-12">
          <Outlet />
        </div>
        
        {/* Right side - Illustration/Brand section (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-primary-600 items-center justify-center">
          <div className="px-12 py-12 max-w-md text-white">
            <div className="flex items-center space-x-2 mb-8">
              <div className="flex -space-x-1">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Thermometer size={32} className="text-white" />
                </div>
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg relative left-2">
                  <Droplets size={32} className="text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold">SensorHub</h1>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Monitor your environment in real-time</h2>
            <p className="text-lg mb-8 text-white/80">
              Get accurate temperature and humidity readings from all your connected devices
              in one centralized dashboard.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-white mb-1 font-medium">Real-time Monitoring</div>
                <p className="text-white/70 text-sm">
                  Track environmental conditions as they happen with live updates.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-white mb-1 font-medium">Historical Data</div>
                <p className="text-white/70 text-sm">
                  Analyze trends with comprehensive historical data visualization.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-white mb-1 font-medium">Device Management</div>
                <p className="text-white/70 text-sm">
                  Easily add, configure, and monitor all your connected devices.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <div className="text-white mb-1 font-medium">Data Export</div>
                <p className="text-white/70 text-sm">
                  Export sensor data to CSV for further analysis and reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;