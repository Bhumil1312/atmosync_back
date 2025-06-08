import React from 'react';
import { Link } from 'react-router-dom';
import { Device, SensorReading } from '../../types';
import { Thermometer, Droplets, ExternalLink } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

interface DeviceCardProps {
  device: Device;
  currentReading?: SensorReading;
  baseUrl: string; // Base URL for navigation (different for admin/user)
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  currentReading,
  baseUrl,
}) => {
  const { temperature, humidity } = currentReading || { temperature: '--', humidity: '--' };
  
  return (
    <div className="card overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Card Header with status indicator */}
      <div className="flex items-center justify-between bg-gray-50 p-4 border-b">
        <h3 className="font-medium text-gray-900">{device.name}</h3>
        <div className="flex items-center space-x-2">
          <StatusBadge status={device.status} type="status" size="sm" />
          <StatusBadge status={device.last_status} type="power" size="sm" />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Location info */}
          <div className="text-sm text-gray-600">
            <p><span className="font-medium">Location:</span> {device.installation_location}</p>
            <p><span className="font-medium">Lab Incharge:</span> {device.lab_incharge}</p>
          </div>
          
          {/* Current readings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 bg-primary-50 p-3 rounded-md">
              <Thermometer className="text-error-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Temperature</p>
                <p className="text-lg font-medium text-gray-900">
                  {temperature !== '--' ? `${temperature}°C` : '--'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-secondary-50 p-3 rounded-md">
              <Droplets className="text-primary-600" size={20} />
              <div>
                <p className="text-xs text-gray-600">Humidity</p>
                <p className="text-lg font-medium text-gray-900">
                  {humidity !== '--' ? `${humidity}%` : '--'}
                </p>
              </div>
            </div>
          </div>
          
          {/* View details link */}
          <Link 
            to={`${baseUrl}/devices/${device.device_id}`} 
            className="btn-outline btn-sm w-full flex items-center justify-center"
          >
            <span>View Details</span>
            <ExternalLink size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;