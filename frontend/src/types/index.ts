// User Types
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Device Types
export type DeviceStatus = 'online' | 'offline';

export interface Device {
  device_id: string;
  name: string;
  mac_address: string;
  installation_location: string;
  lab_incharge: string;
  last_status: 'ON' | 'OFF';
  status: DeviceStatus;
  assigned_to?: number; // User ID the device is assigned to
}

// Sensor Data Types
export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
}

export interface TimeRangeOption {
  label: string;
  value: string;
}

// Dashboard Types
export interface DeviceOverview {
  device: Device;
  currentReading?: SensorReading;
}

export interface DeviceDetailData {
  device: Device;
  readings: SensorReading[];
}