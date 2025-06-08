import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  ComposedChart
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { SensorReading, TimeRangeOption } from '../../types';

interface SensorChartProps {
  data: SensorReading[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  chartType?: 'line' | 'composed';
  title?: string;
  className?: string;
}

const timeRangeOptions: TimeRangeOption[] = [
  { label: 'Last 24 Hours', value: '24h' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
];

export const SensorChart: React.FC<SensorChartProps> = ({
  data,
  timeRange,
  onTimeRangeChange,
  chartType = 'line',
  title,
  className = '',
}) => {
  // Format data for chart display
  const formattedData = data.map((reading) => {
    const date = parseISO(reading.timestamp);
    let formattedDate;
    
    if (timeRange === '24h') {
      formattedDate = format(date, 'HH:mm');
    } else if (timeRange === '7d') {
      formattedDate = format(date, 'EEE HH:mm');
    } else {
      formattedDate = format(date, 'MMM dd');
    }
    
    return {
      ...reading,
      formattedDate,
    };
  });

  return (
    <div className={`card bg-white p-4 ${className}`}>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      {/* Time range selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onTimeRangeChange(option.value)}
            className={`btn-sm ${
              timeRange === option.value
                ? 'btn-primary'
                : 'btn-outline'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6b7280"
              />
              <YAxis 
                yAxisId="temperature" 
                orientation="left" 
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6b7280"
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', dy: 40, fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                yAxisId="humidity" 
                orientation="right" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6b7280"
                label={{ value: 'Humidity (%)', angle: -90, position: 'insideRight', dy: 40, fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb',
                }}
                labelFormatter={(value) => `Time: ${value}`}
              />
              <Legend wrapperStyle={{ paddingTop: '1rem' }} />
              <Line
                yAxisId="temperature"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
              <Line
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          ) : (
            <ComposedChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6b7280"
              />
              <YAxis 
                yAxisId="temperature" 
                orientation="left" 
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6b7280"
                label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', dy: 40, fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis 
                yAxisId="humidity" 
                orientation="right" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6b7280"
                label={{ value: 'Humidity (%)', angle: -90, position: 'insideRight', dy: 40, fontSize: 12, fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  padding: '0.5rem 0.75rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e5e7eb',
                }}
                labelFormatter={(value) => `Time: ${value}`}
              />
              <Legend wrapperStyle={{ paddingTop: '1rem' }} />
              <Line
                yAxisId="temperature"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
              <Area
                yAxisId="humidity"
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                fill="#2563eb"
                fillOpacity={0.2}
                stroke="#2563eb"
                strokeWidth={2}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorChart;