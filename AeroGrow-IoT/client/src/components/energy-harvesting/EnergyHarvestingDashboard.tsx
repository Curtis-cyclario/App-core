import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from '@/lib/queryClient';
import { 
  Activity, 
  Battery, 
  BatteryCharging, 
  Bolt, 
  Calendar, 
  Cloud, 
  CloudSun, 
  Droplet, 
  Leaf,
  LineChart, 
  RefreshCw, 
  Sun, 
  ThermometerSun, 
  Timer, 
  Zap, 
  ZapOff 
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface EnergyData {
  timestamp: string;
  solar: {
    production: number;
    capacity: number;
    efficiency: number;
    status: 'optimal' | 'degraded' | 'offline';
  };
  storage: {
    currentCharge: number;
    capacity: number;
    chargingRate: number;
    dischargingRate: number;
    status: 'charging' | 'discharging' | 'full' | 'low';
  };
  consumption: {
    current: number;
    average24h: number;
    peak24h: number;
    distribution: {
      lighting: number;
      climate: number;
      pumps: number;
      automation: number;
      other: number;
    };
  };
  grid: {
    import: number;
    export: number;
    price: number;
    carbon: number;
  };
  sustainability: {
    carbonOffset: number;
    waterSaved: number;
    renewablePercentage: number;
  };
}

interface EnergyHistory {
  date: string;
  solarProduction: number;
  gridImport: number;
  gridExport: number;
  totalConsumption: number;
  batteryLevel: number;
}

interface WeatherData {
  date: string;
  condition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rainy';
  temperature: number;
  humidity: number;
  cloudCover: number;
  solarRadiation: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const EnergyHarvestingDashboard = () => {
  const [currentEnergyData, setCurrentEnergyData] = useState<EnergyData | null>(null);
  const [energyHistory, setEnergyHistory] = useState<EnergyHistory[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchEnergyData = async () => {
    try {
      setLoading(true);
      
      // This would fetch real data in a production environment
      // For this prototype, we'll simulate the data
      
      // Current energy data
      const mockCurrentEnergyData: EnergyData = {
        timestamp: new Date().toISOString(),
        solar: {
          production: 4.2, // kW
          capacity: 10.0, // kW
          efficiency: 85, // %
          status: 'optimal',
        },
        storage: {
          currentCharge: 15.4, // kWh
          capacity: 20.0, // kWh
          chargingRate: 3.5, // kW
          dischargingRate: 0, // kW
          status: 'charging',
        },
        consumption: {
          current: 2.8, // kW
          average24h: 3.2, // kW
          peak24h: 5.6, // kW
          distribution: {
            lighting: 35, // %
            climate: 25, // %
            pumps: 20, // %
            automation: 10, // %
            other: 10, // %
          },
        },
        grid: {
          import: 0, // kW
          export: 1.4, // kW
          price: 0.12, // $ per kWh
          carbon: 0.4, // kg CO2 per kWh
        },
        sustainability: {
          carbonOffset: 18.6, // kg CO2 today
          waterSaved: 320, // liters today
          renewablePercentage: 100, // % of energy from renewable sources
        },
      };
      
      setCurrentEnergyData(mockCurrentEnergyData);
      
      // Historical energy data
      const now = new Date();
      const mockEnergyHistory: EnergyHistory[] = [];
      
      // Generate 7 days of hourly data
      for (let d = 7; d >= 0; d--) {
        for (let h = 0; h < 24; h += 2) { // Every 2 hours for brevity
          const date = new Date(now);
          date.setDate(date.getDate() - d);
          date.setHours(h);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          
          // Solar production follows a bell curve during daylight hours
          let solarProduction = 0;
          if (h >= 6 && h <= 20) {
            // Bell curve centered at 1pm (hour 13)
            const hourFactor = 1 - Math.abs(h - 13) / 10;
            // Random daily variations including weather
            const dailyFactor = 0.7 + Math.random() * 0.5;
            solarProduction = Math.max(0, 10 * hourFactor * dailyFactor);
          }
          
          // Consumption varies by time of day with peaks in morning and evening
          let consumption = 2 + Math.random();
          if ((h >= 6 && h <= 9) || (h >= 17 && h <= 21)) {
            consumption += 2 + Math.random();
          }
          
          // Battery level varies based on production vs consumption
          let batteryLevel = 50 + Math.sin(d * 0.5 + h * 0.2) * 30;
          batteryLevel = Math.max(20, Math.min(95, batteryLevel));
          
          // Grid exchange
          const surplus = solarProduction - consumption;
          const gridImport = surplus < 0 ? -surplus : 0;
          const gridExport = surplus > 0 ? surplus : 0;
          
          mockEnergyHistory.push({
            date: date.toISOString(),
            solarProduction,
            gridImport,
            gridExport,
            totalConsumption: consumption,
            batteryLevel
          });
        }
      }
      
      setEnergyHistory(mockEnergyHistory);
      
      // Weather data for forecasting
      const mockWeatherData: WeatherData[] = [];
      
      // Past 3 days and next 4 days
      for (let d = -3; d <= 4; d++) {
        const date = new Date(now);
        date.setDate(date.getDate() + d);
        
        // Randomize weather conditions with some continuity
        const conditionOptions: ('sunny' | 'partly_cloudy' | 'cloudy' | 'rainy')[] = 
          ['sunny', 'partly_cloudy', 'cloudy', 'rainy'];
        const conditionIndex = Math.floor(Math.min(3, Math.max(0, 
          1.5 + Math.sin(d * 0.8) + (Math.random() - 0.5)
        )));
        const condition = conditionOptions[conditionIndex];
        
        // Cloud cover affects solar radiation
        let cloudCover = 0;
        switch (condition) {
          case 'sunny': cloudCover = 5 + Math.random() * 10; break;
          case 'partly_cloudy': cloudCover = 30 + Math.random() * 20; break;
          case 'cloudy': cloudCover = 60 + Math.random() * 20; break;
          case 'rainy': cloudCover = 80 + Math.random() * 15; break;
        }
        
        // Temperature follows seasonal trend with random variation
        const baseTemp = 25 - Math.abs(d * 0.5);
        const temperature = baseTemp + (Math.random() - 0.5) * 5;
        
        // Humidity
        const humidity = 40 + cloudCover * 0.4 + (Math.random() - 0.5) * 10;
        
        // Solar radiation inversely correlates with cloud cover
        const solarRadiation = 1000 * (1 - cloudCover / 100) * (0.8 + Math.random() * 0.4);
        
        mockWeatherData.push({
          date: date.toISOString(),
          condition,
          temperature,
          humidity,
          cloudCover,
          solarRadiation
        });
      }
      
      setWeatherData(mockWeatherData);
    } catch (error) {
      console.error('Failed to fetch energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnergyData();
  }, []);

  const formatDate = (dateString: string, includeTime: boolean = false): string => {
    const date = new Date(dateString);
    return includeTime 
      ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDataForTimeRange = (data: any[], range: string) => {
    if (!data.length) return [];
    
    let filteredData = [...data];
    const now = new Date();
    
    switch (range) {
      case '24h':
        // Last 24 hours
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          const diff = now.getTime() - itemDate.getTime();
          return diff <= 24 * 60 * 60 * 1000;
        });
        break;
      case '7d':
        // Last 7 days
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          const diff = now.getTime() - itemDate.getTime();
          return diff <= 7 * 24 * 60 * 60 * 1000;
        });
        break;
      case '30d':
        // Last 30 days
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.date);
          const diff = now.getTime() - itemDate.getTime();
          return diff <= 30 * 24 * 60 * 60 * 1000;
        });
        break;
      default:
        break;
    }
    
    return filteredData;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'partly_cloudy':
        return <CloudSun className="h-5 w-5 text-blue-400" />;
      case 'cloudy':
        return <Cloud className="h-5 w-5 text-gray-400" />;
      case 'rainy':
        return <Droplet className="h-5 w-5 text-blue-500" />;
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getSolarForecast = (weather: WeatherData) => {
    // Maximum theoretical production on a perfectly sunny day
    const maxProduction = 10; // kW
    
    // Calculate production as a percentage of max based on cloud cover and radiation
    const cloudFactor = 1 - (weather.cloudCover / 100) * 0.8; // Cloud cover doesn't completely block sun
    const radiationFactor = weather.solarRadiation / 1000;
    
    // Combine factors with some randomness
    return Math.round(maxProduction * cloudFactor * radiationFactor * (0.9 + Math.random() * 0.2) * 10) / 10;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Energy Harvesting Integration
          </h1>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
                <SelectItem value="30d">Last 30d</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={fetchEnergyData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {currentEnergyData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  Solar Production
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-bold">{currentEnergyData.solar.production}</div>
                    <div className="text-xl ml-1 mb-0.5">kW</div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round(currentEnergyData.solar.production / currentEnergyData.solar.capacity * 100)}% of {currentEnergyData.solar.capacity}kW capacity
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {currentEnergyData.solar.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Battery className="h-5 w-5 text-blue-500" />
                  Battery Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-bold">{currentEnergyData.storage.currentCharge}</div>
                    <div className="text-xl ml-1 mb-0.5">kWh</div>
                  </div>
                  <div className="mt-2">
                    <Progress value={currentEnergyData.storage.currentCharge / currentEnergyData.storage.capacity * 100} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round(currentEnergyData.storage.currentCharge / currentEnergyData.storage.capacity * 100)}% charged
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {currentEnergyData.storage.status}
                    {currentEnergyData.storage.status === 'charging' && 
                      <BatteryCharging className="h-3 w-3 ml-1" />
                    }
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Current Consumption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-bold">{currentEnergyData.consumption.current}</div>
                    <div className="text-xl ml-1 mb-0.5">kW</div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Peak today: {currentEnergyData.consumption.peak24h}kW
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Avg: {currentEnergyData.consumption.average24h}kW
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-500" />
                  Sustainability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-end justify-center">
                    <div className="text-3xl font-bold">{currentEnergyData.sustainability.renewablePercentage}%</div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Renewable energy
                  </div>
                  <Badge variant="outline" className="mt-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    {currentEnergyData.sustainability.carbonOffset}kg CO₂ offset today
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Energy Overview</TabsTrigger>
            <TabsTrigger value="solar">Solar Performance</TabsTrigger>
            <TabsTrigger value="forecast">Production Forecast</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Energy Flow */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Flow</CardTitle>
                <CardDescription>
                  Real-time power distribution and storage status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentEnergyData && (
                  <div className="space-y-6">
                    {/* Energy Flow Diagram */}
                    <div className="relative py-6">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Source */}
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            <Sun className="h-12 w-12 text-yellow-500" />
                          </div>
                          <div className="mt-2 text-center font-medium">Solar Array</div>
                          <div className="text-sm text-gray-500">
                            {currentEnergyData.solar.production}kW
                          </div>
                        </div>
                        
                        {/* Battery */}
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Battery className="h-12 w-12 text-blue-500" />
                          </div>
                          <div className="mt-2 text-center font-medium">Battery Storage</div>
                          <div className="text-sm text-gray-500">
                            {currentEnergyData.storage.currentCharge}kWh
                          </div>
                        </div>
                        
                        {/* System */}
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Leaf className="h-12 w-12 text-green-500" />
                          </div>
                          <div className="mt-2 text-center font-medium">Growing System</div>
                          <div className="text-sm text-gray-500">
                            {currentEnergyData.consumption.current}kW
                          </div>
                        </div>
                      </div>
                      
                      {/* Flow Arrows */}
                      <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2">
                        <div className="flex items-center gap-1 text-blue-500">
                          <Bolt className="h-5 w-5" />
                          <div className="text-sm font-medium">
                            {currentEnergyData.storage.status === 'charging' 
                              ? `+${currentEnergyData.storage.chargingRate}kW` 
                              : `-${currentEnergyData.storage.dischargingRate}kW`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-1/2 right-1/3 transform -translate-y-1/2">
                        <div className="flex items-center gap-1 text-green-500">
                          <Bolt className="h-5 w-5" />
                          <div className="text-sm font-medium">
                            {(currentEnergyData.solar.production - 
                              (currentEnergyData.storage.status === 'charging' 
                                ? currentEnergyData.storage.chargingRate 
                                : -currentEnergyData.storage.dischargingRate)).toFixed(1)}kW
                          </div>
                        </div>
                      </div>
                      
                      {/* Grid Exchange - only if there is import/export */}
                      {(currentEnergyData.grid.import > 0 || currentEnergyData.grid.export > 0) && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                          <div className="flex items-center gap-2">
                            {currentEnergyData.grid.export > 0 ? (
                              <>
                                <div className="text-sm font-medium text-green-500">
                                  Exporting: {currentEnergyData.grid.export}kW
                                </div>
                                <Zap className="h-5 w-5 text-green-500" />
                              </>
                            ) : (
                              <>
                                <ZapOff className="h-5 w-5 text-red-500" />
                                <div className="text-sm font-medium text-red-500">
                                  Importing: {currentEnergyData.grid.import}kW
                                </div>
                              </>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">Power Grid</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Energy Distribution */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Energy Consumption Distribution</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { 
                                    name: 'Lighting', 
                                    value: currentEnergyData.consumption.distribution.lighting 
                                  },
                                  { 
                                    name: 'Climate', 
                                    value: currentEnergyData.consumption.distribution.climate 
                                  },
                                  { 
                                    name: 'Pumps', 
                                    value: currentEnergyData.consumption.distribution.pumps 
                                  },
                                  { 
                                    name: 'Automation', 
                                    value: currentEnergyData.consumption.distribution.automation 
                                  },
                                  { 
                                    name: 'Other', 
                                    value: currentEnergyData.consumption.distribution.other 
                                  }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {Object.entries(currentEnergyData.consumption.distribution).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value}%`, 'Consumption']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        {/* Distribution Details */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
                              <span className="text-sm">Lighting</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currentEnergyData.consumption.distribution.lighting}%</span>
                              <span className="text-sm text-gray-500">
                                {(currentEnergyData.consumption.current * currentEnergyData.consumption.distribution.lighting / 100).toFixed(1)}kW
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
                              <span className="text-sm">Climate Control</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currentEnergyData.consumption.distribution.climate}%</span>
                              <span className="text-sm text-gray-500">
                                {(currentEnergyData.consumption.current * currentEnergyData.consumption.distribution.climate / 100).toFixed(1)}kW
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[2] }}></div>
                              <span className="text-sm">Pumps & Irrigation</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currentEnergyData.consumption.distribution.pumps}%</span>
                              <span className="text-sm text-gray-500">
                                {(currentEnergyData.consumption.current * currentEnergyData.consumption.distribution.pumps / 100).toFixed(1)}kW
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[3] }}></div>
                              <span className="text-sm">Automation & Controls</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currentEnergyData.consumption.distribution.automation}%</span>
                              <span className="text-sm text-gray-500">
                                {(currentEnergyData.consumption.current * currentEnergyData.consumption.distribution.automation / 100).toFixed(1)}kW
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[4] }}></div>
                              <span className="text-sm">Other Systems</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{currentEnergyData.consumption.distribution.other}%</span>
                              <span className="text-sm text-gray-500">
                                {(currentEnergyData.consumption.current * currentEnergyData.consumption.distribution.other / 100).toFixed(1)}kW
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Energy Trend */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Energy Generation & Consumption</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={getDataForTimeRange(energyHistory, timeRange)}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FFBB28" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => {
                                const date = new Date(value);
                                return timeRange === '24h' 
                                  ? date.toLocaleTimeString('en-US', { hour: '2-digit' })
                                  : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                              }}
                            />
                            <YAxis />
                            <Tooltip 
                              labelFormatter={(value) => formatDate(value, true)}
                              formatter={(value: any, name: string) => {
                                if (name === 'Battery Level') return [`${value}%`, name];
                                return [`${value} kW`, name];
                              }}
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="solarProduction" 
                              name="Solar Production" 
                              stroke="#FFBB28" 
                              fillOpacity={1} 
                              fill="url(#solarGradient)" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="totalConsumption" 
                              name="Consumption" 
                              stroke="#00C49F" 
                              fillOpacity={1} 
                              fill="url(#consumptionGradient)" 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="batteryLevel" 
                              name="Battery Level" 
                              stroke="#0088FE" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Sustainability Metrics */}
                    <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                      <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-green-500" />
                        Sustainability Impact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Carbon Offset Today</div>
                          <div className="font-medium text-lg">
                            {currentEnergyData.sustainability.carbonOffset} kg CO₂
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Equivalent to planting {Math.round(currentEnergyData.sustainability.carbonOffset / 0.5)} trees
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Water Saved</div>
                          <div className="font-medium text-lg">
                            {currentEnergyData.sustainability.waterSaved} L
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Through closed-loop irrigation
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Renewable Energy</div>
                          <div className="font-medium text-lg">
                            {currentEnergyData.sustainability.renewablePercentage}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Of total energy consumption
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Solar Performance Tab */}
          <TabsContent value="solar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Solar Array Performance</CardTitle>
                <CardDescription>
                  Detailed metrics and optimization analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentEnergyData && (
                  <div className="space-y-6">
                    {/* Solar Array Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Current Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-500">
                            {currentEnergyData.solar.production} kW
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round(currentEnergyData.solar.production / currentEnergyData.solar.capacity * 100)}% of capacity
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Panel Efficiency</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-500">
                            {currentEnergyData.solar.efficiency}%
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Conversion efficiency
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50 dark:bg-gray-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Energy Generated Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-500">
                            {/* This would be calculated from actual data */}
                            {Math.round(currentEnergyData.solar.production * 8.5)} kWh
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Estimated total for today
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Solar Production History */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Solar Production History</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={getDataForTimeRange(energyHistory, timeRange)}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => {
                                const date = new Date(value);
                                return timeRange === '24h' 
                                  ? date.toLocaleTimeString('en-US', { hour: '2-digit' })
                                  : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                              }}
                            />
                            <YAxis label={{ value: 'kW', angle: -90, position: 'insideLeft' }} />
                            <Tooltip 
                              labelFormatter={(value) => formatDate(value, true)}
                              formatter={(value: any) => [`${value} kW`, 'Solar Production']}
                            />
                            <Legend />
                            <Bar 
                              dataKey="solarProduction" 
                              name="Solar Production" 
                              fill="#FFBB28" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Optimization Tips */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Performance Optimization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-2">
                            <Sun className="h-5 w-5 text-yellow-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Panel Cleaning Schedule</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Regular cleaning can increase efficiency by up to 10%. Next scheduled cleaning: 5 days.
                              </p>
                            </div>
                          </div>
                          <div className="ml-8">
                            <Button variant="outline" size="sm" className="mt-2">
                              View Schedule
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-3 mb-2">
                            <Timer className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Load Shifting Opportunity</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Shifting high-consumption operations to 10AM-2PM can increase solar utilization by 15%.
                              </p>
                            </div>
                          </div>
                          <div className="ml-8">
                            <Button variant="outline" size="sm" className="mt-2">
                              View Recommendation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Panel Performance Analysis */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Panel Performance Analysis</h3>
                      <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-3 md:col-span-1">
                            <div className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Array 1</span>
                                <span className="text-sm text-green-500">98% Efficiency</span>
                              </div>
                              <Progress value={98} className="h-2" />
                            </div>
                            <div className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Array 2</span>
                                <span className="text-sm text-green-500">97% Efficiency</span>
                              </div>
                              <Progress value={97} className="h-2" />
                            </div>
                            <div className="mb-4">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Array 3</span>
                                <span className="text-sm text-yellow-500">87% Efficiency</span>
                              </div>
                              <Progress value={87} className="h-2" />
                              <div className="text-xs text-red-500 mt-1">
                                Panels 7-9 showing reduced performance
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-span-3 md:col-span-2 flex flex-col justify-center">
                            <div className="grid grid-cols-4 gap-4">
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`aspect-square border rounded-md flex items-center justify-center text-sm font-medium ${
                                    i >= 6 && i <= 8 
                                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' 
                                      : 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                  }`}
                                >
                                  P{i+1}
                                </div>
                              ))}
                            </div>
                            <div className="text-xs text-center mt-4 text-gray-500">
                              Panel Layout (Solar Array 3)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Production Forecast Tab */}
          <TabsContent value="forecast" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Production Forecast</CardTitle>
                <CardDescription>
                  7-day forecast based on weather predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {weatherData.length > 0 && (
                  <div className="space-y-6">
                    {/* Weather Forecast */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Weather Forecast</h3>
                      <div className="overflow-x-auto">
                        <div className="inline-flex min-w-full">
                          {weatherData.map((data, index) => {
                            const isToday = new Date(data.date).toDateString() === new Date().toDateString();
                            const isPast = new Date(data.date) < new Date(new Date().setHours(0, 0, 0, 0));
                            
                            return (
                              <div 
                                key={index} 
                                className={`text-center p-3 min-w-[120px] border-r last:border-r-0 ${
                                  isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 
                                  isPast ? 'bg-gray-50 dark:bg-gray-800' : ''
                                }`}
                              >
                                <div className="text-sm font-medium mb-1">
                                  {isToday ? 'Today' : formatDate(data.date)}
                                </div>
                                <div className="my-2 flex justify-center">
                                  {getWeatherIcon(data.condition)}
                                </div>
                                <div className="text-sm">
                                  {Math.round(data.temperature)}°C
                                </div>
                                <div className="text-xs text-gray-500">
                                  {Math.round(data.cloudCover)}% cloud cover
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Production Forecast */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Projected Solar Production</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={weatherData.map(weather => ({
                              date: weather.date,
                              production: getSolarForecast(weather),
                              condition: weather.condition
                            }))}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="date" 
                              tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString('en-US', { weekday: 'short' });
                              }}
                            />
                            <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                            <Tooltip 
                              labelFormatter={(value) => formatDate(value)}
                              formatter={(value: any) => [`${value} kWh`, 'Projected Production']}
                            />
                            <Legend />
                            <Bar 
                              dataKey="production" 
                              name="Projected Production" 
                              fill="#FFBB28" 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Energy Balance Forecast */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">Energy Balance Forecast</h3>
                      <div className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Total Production (7 days)</div>
                            <div className="text-xl font-bold text-green-500">
                              {weatherData.reduce((sum, weather) => sum + getSolarForecast(weather), 0).toFixed(1)} kWh
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Estimated Consumption</div>
                            <div className="text-xl font-bold text-blue-500">
                              {(currentEnergyData ? currentEnergyData.consumption.average24h * 24 * 7 : 0).toFixed(1)} kWh
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Projected Balance</div>
                            <div className="text-xl font-bold text-amber-500">
                              {(
                                weatherData.reduce((sum, weather) => sum + getSolarForecast(weather), 0) - 
                                (currentEnergyData ? currentEnergyData.consumption.average24h * 24 * 7 : 0)
                              ).toFixed(1)} kWh
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Sun className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Forecast Analysis</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Based on the weather forecast, your solar production should {
                                  weatherData.reduce((sum, weather) => sum + getSolarForecast(weather), 0) >
                                  (currentEnergyData ? currentEnergyData.consumption.average24h * 24 * 7 : 0)
                                    ? 'exceed your estimated consumption, resulting in a surplus that will be exported to the grid or stored in your battery.'
                                    : 'be lower than your estimated consumption. Consider optimizing energy usage on less sunny days to minimize grid imports.'
                                }
                              </p>
                              
                              <div className="mt-3">
                                <Button variant="outline" size="sm">
                                  View Optimization Suggestions
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnergyHarvestingDashboard;