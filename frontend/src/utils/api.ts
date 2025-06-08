import { Device, SensorReading } from '../types';

// API base URL - in a real app, this would be your API endpoint
const API_BASE_URL = '/api';

// Mock devices data
const MOCK_DEVICES: Device[] = [
  {
    device_id: 'dev-001',
    name: 'Lab Sensor 1',
    mac_address: '00:1B:44:11:3A:B7',
    installation_location: 'Chemistry Lab',
    lab_incharge: 'Dr. Smith',
    last_status: 'ON',
    status: 'online',
    assigned_to: 2
  },
  {
    device_id: 'dev-002',
    name: 'Lab Sensor 2',
    mac_address: '00:1B:44:11:3A:B8',
    installation_location: 'Physics Lab',
    lab_incharge: 'Dr. Johnson',
    last_status: 'ON',
    status: 'online',
    assigned_to: 2
  },
  {
    device_id: 'dev-003',
    name: 'Greenhouse Sensor',
    mac_address: '00:1B:44:11:3A:C1',
    installation_location: 'Botanical Garden',
    lab_incharge: 'Dr. Green',
    last_status: 'OFF',
    status: 'offline',
    assigned_to: 2
  },
  {
    device_id: 'dev-004',
    name: 'Server Room Sensor',
    mac_address: '00:1B:44:11:3A:D2',
    installation_location: 'IT Department',
    lab_incharge: 'Mr. Tech',
    last_status: 'ON',
    status: 'online'
  },
  {
    device_id: 'dev-005',
    name: 'Library Sensor',
    mac_address: '00:1B:44:11:3A:E5',
    installation_location: 'Main Library',
    lab_incharge: 'Ms. Reed',
    last_status: 'OFF',
    status: 'offline'
  }
];

// Generate random sensor data
const generateMockSensorData = (
  deviceId: string, 
  timeRange: string = '24h'
): SensorReading[] => {
  const now = new Date();
  const readings: SensorReading[] = [];
  
  // Determine number of data points and interval based on time range
  let dataPoints = 24;
  let intervalHours = 1;
  
  if (timeRange === '7d') {
    dataPoints = 7 * 24;
    intervalHours = 1;
  } else if (timeRange === '30d') {
    dataPoints = 30;
    intervalHours = 24;
  }
  
  // Generate base temperature and humidity for this device to ensure
  // different devices have different patterns
  const deviceHash = deviceId.charCodeAt(deviceId.length - 1);
  const baseTemp = 20 + (deviceHash % 5);
  const baseHumidity = 40 + (deviceHash % 20);
  
  // Generate data points
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = new Date(now);
    timestamp.setHours(now.getHours() - (i * intervalHours));
    
    // Add some randomness but keep a general pattern
    const hourOfDay = timestamp.getHours();
    const dayFactor = hourOfDay > 9 && hourOfDay < 18 ? 2 : -1; // Warmer during day
    
    const tempVariation = Math.sin(i / 24 * Math.PI) * 3 + Math.random() * 2 - 1 + dayFactor;
    const humidityVariation = Math.cos(i / 24 * Math.PI) * 8 + Math.random() * 4 - 2;
    
    readings.push({
      timestamp: timestamp.toISOString(),
      temperature: +(baseTemp + tempVariation).toFixed(1),
      humidity: +(baseHumidity + humidityVariation).toFixed(1)
    });
  }
  
  // Sort readings from oldest to newest
  return readings.reverse();
};

// API methods
export const api = {
  // Authentication - In a real app, this would make an actual API call
  login: async (email: string, password: string) => {
    // This is handled by the AuthContext in our mock implementation
    return { success: true };
  },
  
  // Devices
  getDevices: async (userId?: number): Promise<Device[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // If userId is provided, filter devices assigned to that user
    if (userId) {
      return MOCK_DEVICES.filter(device => device.assigned_to === userId);
    }
    
    return MOCK_DEVICES;
  },
  
  getDevice: async (deviceId: string): Promise<Device> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const device = MOCK_DEVICES.find(d => d.device_id === deviceId);
    if (!device) {
      throw new Error(`Device not found: ${deviceId}`);
    }
    
    return device;
  },
  
  updateDeviceStatus: async (deviceId: string, status: 'ON' | 'OFF'): Promise<Device> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const deviceIndex = MOCK_DEVICES.findIndex(d => d.device_id === deviceId);
    if (deviceIndex === -1) {
      throw new Error(`Device not found: ${deviceId}`);
    }
    
    // Update device status
    const updatedDevice = {
      ...MOCK_DEVICES[deviceIndex],
      last_status: status,
      status: status === 'ON' ? 'online' : 'offline'
    };
    
    // Update the mock data
    MOCK_DEVICES[deviceIndex] = updatedDevice;
    
    return updatedDevice;
  },
  
  createDevice: async (deviceData: Omit<Device, 'device_id' | 'status'>): Promise<Device> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate a new device ID
    const newDeviceId = `dev-${(MOCK_DEVICES.length + 1).toString().padStart(3, '0')}`;
    
    const newDevice: Device = {
      ...deviceData,
      device_id: newDeviceId,
      status: deviceData.last_status === 'ON' ? 'online' : 'offline'
    };
    
    MOCK_DEVICES.push(newDevice);
    
    return newDevice;
  },
  
  updateDevice: async (deviceId: string, deviceData: Partial<Device>): Promise<Device> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const deviceIndex = MOCK_DEVICES.findIndex(d => d.device_id === deviceId);
    if (deviceIndex === -1) {
      throw new Error(`Device not found: ${deviceId}`);
    }
    
    // Update device
    const updatedDevice = {
      ...MOCK_DEVICES[deviceIndex],
      ...deviceData,
      device_id: MOCK_DEVICES[deviceIndex].device_id // Ensure device_id cannot be changed
    };
    
    // Update status based on last_status if it was changed
    if (deviceData.last_status) {
      updatedDevice.status = deviceData.last_status === 'ON' ? 'online' : 'offline';
    }
    
    // Update the mock data
    MOCK_DEVICES[deviceIndex] = updatedDevice;
    
    return updatedDevice;
  },
  
  deleteDevice: async (deviceId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const deviceIndex = MOCK_DEVICES.findIndex(d => d.device_id === deviceId);
    if (deviceIndex === -1) {
      throw new Error(`Device not found: ${deviceId}`);
    }
    
    // Remove the device
    MOCK_DEVICES.splice(deviceIndex, 1);
  },
  
  // Sensor Data
  getSensorData: async (deviceId: string, timeRange: string = '24h'): Promise<SensorReading[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Check if device exists
    const deviceExists = MOCK_DEVICES.some(d => d.device_id === deviceId);
    if (!deviceExists) {
      throw new Error(`Device not found: ${deviceId}`);
    }
    
    return generateMockSensorData(deviceId, timeRange);
  },
  
  // Export Data
  exportSensorDataCSV: async (deviceId: string, timeRange: string = '24h'): Promise<string> => {
    // Get sensor data
    const readings = await api.getSensorData(deviceId, timeRange);
    
    // Convert to CSV
    const headers = 'Timestamp,Temperature (°C),Humidity (%)';
    const rows = readings.map(reading => 
      `${new Date(reading.timestamp).toLocaleString()},${reading.temperature},${reading.humidity}`
    );
    
    return [headers, ...rows].join('\n');
  }
};