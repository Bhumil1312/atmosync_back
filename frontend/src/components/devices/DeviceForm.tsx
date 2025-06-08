import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Device } from '../../types';

interface DeviceFormProps {
  onSubmit: (data: Omit<Device, 'device_id' | 'status'>) => void;
  onCancel: () => void;
  initialData?: Partial<Device>;
  title: string;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  title,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Omit<Device, 'device_id' | 'status'>>({
    defaultValues: {
      name: initialData?.name || '',
      mac_address: initialData?.mac_address || '',
      installation_location: initialData?.installation_location || '',
      lab_incharge: initialData?.lab_incharge || '',
      last_status: initialData?.last_status || 'OFF',
      assigned_to: initialData?.assigned_to,
    },
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Device Name*
              </label>
              <input
                id="name"
                {...register('name', { required: 'Device name is required' })}
                className={`input w-full ${errors.name ? 'border-error-500' : ''}`}
                placeholder="E.g., Lab Sensor 1"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="mac_address" className="block text-sm font-medium text-gray-700 mb-1">
                MAC Address*
              </label>
              <input
                id="mac_address"
                {...register('mac_address', {
                  required: 'MAC address is required',
                  pattern: {
                    value: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
                    message: 'Invalid MAC address format (XX:XX:XX:XX:XX:XX)',
                  },
                })}
                className={`input w-full ${errors.mac_address ? 'border-error-500' : ''}`}
                placeholder="XX:XX:XX:XX:XX:XX"
              />
              {errors.mac_address && (
                <p className="mt-1 text-sm text-error-600">{errors.mac_address.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="installation_location" className="block text-sm font-medium text-gray-700 mb-1">
                Installation Location*
              </label>
              <input
                id="installation_location"
                {...register('installation_location', { required: 'Installation location is required' })}
                className={`input w-full ${errors.installation_location ? 'border-error-500' : ''}`}
                placeholder="E.g., Chemistry Lab"
              />
              {errors.installation_location && (
                <p className="mt-1 text-sm text-error-600">{errors.installation_location.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lab_incharge" className="block text-sm font-medium text-gray-700 mb-1">
                Lab Incharge*
              </label>
              <input
                id="lab_incharge"
                {...register('lab_incharge', { required: 'Lab incharge is required' })}
                className={`input w-full ${errors.lab_incharge ? 'border-error-500' : ''}`}
                placeholder="E.g., Dr. Smith"
              />
              {errors.lab_incharge && (
                <p className="mt-1 text-sm text-error-600">{errors.lab_incharge.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Status*
              </label>
              <div className="flex space-x-4 mt-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('last_status', { required: 'Status is required' })}
                    value="ON"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">ON</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('last_status', { required: 'Status is required' })}
                    value="OFF"
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">OFF</span>
                </label>
              </div>
              {errors.last_status && (
                <p className="mt-1 text-sm text-error-600">{errors.last_status.message}</p>
              )}
            </div>

          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline btn-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary btn-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Device'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceForm;