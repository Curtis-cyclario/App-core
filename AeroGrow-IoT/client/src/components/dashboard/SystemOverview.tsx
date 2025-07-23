import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { SensorData } from '@/types';
import { Thermometer, Droplet, FlaskConical, PercentIcon, LineChart, History, AlertTriangle } from 'lucide-react';

interface SystemOverviewProps {
  sensorData: SensorData | null;
  loading?: boolean;
}

type DetailType = 'temperature' | 'humidity' | 'waterLevel' | 'nutrientLevel' | null;

const SystemOverview: React.FC<SystemOverviewProps> = ({ 
  sensorData, 
  loading = false 
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsType, setDetailsType] = useState<DetailType>(null);
  
  const handleOpenDetails = (type: DetailType) => {
    setDetailsType(type);
    setDetailsOpen(true);
  };
  
  const getDetailContent = () => {
    if (!detailsType || !sensorData) return null;
    
    switch (detailsType) {
      case 'temperature':
        return {
          title: 'Temperature Details',
          value: `${sensorData.temperature}°C`,
          icon: <Thermometer className="h-6 w-6 text-green-600 dark:text-green-200" />,
          description: 'Current temperature reading across all sensors',
          optimalRange: '20°C - 26°C',
          status: parseFloat(sensorData.temperature) > 30 ? 'Warning' : 'Normal',
          statusColor: parseFloat(sensorData.temperature) > 30 ? 'text-amber-500' : 'text-green-500',
          history: '24-hour fluctuation within 4°C range',
          details: [
            { label: 'Min Today', value: '19.8°C' },
            { label: 'Max Today', value: '26.2°C' },
            { label: 'Average', value: '23.4°C' },
            { label: 'Plant Type', value: sensorData.plantType || 'Mixed Greens' },
          ],
          recommendations: parseFloat(sensorData.temperature) > 28 
            ? 'Consider reducing ambient temperature or increasing ventilation'
            : 'Current temperature levels are optimal for growth'
        };
      case 'humidity':
        return {
          title: 'Humidity Details',
          value: `${sensorData.humidity}%`,
          icon: <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-200" />,
          description: 'Current humidity level in growing environment',
          optimalRange: '60% - 80%',
          status: parseFloat(sensorData.humidity) < 50 ? 'Low' : parseFloat(sensorData.humidity) > 85 ? 'High' : 'Normal',
          statusColor: parseFloat(sensorData.humidity) < 50 || parseFloat(sensorData.humidity) > 85 ? 'text-amber-500' : 'text-green-500',
          history: 'Stable humidity levels in the last 24 hours',
          details: [
            { label: 'Min Today', value: '58%' },
            { label: 'Max Today', value: '83%' },
            { label: 'Average', value: '72%' },
            { label: 'Transpiration Rate', value: 'Normal' },
          ],
          recommendations: parseFloat(sensorData.humidity) < 60 
            ? 'Consider using humidifiers during dry periods'
            : 'Current humidity levels are supporting healthy growth'
        };
      case 'waterLevel':
        return {
          title: 'Water Level Details',
          value: `${sensorData.waterLevel}%`,
          icon: <FlaskConical className="h-6 w-6 text-indigo-600 dark:text-indigo-200" />,
          description: 'Current water level in reservoir (1000L capacity)',
          optimalRange: '80% - 100%',
          status: parseFloat(sensorData.waterLevel) < 30 ? 'Critical' : parseFloat(sensorData.waterLevel) < 50 ? 'Low' : 'Normal',
          statusColor: parseFloat(sensorData.waterLevel) < 30 ? 'text-red-500' : parseFloat(sensorData.waterLevel) < 50 ? 'text-amber-500' : 'text-green-500',
          history: 'Gradual reduction over past 72 hours',
          details: [
            { label: 'Actual Volume', value: `${Math.round(parseFloat(sensorData.waterLevel) * 10)}L` },
            { label: 'Daily Usage', value: `${sensorData.waterUsed}L` },
            { label: 'Reservoir Size', value: '1000L' },
            { label: 'Est. Refill Date', value: '3 days' },
          ],
          recommendations: parseFloat(sensorData.waterLevel) < 50
            ? 'Schedule water refill within next 48 hours'
            : 'Water supply sufficient for normal operations'
        };
      case 'nutrientLevel':
        return {
          title: 'Nutrient Level Details',
          value: `${sensorData.nutrientLevel}%`,
          icon: <PercentIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />,
          description: 'Current nutrient concentration in water solution',
          optimalRange: '70% - 90%',
          status: parseFloat(sensorData.nutrientLevel) < 60 ? 'Low' : 'Normal',
          statusColor: parseFloat(sensorData.nutrientLevel) < 60 ? 'text-amber-500' : 'text-green-500',
          history: 'Stable levels with periodic supplements',
          details: [
            { label: 'EC Value', value: '1.8 mS/cm' },
            { label: 'pH Level', value: '6.2' },
            { label: 'Last Supplement', value: '22 hours ago' },
            { label: 'Formula Type', value: 'Balanced Growth' },
          ],
          recommendations: parseFloat(sensorData.nutrientLevel) < 70
            ? 'Add nutrient solution according to growth stage requirements'
            : 'Nutrient levels are supporting healthy growth'
        };
      default:
        return null;
    }
  };
  
  const details = getDetailContent();
  
  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Temperature Card */}
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleOpenDetails('temperature')}>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                <Thermometer className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Temperature</div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      `${sensorData?.temperature || '--'}°C`
                    )}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">Increased by</span>
                    0.5°C
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-dark-800 px-5 py-3">
            <button 
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails('temperature');
              }}
            >
              View details
            </button>
          </CardFooter>
        </Card>

        {/* Humidity Card */}
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleOpenDetails('humidity')}>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                <Droplet className="h-6 w-6 text-blue-600 dark:text-blue-200" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Humidity</div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      `${sensorData?.humidity || '--'}%`
                    )}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">Increased by</span>
                    3%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-dark-800 px-5 py-3">
            <button 
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails('humidity');
              }}
            >
              View details
            </button>
          </CardFooter>
        </Card>

        {/* Water Level Card */}
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleOpenDetails('waterLevel')}>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-md p-3">
                <FlaskConical className="h-6 w-6 text-indigo-600 dark:text-indigo-200" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Water Level</div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      `${sensorData?.waterLevel || '--'}%`
                    )}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600 dark:text-red-400">
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">Decreased by</span>
                    0.3%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-dark-800 px-5 py-3">
            <button 
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails('waterLevel');
              }}
            >
              View details
            </button>
          </CardFooter>
        </Card>

        {/* Nutrient Level Card */}
        <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleOpenDetails('nutrientLevel')}>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
                <PercentIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Nutrient Level</div>
                <div className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {loading ? (
                      <span className="animate-pulse">--</span>
                    ) : (
                      `${sensorData?.nutrientLevel || '--'}%`
                    )}
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600 dark:text-red-400">
                    <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="sr-only">Decreased by</span>
                    0.2%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-dark-800 px-5 py-3">
            <button 
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetails('nutrientLevel');
              }}
            >
              View details
            </button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {details && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {details.icon}
                {details.title}
              </DialogTitle>
              <DialogDescription>
                {details.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">Current Value</div>
                <div className="text-2xl font-bold">{details.value}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Optimal Range</div>
                  <div className="font-medium">{details.optimalRange}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                  <div className={`font-medium ${details.statusColor}`}>{details.status}</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <History className="h-4 w-4 text-gray-500" />
                  <div className="font-medium">Historical Data</div>
                </div>
                <div className="text-sm">{details.history}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                {details.details.map((item, index) => (
                  <div key={index}>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{item.label}</div>
                    <div className="font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <div className="font-medium">Recommendations</div>
                </div>
                <div className="text-sm">{details.recommendations}</div>
              </div>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500">
                <LineChart className="h-4 w-4 mr-1" />
                View historical chart for more insights
              </div>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default SystemOverview;
