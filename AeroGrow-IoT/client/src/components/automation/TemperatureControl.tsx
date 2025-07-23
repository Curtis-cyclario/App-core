import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  Thermometer, 
  RotateCw, 
  BarChart3, 
  ChevronUp, 
  ChevronDown, 
  Lightbulb,
  Droplet,
  Fan,
  AlertTriangle,
  ArrowUpRight,
  Info,
  Play,
  RotateCcw,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';

// Define temperature control data types
interface TemperatureZone {
  id: string;
  name: string;
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  lightIntensity: number;
  waterLevel: number;
  status: 'optimal' | 'warning' | 'critical';
  isAutoControlEnabled: boolean;
  controlMode: 'balanced' | 'eco' | 'growth';
  lastUpdated: string;
  towerId: number;
  plantType?: string;
}

interface TemperatureLog {
  timestamp: string;
  temperature: number;
  targetTemperature: number;
  action: 'none' | 'increase_light' | 'decrease_light' | 'increase_water' | 'decrease_water';
  actionReason: string;
}

const TemperatureControl: React.FC = () => {
  const [zones, setZones] = useState<TemperatureZone[]>([]);
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('current');

  // Simulated temperature zones for demo purposes
  const simulatedZones: TemperatureZone[] = [
    {
      id: 'zone-1',
      name: 'Tower Group A',
      currentTemp: 23.4,
      targetTemp: 24.0,
      humidity: 68,
      lightIntensity: 75,
      waterLevel: 87,
      status: 'optimal',
      isAutoControlEnabled: true,
      controlMode: 'balanced',
      lastUpdated: new Date().toISOString(),
      towerId: 1,
      plantType: 'Lettuce'
    },
    {
      id: 'zone-2',
      name: 'Tower Group B',
      currentTemp: 25.8,
      targetTemp: 24.5,
      humidity: 62,
      lightIntensity: 82,
      waterLevel: 65,
      status: 'warning',
      isAutoControlEnabled: true,
      controlMode: 'growth',
      lastUpdated: new Date().toISOString(),
      towerId: 2,
      plantType: 'Basil'
    },
    {
      id: 'zone-3',
      name: 'Tower Group C',
      currentTemp: 21.2,
      targetTemp: 22.0,
      humidity: 72,
      lightIntensity: 68,
      waterLevel: 92,
      status: 'optimal',
      isAutoControlEnabled: false,
      controlMode: 'eco',
      lastUpdated: new Date().toISOString(),
      towerId: 3,
      plantType: 'Spinach'
    },
    {
      id: 'zone-4',
      name: 'Seedling Zone',
      currentTemp: 26.7,
      targetTemp: 25.0,
      humidity: 75,
      lightIntensity: 90,
      waterLevel: 78,
      status: 'critical',
      isAutoControlEnabled: true,
      controlMode: 'growth',
      lastUpdated: new Date().toISOString(),
      towerId: 4,
      plantType: 'Mixed Seedlings'
    }
  ];

  // Simulated temperature logs
  const simulatedLogs: TemperatureLog[] = [
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      temperature: 25.2,
      targetTemperature: 24.0,
      action: 'decrease_light',
      actionReason: 'Temperature 1.2°C above target'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      temperature: 23.8,
      targetTemperature: 24.0,
      action: 'none',
      actionReason: 'Temperature within acceptable range'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      temperature: 23.2,
      targetTemperature: 24.0,
      action: 'increase_light',
      actionReason: 'Temperature 0.8°C below target'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      temperature: 22.5,
      targetTemperature: 24.0,
      action: 'increase_light',
      actionReason: 'Temperature 1.5°C below target'
    },
    {
      timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      temperature: 24.8,
      targetTemperature: 24.0,
      action: 'decrease_water',
      actionReason: 'Temperature 0.8°C above target, humidity high'
    }
  ];

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        setLoading(true);
        // In a real application, fetch from API
        // const zonesResponse = await apiRequest('GET', '/api/temperature/zones');
        // const zonesData = await zonesResponse.json();
        
        // For demo, use simulated data
        setTimeout(() => {
          setZones(simulatedZones);
          setLogs(simulatedLogs);
          setSelectedZoneId(simulatedZones[0].id);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error('Error fetching temperature control data:', error);
        setError('Failed to fetch temperature control data');
        setLoading(false);
      }
    };

    fetchTemperatureData();
  }, []);

  // Get the selected zone
  const selectedZone = selectedZoneId 
    ? zones.find(zone => zone.id === selectedZoneId) 
    : zones.length > 0 ? zones[0] : null;

  // Update zone settings
  const updateZoneSettings = async (zoneId: string, updates: Partial<TemperatureZone>) => {
    try {
      // In a real app, send to API
      // await apiRequest('PATCH', `/api/temperature/zones/${zoneId}`, updates);
      
      // Update local state for demo
      setZones(prevZones => 
        prevZones.map(zone => 
          zone.id === zoneId ? { ...zone, ...updates, lastUpdated: new Date().toISOString() } : zone
        )
      );

      // Add a log entry if the target temperature was changed
      if (updates.targetTemp !== undefined) {
        const zone = zones.find(z => z.id === zoneId);
        if (zone) {
          const newLog: TemperatureLog = {
            timestamp: new Date().toISOString(),
            temperature: zone.currentTemp,
            targetTemperature: updates.targetTemp,
            action: 'none',
            actionReason: `Target temperature manually set to ${updates.targetTemp}°C`
          };
          setLogs(prevLogs => [newLog, ...prevLogs]);
        }
      }
    } catch (error) {
      console.error('Error updating zone settings:', error);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get temperature difference text
  const getTempDiffText = (current: number, target: number) => {
    const diff = current - target;
    if (Math.abs(diff) < 0.5) return 'At target';
    return diff > 0 
      ? <span className="text-red-500 dark:text-red-400">{diff.toFixed(1)}°C above target</span>
      : <span className="text-blue-500 dark:text-blue-400">{Math.abs(diff).toFixed(1)}°C below target</span>;
  };

  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'increase_light':
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case 'decrease_light':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'increase_water':
        return <Droplet className="h-4 w-4 text-blue-500" />;
      case 'decrease_water':
        return <Droplet className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-md border border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Automated Temperature Control
            </CardTitle>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const now = new Date().toISOString();
              setZones(prevZones => prevZones.map(zone => ({
                ...zone,
                lastUpdated: now
              })));
            }}
            className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          AI-powered climate control for optimal plant growth
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading temperature data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Zone List - Left Column */}
            <div className="col-span-1 space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Temperature Zones</h3>
              {zones.map((zone) => (
                <motion.div
                  key={zone.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border rounded-lg p-3 cursor-pointer transition-all ${
                    selectedZoneId === zone.id 
                      ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedZoneId(zone.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{zone.name}</h4>
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(zone.status)}`}></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {zone.plantType || 'Mixed Plants'}
                      </p>
                    </div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">
                      {zone.currentTemp.toFixed(1)}°C
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      Target: {zone.targetTemp.toFixed(1)}°C
                    </span>
                    <span className="flex items-center">
                      {zone.isAutoControlEnabled ? (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                          Auto
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          Manual
                        </Badge>
                      )}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Zone Details - Right Column */}
            <div className="col-span-1 lg:col-span-2">
              {selectedZone ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="current">Current Status</TabsTrigger>
                    <TabsTrigger value="control">Control Settings</TabsTrigger>
                    <TabsTrigger value="history">Action History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="current">
                    <div className="space-y-6">
                      {/* Temperature Info Card */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
                            <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
                            Current Temperature
                          </h3>
                          <Badge 
                            variant={selectedZone.status === 'optimal' ? 'outline' : 'destructive'}
                            className={`
                              ${selectedZone.status === 'optimal' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' : ''}
                              ${selectedZone.status === 'warning' ? 'bg-amber-500' : ''}
                            `}
                          >
                            {selectedZone.status.charAt(0).toUpperCase() + selectedZone.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {selectedZone.currentTemp.toFixed(1)}°C
                          </span>
                          <div className="text-sm text-right">
                            <div>Target: {selectedZone.targetTemp.toFixed(1)}°C</div>
                            <div>{getTempDiffText(selectedZone.currentTemp, selectedZone.targetTemp)}</div>
                          </div>
                        </div>
                        
                        <Progress
                          value={((selectedZone.currentTemp - 15) / 20) * 100}
                          className="h-2"
                        />
                        
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>15°C</span>
                          <span>25°C</span>
                          <span>35°C</span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="border border-gray-200 dark:border-gray-700 rounded p-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                              <Droplet className="h-3 w-3 mr-1 text-blue-500" /> Humidity
                            </div>
                            <div className="text-lg font-medium text-gray-900 dark:text-white">
                              {selectedZone.humidity}%
                            </div>
                          </div>
                          <div className="border border-gray-200 dark:border-gray-700 rounded p-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                              <Lightbulb className="h-3 w-3 mr-1 text-amber-500" /> Light
                            </div>
                            <div className="text-lg font-medium text-gray-900 dark:text-white">
                              {selectedZone.lightIntensity}%
                            </div>
                          </div>
                          <div className="border border-gray-200 dark:border-gray-700 rounded p-2">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                              <Droplet className="h-3 w-3 mr-1 text-blue-400" /> Water
                            </div>
                            <div className="text-lg font-medium text-gray-900 dark:text-white">
                              {selectedZone.waterLevel}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                          <span>Last updated: {new Date(selectedZone.lastUpdated).toLocaleTimeString()}</span>
                          <Badge variant={selectedZone.isAutoControlEnabled ? 'default' : 'outline'} className="text-xs">
                            {selectedZone.isAutoControlEnabled ? 'Auto Control Active' : 'Manual Control'}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* System Status Card */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">System Status</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Lighting System</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                              Active
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Droplet className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Irrigation System</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                              Active
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Fan className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Ventilation System</span>
                            </div>
                            <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                              Standby
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">Data Collection</span>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="control">
                    <div className="space-y-6">
                      {/* Temperature Control Card */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Temperature Control</h3>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="auto-control"
                              checked={selectedZone.isAutoControlEnabled}
                              onCheckedChange={(checked) => {
                                updateZoneSettings(selectedZone.id, { isAutoControlEnabled: checked });
                              }}
                            />
                            <Label htmlFor="auto-control">Automated Control</Label>
                          </div>
                          
                          <div className="flex">
                            {selectedZone.isAutoControlEnabled ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs flex items-center gap-1.5"
                                onClick={() => updateZoneSettings(selectedZone.id, { isAutoControlEnabled: false })}
                              >
                                <Pause className="h-3 w-3" />
                                Pause
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-xs flex items-center gap-1.5"
                                onClick={() => updateZoneSettings(selectedZone.id, { isAutoControlEnabled: true })}
                              >
                                <Play className="h-3 w-3" />
                                Enable
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor="target-temp">Target Temperature (°C)</Label>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedZone.targetTemp.toFixed(1)}°C</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                                onClick={() => {
                                  const newTarget = Math.max(18, selectedZone.targetTemp - 0.5);
                                  updateZoneSettings(selectedZone.id, { targetTemp: newTarget });
                                }}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Slider
                                id="target-temp"
                                min={18}
                                max={30}
                                step={0.5}
                                value={[selectedZone.targetTemp]}
                                onValueChange={(value) => {
                                  updateZoneSettings(selectedZone.id, { targetTemp: value[0] });
                                }}
                                className="flex-1"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 flex items-center justify-center"
                                onClick={() => {
                                  const newTarget = Math.min(30, selectedZone.targetTemp + 0.5);
                                  updateZoneSettings(selectedZone.id, { targetTemp: newTarget });
                                }}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>18°C</span>
                              <span>24°C</span>
                              <span>30°C</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor="control-mode">Control Mode</Label>
                              <Badge variant="outline" className="text-xs">
                                {selectedZone.controlMode.charAt(0).toUpperCase() + selectedZone.controlMode.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <Button
                                variant={selectedZone.controlMode === 'balanced' ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs"
                                onClick={() => updateZoneSettings(selectedZone.id, { controlMode: 'balanced' })}
                              >
                                Balanced
                              </Button>
                              <Button
                                variant={selectedZone.controlMode === 'eco' ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs"
                                onClick={() => updateZoneSettings(selectedZone.id, { controlMode: 'eco' })}
                              >
                                Energy Saving
                              </Button>
                              <Button
                                variant={selectedZone.controlMode === 'growth' ? 'default' : 'outline'}
                                size="sm"
                                className="text-xs"
                                onClick={() => updateZoneSettings(selectedZone.id, { controlMode: 'growth' })}
                              >
                                Max Growth
                              </Button>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {selectedZone.controlMode === 'balanced' && 'Maintains optimal balance between growth and efficiency'}
                              {selectedZone.controlMode === 'eco' && 'Minimizes resource usage while maintaining acceptable conditions'}
                              {selectedZone.controlMode === 'growth' && 'Prioritizes optimal growing conditions for maximum yield'}
                            </div>
                          </div>
                        </div>
                        
                        {!selectedZone.isAutoControlEnabled && (
                          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm text-amber-800 dark:text-amber-300 flex items-start">
                            <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">Manual Control Active</p>
                              <p className="mt-1">Automated temperature adjustments are disabled. Temperature responses will require manual intervention.</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Plant Profile Settings */}
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">Plant Profile Settings</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="plant-type">Plant Type</Label>
                            <div className="flex mt-1 text-sm">
                              <div className="py-1 px-2 border border-primary/30 bg-primary/5 text-primary rounded">
                                {selectedZone.plantType || 'Mixed Plants'}
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label>Optimal Temperature Range</Label>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Based on plant profile</span>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded p-2 flex justify-between items-center">
                              <div className="text-sm">
                                <div className="text-gray-500 dark:text-gray-400 text-xs">Minimum</div>
                                <div className="font-medium text-gray-900 dark:text-white">21.0°C</div>
                              </div>
                              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                              <div className="text-sm">
                                <div className="text-gray-500 dark:text-gray-400 text-xs">Optimal</div>
                                <div className="font-medium text-green-600 dark:text-green-400">24.0°C</div>
                              </div>
                              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                              <div className="text-sm">
                                <div className="text-gray-500 dark:text-gray-400 text-xs">Maximum</div>
                                <div className="font-medium text-gray-900 dark:text-white">27.0°C</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <div className="space-y-6">
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" />
                          Temperature Control Actions
                        </h3>
                        
                        <div className="space-y-3 mt-4">
                          {logs.length === 0 ? (
                            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                              No temperature control actions recorded
                            </div>
                          ) : (
                            logs.map((log, index) => (
                              <div 
                                key={index}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 mr-3">
                                      {getActionIcon(log.action)}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {log.action === 'none' ? 'No action taken' : 
                                         log.action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {log.actionReason}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {log.temperature.toFixed(1)}°C 
                                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                                        / {log.targetTemperature.toFixed(1)}°C
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                      {formatTime(log.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        
                        <div className="mt-4 text-center">
                          <Button variant="outline" size="sm" className="text-xs">
                            Load More History
                            <RotateCcw className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-gray-500 dark:text-gray-400">No temperature zone selected</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {zones.length} zones, automated control {zones.filter(z => z.isAutoControlEnabled).length > 0 ? 'active' : 'inactive'}
          </p>
          <Button variant="link" size="sm" className="text-primary">
            View System Analytics
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemperatureControl;