import React from 'react';
import { Device } from '../../types';
import { Activity, Power, PowerOff } from 'lucide-react';

interface StatusBadgeProps {
  status: Device['status'] | Device['last_status'];
  type?: 'status' | 'power';
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'status',
  size = 'md'
}) => {
  // Determine the style based on status and type
  let badgeClass = '';
  let icon = null;
  let label = status;

  if (type === 'status') {
    if (status === 'online') {
      badgeClass = 'bg-success-100 text-success-800';
      icon = <Activity size={size === 'sm' ? 12 : 16} className="mr-1.5" />;
    } else {
      badgeClass = 'bg-gray-100 text-gray-800';
      icon = <Activity size={size === 'sm' ? 12 : 16} className="mr-1.5" />;
    }
  } else if (type === 'power') {
    if (status === 'ON') {
      badgeClass = 'bg-success-100 text-success-800';
      icon = <Power size={size === 'sm' ? 12 : 16} className="mr-1.5" />;
    } else {
      badgeClass = 'bg-gray-100 text-gray-800';
      icon = <PowerOff size={size === 'sm' ? 12 : 16} className="mr-1.5" />;
    }
  }

  // Adjust size
  let sizeClass = 'text-xs px-2.5 py-0.5';
  if (size === 'lg') {
    sizeClass = 'text-sm px-3 py-1';
  } else if (size === 'sm') {
    sizeClass = 'text-xs px-2 py-0.5';
  }

  return (
    <span className={`inline-flex items-center rounded-full ${badgeClass} ${sizeClass} font-medium`}>
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;