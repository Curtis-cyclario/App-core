import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets, Gauge, Battery, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useSensorData } from '@/hooks/useSensorData';
import { SensorData } from '@shared/schema';

interface SensorMetricsProps {
  className?: string;
}

const SensorMetrics: React.FC<SensorMetricsProps> = ({ className }) => {
  const { data: currentData, loading, error } = useSensorData();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <div className="flex items-center text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Error loading sensor data: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentData) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">No sensor data available</div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      title: 'Temperature',
      value: `${parseFloat(currentData.temperature).toFixed(1)}°C`,
      icon: Thermometer,
      description: 'Current temperature',
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      trend: parseFloat(currentData.temperature) > 25 ? 'up' : 'down'
    },
    {
      title: 'Humidity',
      value: `${parseFloat(currentData.humidity).toFixed(1)}%`,
      icon: Droplets,
      description: 'Relative humidity',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: parseFloat(currentData.humidity) > 50 ? 'up' : 'down'
    },
    {
      title: 'Water Level',
      value: `${parseFloat(currentData.waterLevel).toFixed(1)}%`,
      icon: Gauge,
      description: 'Reservoir status',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
      trend: parseFloat(currentData.waterLevel) > 70 ? 'up' : 'down'
    },
    {
      title: 'Power',
      value: `${parseFloat(currentData.powerUsage || '85').toFixed(1)}%`,
      icon: Battery,
      description: 'System power usage',
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: parseFloat(currentData.powerUsage || '85') < 90 ? 'down' : 'up'
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ${className}`}>
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{metric.value}</div>
                <TrendIcon 
                  className={`h-4 w-4 ${
                    metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`} 
                />
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                {metric.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default SensorMetrics;