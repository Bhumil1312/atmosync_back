import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteDeviceModalProps {
  deviceName: string;
  onDelete: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteDeviceModal: React.FC<DeleteDeviceModalProps> = ({
  deviceName,
  onDelete,
  onCancel,
  isDeleting
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-warning-500" />
            <h2 className="text-lg font-semibold text-gray-900">Delete Device</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{deviceName}</span>? 
            This action cannot be undone and all associated data will be permanently removed.
          </p>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline btn-md"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="btn-md bg-error-600 text-white hover:bg-error-700 shadow-sm disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                'Delete Device'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDeviceModal;