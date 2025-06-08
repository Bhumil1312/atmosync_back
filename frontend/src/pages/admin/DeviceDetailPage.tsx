import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { Device, SensorReading } from '../../types';
import SensorChart from '../../components/ui/SensorChart';
import StatusBadge from '../../components/ui/StatusBadge';
import DeviceForm from '../../components/devices/DeviceForm';
import { 
  Thermometer, 
  Droplets, 
  ArrowLeft, 
  Download,
  Power,
  PowerOff,
  Edit,
  Trash2
} from 'lucide-react';
import DeleteDeviceModal from '../../components/devices/DeleteDeviceModal';

const AdminDeviceDetailPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  
  const [device, setDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const loadDeviceData = async () => {
      if (!deviceId) return;
      
      setIsLoading(true);
      try {
        // Fetch device details
        const deviceData = await api.getDevice(deviceId);
        setDevice(deviceData);
        
        // Fetch sensor readings
        const readings = await api.getSensorData(deviceId, timeRange);
        setSensorData(readings);
      } catch (error) {
        console.error('Failed to load device data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDeviceData();
  }, [deviceId, timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };
  
  // Handle power toggle
  const handleTogglePower = async () => {
    if (!device || isToggling) return;
    
    setIsToggling(true);
    try {
      const newStatus = device.last_status === 'ON' ? 'OFF' : 'ON';
      const updatedDevice = await api.updateDeviceStatus(device.device_id, newStatus);
      setDevice(updatedDevice);
    } catch (error) {
      console.error('Failed to toggle device:', error);
    } finally {
      setIsToggling(false);
    }
  };
  
  // Handle CSV export
  const handleExportCSV = async () => {
    if (!deviceId || isExporting) return;
    
    setIsExporting(true);
    try {
      const csvData = await api.exportSensorDataCSV(deviceId, timeRange);
      
      // Create a blob and trigger download
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `device-${deviceId}-data-${timeRange}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  // Handle device update
  const handleUpdateDevice = async (data: Omit<Device, 'device_id' | 'status'>) => {
    if (!device) return;
    
    try {
      const updatedDevice = await api.updateDevice(device.device_id, data);
      setDevice(updatedDevice);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };
  
  // Handle device deletion
  const handleDeleteDevice = async () => {
    if (!device) return;
    
    try {
      await api.deleteDevice(device.device_id);
      navigate('/admin/devices', { replace: true });
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  };

  // Get current reading
  const currentReading = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse-slow">Loading device details...</div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Device not found</h2>
        <p className="text-gray-600 mb-6">
          The device you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Link to="/admin/devices" className="btn-primary btn-md">
          Return to Devices
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="btn-ghost btn-sm mr-2"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{device.name}</h2>
            <div className="flex items-center mt-1">
              <StatusBadge status={device.status} type="status" />
              <span className="mx-2 text-gray-300">•</span>
              <p className="text-sm text-gray-600">{device.installation_location}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="btn-outline btn-sm"
          >
            {isExporting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </span>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Export CSV
              </>
            )}
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            className="btn-outline btn-sm"
          >
            <Edit size={16} className="mr-2" />
            Edit Device
          </button>
          
          <button
            onClick={() => setIsDeleting(true)}
            className="btn-sm bg-error-600 hover:bg-error-700 text-white"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </button>
          
          <button
            onClick={handleTogglePower}
            disabled={isToggling}
            className={`btn-sm ${
              device.last_status === 'ON'
                ? 'bg-success-600 hover:bg-success-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {isToggling ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              <>
                {device.last_status === 'ON' ? (
                  <>
                    <Power size={16} className="mr-2" />
                    ON
                  </>
                ) : (
                  <>
                    <PowerOff size={16} className="mr-2" />
                    OFF
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Device Info Card */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Device Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Device ID</p>
              <p className="text-gray-900">{device.device_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">MAC Address</p>
              <p className="text-gray-900">{device.mac_address}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Installation Location</p>
              <p className="text-gray-900">{device.installation_location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lab Incharge</p>
              <p className="text-gray-900">{device.lab_incharge}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-error-100 rounded-full">
              <Thermometer size={24} className="text-error-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Temperature</p>
              <p className="text-3xl font-semibold text-gray-900">
                {currentReading ? `${currentReading.temperature}°C` : '--'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-primary-100 rounded-full">
              <Droplets size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Humidity</p>
              <p className="text-3xl font-semibold text-gray-900">
                {currentReading ? `${currentReading.humidity}%` : '--'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sensor Data Chart */}
      <SensorChart
        data={sensorData}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        title="Historical Sensor Data"
      />
      
      {/* Edit Device Modal */}
      {isEditing && (
        <DeviceForm
          title={`Edit Device: ${device.name}`}
          initialData={device}
          onSubmit={handleUpdateDevice}
          onCancel={() => setIsEditing(false)}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <DeleteDeviceModal
          deviceName={device.name}
          onDelete={handleDeleteDevice}
          onCancel={() => setIsDeleting(false)}
          isDeleting={false}
        />
      )}
    </div>
  );
};

export default AdminDeviceDetailPage;