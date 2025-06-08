import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Device } from '../../types';
import { api } from '../../utils/api';
import { DataTable } from '../../components/ui/DataTable';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Power,
  PowerOff
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import DeviceForm from '../../components/devices/DeviceForm';
import DeleteDeviceModal from '../../components/devices/DeleteDeviceModal';

type DeviceAction = 
  | { type: 'edit'; device: Device }
  | { type: 'delete'; device: Device }
  | { type: 'create' }
  | null;

const DeviceManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [action, setAction] = useState<DeviceAction>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load all devices
  useEffect(() => {
    const loadDevices = async () => {
      try {
        setIsLoading(true);
        const allDevices = await api.getDevices();
        setDevices(allDevices);
      } catch (error) {
        console.error('Failed to load devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDevices();
  }, []);
  
  // Handle device creation
  const handleCreateDevice = async (data: Omit<Device, 'device_id' | 'status'>) => {
    setIsSubmitting(true);
    try {
      const newDevice = await api.createDevice(data);
      setDevices([...devices, newDevice]);
      setAction(null);
    } catch (error) {
      console.error('Failed to create device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle device update
  const handleUpdateDevice = async (data: Omit<Device, 'device_id' | 'status'>) => {
    if (action?.type !== 'edit') return;
    
    setIsSubmitting(true);
    try {
      const updatedDevice = await api.updateDevice(action.device.device_id, data);
      setDevices(devices.map(d => d.device_id === updatedDevice.device_id ? updatedDevice : d));
      setAction(null);
    } catch (error) {
      console.error('Failed to update device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle device deletion
  const handleDeleteDevice = async () => {
    if (action?.type !== 'delete') return;
    
    setIsSubmitting(true);
    try {
      await api.deleteDevice(action.device.device_id);
      setDevices(devices.filter(d => d.device_id !== action.device.device_id));
      setAction(null);
    } catch (error) {
      console.error('Failed to delete device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle power toggle
  const handleTogglePower = async (deviceId: string, currentStatus: 'ON' | 'OFF') => {
    try {
      const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
      const updatedDevice = await api.updateDeviceStatus(deviceId, newStatus);
      setDevices(devices.map(d => d.device_id === updatedDevice.device_id ? updatedDevice : d));
    } catch (error) {
      console.error('Failed to toggle device power:', error);
    }
  };
  
  // Handle view device details
  const handleViewDevice = (deviceId: string) => {
    navigate(`/admin/devices/${deviceId}`);
  };

  // Table columns
  const columns = [
    {
      accessorKey: 'name',
      header: 'Device Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'device_id',
      header: 'Device ID',
    },
    {
      accessorKey: 'installation_location',
      header: 'Location',
    },
    {
      accessorKey: 'lab_incharge',
      header: 'Lab Incharge',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <StatusBadge status={row.original.status} type="status" />
          <StatusBadge status={row.original.last_status} type="power" />
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const device = row.original;
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleViewDevice(device.device_id)}
              className="btn-ghost btn-sm"
              title="View details"
            >
              <ExternalLink size={16} />
            </button>
            <button
              onClick={() => handleTogglePower(device.device_id, device.last_status)}
              className={`btn-sm ${
                device.last_status === 'ON' 
                  ? 'bg-success-100 text-success-700 hover:bg-success-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-md`}
              title={`Turn ${device.last_status === 'ON' ? 'OFF' : 'ON'}`}
            >
              {device.last_status === 'ON' ? (
                <Power size={16} />
              ) : (
                <PowerOff size={16} />
              )}
            </button>
            <button
              onClick={() => setAction({ type: 'edit', device })}
              className="btn-ghost btn-sm"
              title="Edit device"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setAction({ type: 'delete', device })}
              className="text-error-600 hover:text-error-800 transition-colors btn-sm btn-ghost"
              title="Delete device"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Device Management</h2>
          <p className="text-gray-600">View and manage all sensor devices</p>
        </div>
        <button
          onClick={() => setAction({ type: 'create' })}
          className="btn-primary btn-md inline-flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add New Device
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse-slow">Loading devices...</div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={devices}
          searchPlaceholder="Search devices..."
        />
      )}

      {/* Device form modal */}
      {action?.type === 'create' && (
        <DeviceForm
          onSubmit={handleCreateDevice}
          onCancel={() => setAction(null)}
          title="Add New Device"
        />
      )}
      
      {action?.type === 'edit' && (
        <DeviceForm
          onSubmit={handleUpdateDevice}
          onCancel={() => setAction(null)}
          initialData={action.device}
          title={`Edit Device: ${action.device.name}`}
        />
      )}
      
      {/* Delete confirmation modal */}
      {action?.type === 'delete' && (
        <DeleteDeviceModal
          deviceName={action.device.name}
          onDelete={handleDeleteDevice}
          onCancel={() => setAction(null)}
          isDeleting={isSubmitting}
        />
      )}
    </div>
  );
};

export default DeviceManagementPage;