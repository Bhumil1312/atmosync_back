import React, { useState, useEffect } from 'react';
import { Device, SensorReading } from '../../types';
import { api } from '../../utils/api';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  Power, 
  Thermometer, 
  Droplets,
  InfoIcon,
  Database
} from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [chartData, setChartData] = useState<SensorReading[]>([]);
  const [timeRange, setTimeRange] = useState('24h');

  // Load all devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        setIsLoading(true);
        const allDevices = await api.getDevices();
        setDevices(allDevices);
        
        // Select first device by default if available
        if (allDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(allDevices[0].device_id);
        }
      } catch (error) {
        console.error('Failed to load devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, []);

  // Load chart data for selected device
  useEffect(() => {
    const loadChartData = async () => {
      if (selectedDevice) {
        try {
          const data = await api.getSensorData(selectedDevice, timeRange);
          setChartData(data);
        } catch (error) {
          console.error('Failed to load sensor data:', error);
        }
      }
    };

    if (selectedDevice) {
      loadChartData();
    }
  }, [selectedDevice, timeRange]);

  // Calculate overview statistics
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const activeDevices = devices.filter(d => d.last_status === 'ON').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-slow">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Devices</p>
              <p className="text-3xl font-semibold text-gray-900 mt-1">{totalDevices}</p>
            </div>
            <div className="p-2 bg-primary-100 rounded-full">
              <Database size={20} className="text-primary-700" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/admin/devices" 
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all devices
            </Link>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Online</p>
              <p className="text-3xl font-semibold text-success-600 mt-1">{onlineDevices}</p>
            </div>
            <div className="p-2 bg-success-100 rounded-full">
              <Activity size={20} className="text-success-700" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {Math.round((onlineDevices / totalDevices) * 100) || 0}% of devices online
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Offline</p>
              <p className="text-3xl font-semibold text-gray-600 mt-1">{offlineDevices}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-full">
              <AlertTriangle size={20} className="text-gray-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {Math.round((offlineDevices / totalDevices) * 100) || 0}% of devices offline
            </p>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Active (ON)</p>
              <p className="text-3xl font-semibold text-success-600 mt-1">{activeDevices}</p>
            </div>
            <div className="p-2 bg-success-100 rounded-full">
              <Power size={20} className="text-success-700" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {Math.round((activeDevices / totalDevices) * 100) || 0}% of devices powered on
            </p>
          </div>
        </div>
      </div>

      {/* Recently Active Devices */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recently Active Devices</h3>
        
        {devices.length === 0 ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <InfoIcon size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No devices available</p>
            <Link to="/admin/devices" className="btn-primary btn-md">
              Add Devices
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.slice(0, 8).map((device) => (
              <Link 
                key={device.device_id}
                to={`/admin/devices/${device.device_id}`}
                className="block group"
              >
                <div className="border rounded-lg p-4 hover:shadow-card-hover transition-shadow bg-white">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900 truncate" title={device.name}>
                      {device.name}
                    </p>
                    <div className={`w-2 h-2 rounded-full ${
                      device.status === 'online' ? 'bg-success-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1 truncate" title={device.installation_location}>
                    {device.installation_location}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-sm">
                      <Thermometer size={16} className="text-error-500 mr-1" />
                      <span>---°C</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Droplets size={16} className="text-primary-500 mr-1" />
                      <span>---%</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {devices.length > 0 && (
          <div className="mt-6 text-center">
            <Link 
              to="/admin/devices"
              className="btn-outline btn-md"
            >
              View All Devices
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;