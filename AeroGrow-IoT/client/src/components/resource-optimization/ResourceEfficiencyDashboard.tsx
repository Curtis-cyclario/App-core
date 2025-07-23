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
  ActivitySquare, 
  Calendar, 
  Droplet, 
  GanttChart, 
  Gauge, 
  History, 
  LightbulbOff, 
  LineChart,
  RefreshCw, 
  Sprout, 
  ThermometerSun, 
  Timer, 
  Wallet, 
  Zap 
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

interface ResourceUsage {
  id: number;
  timestamp: string;
  energy: {
    total: number;
    lighting: number;
    pumps: number;
    hvac: number;
    other: number;
    unit: string;
  };
  water: {
    total: number;
    irrigation: number;
    cooling: number;
    cleaning: number;
    unit: string;
  };
  nutrients: {
    total: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    other: number;
    unit: string;
  };
  efficiency: {
    energy: number;
    water: number;
    nutrients: number;
    overall: number;
  };
  costs: {
    energy: number;
    water: number;
    nutrients: number;
    total: number;
    currency: string;
  };
  production: {
    yield: number;
    quality: number;
    unit: string;
  };
}

interface ResourceForecast {
  date: string;
  energy: number;
  water: number;
  nutrients: number;
  costs: number;
}

interface OptimizationOpportunity {
  id: string;
  type: 'energy' | 'water' | 'nutrients' | 'schedule';
  title: string;
  description: string;
  potentialSavings: number;
  implementation: string;
  roi: number; // Return on investment (months)
  priority: 'high' | 'medium' | 'low';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ResourceEfficiencyDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [currentUsage, setCurrentUsage] = useState<ResourceUsage | null>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<ResourceForecast[]>([]);
  const [opportunities, setOpportunities] = useState<OptimizationOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState<any>(null);
  const [waterMetrics, setWaterMetrics] = useState({
    dailyUsage: '0',
    recirculationRate: '0',
    perPlant: '0',
    waterCycled: '0',
    waterEvaporated: '0',
    reservoirLevel: '0'
  });

  // Get real sensor data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiRequest<any>({
          endpoint: '/api/sensor-data',
          on401: 'throw'
        });
        
        if (data) {
          setSensorData(data);
          
          // Calculate water metrics from sensor data
          const dailyUsage = parseFloat(data.waterUsed || '0');
          const waterCycled = parseFloat(data.waterCycled || '0');
          const waterEvaporated = parseFloat(data.waterEvaporated || '0');
          const reservoirLevel = parseFloat(data.reservoirLevel || '1000');
          
          // Calculate recirculation rate - percentage of water that is recirculated vs used
          const totalWaterInvolved = waterCycled + waterEvaporated;
          const recirculationRate = totalWaterInvolved > 0 
            ? Math.round((waterCycled / totalWaterInvolved) * 100) 
            : 0;
            
          // Estimate per plant usage (assuming 100 plants per system)
          const perPlant = (dailyUsage / 100).toFixed(1);
          
          setWaterMetrics({
            dailyUsage: dailyUsage.toFixed(1),
            recirculationRate: recirculationRate.toString(),
            perPlant,
            waterCycled: waterCycled.toFixed(1),
            waterEvaporated: waterEvaporated.toFixed(1),
            reservoirLevel: reservoirLevel.toFixed(1)
          });
        }
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      }
    };
    
    fetchData();
    
    // Set up an interval to fetch data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchResourceData = async () => {
    try {
      setLoading(true);
      
      // Get real sensor data
      try {
        const data = await apiRequest<any>({
          endpoint: '/api/sensor-data',
          on401: 'throw'
        });
        
        if (data) {
          setSensorData(data);
        }
      } catch (error) {
        console.error('Failed to fetch sensor data:', error);
      }
      
      // For other metrics, we'll use simulated data for this prototype
      
      // Current resource usage
      const mockCurrentUsage: ResourceUsage = {
        id: 1,
        timestamp: new Date().toISOString(),
        energy: {
          total: 125.3,
          lighting: 78.2,
          pumps: 23.4,
          hvac: 15.7,
          other: 8.0,
          unit: 'kWh'
        },
        water: {
          total: 450.6,
          irrigation: 360.5,
          cooling: 60.1,
          cleaning: 30.0,
          unit: 'L'
        },
        nutrients: {
          total: 9.8,
          nitrogen: 4.2,
          phosphorus: 2.3,
          potassium: 2.5,
          other: 0.8,
          unit: 'kg'
        },
        efficiency: {
          energy: 82,
          water: 88,
          nutrients: 91,
          overall: 85
        },
        costs: {
          energy: 18.75,
          water: 3.60,
          nutrients: 29.40,
          total: 51.75,
          currency: 'USD'
        },
        production: {
          yield: 85,
          quality: 93,
          unit: 'kg'
        }
      };
      
      setCurrentUsage(mockCurrentUsage);
      
      // Historical data for charts
      const now = new Date();
      const mockHistoricalData = [];
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        mockHistoricalData.push({
          date: date.toISOString().split('T')[0],
          energy: 115 + Math.random() * 30,
          water: 430 + Math.random() * 50,
          nutrients: 9 + Math.random() * 2,
          costs: 48 + Math.random() * 8,
          efficiency: 80 + Math.random() * 15,
        });
      }
      
      setHistoricalData(mockHistoricalData);
      
      // Forecast data
      const mockForecastData = [];
      
      for (let i = 1; i <= 14; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        
        // Create a generally downward trend for optimization
        const optimizationFactor = 1 - (i * 0.005);
        
        mockForecastData.push({
          date: date.toISOString().split('T')[0],
          energy: 125 * optimizationFactor,
          water: 450 * optimizationFactor,
          nutrients: 9.8 * optimizationFactor,
          costs: 51.75 * optimizationFactor
        });
      }
      
      setForecastData(mockForecastData);
      
      // Optimization opportunities
      const mockOpportunities: OptimizationOpportunity[] = [
        {
          id: '1',
          type: 'energy',
          title: 'Adjust Light Scheduling',
          description: 'Optimize lighting schedule based on plant growth phase to reduce energy consumption while maintaining yield.',
          potentialSavings: 15.2,
          implementation: 'Medium - Requires programming changes to light controllers',
          roi: 2.4,
          priority: 'high'
        },
        {
          id: '2',
          type: 'water',
          title: 'Install Precision Drip System',
          description: 'Replace current irrigation system with precision drip system to reduce water waste.',
          potentialSavings: 22.5,
          implementation: 'High - Requires hardware changes and installation',
          roi: 8.1,
          priority: 'medium'
        },
        {
          id: '3',
          type: 'nutrients',
          title: 'Dynamic Nutrient Dosing',
          description: 'Implement real-time nutrient monitoring and dosing system to reduce waste.',
          potentialSavings: 18.7,
          implementation: 'Medium - Requires sensor installation and system integration',
          roi: 5.3,
          priority: 'high'
        },
        {
          id: '4',
          type: 'schedule',
          title: 'Off-Peak Energy Usage',
          description: 'Shift energy-intensive operations to off-peak hours to reduce energy costs.',
          potentialSavings: 12.3,
          implementation: 'Low - Requires schedule adjustments only',
          roi: 0.5,
          priority: 'high'
        },
      ];
      
      setOpportunities(mockOpportunities);
    } catch (error) {
      console.error('Failed to fetch resource data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDataForTimeRange = (data: any[], range: string) => {
    if (!data.length) return [];
    
    let filteredData = [...data];
    const now = new Date();
    
    switch (range) {
      case '24h':
        // Last 24 hours - would need hourly data in real implementation
        filteredData = filteredData.slice(-24);
        break;
      case '7d':
        // Last 7 days
        filteredData = filteredData.slice(-7);
        break;
      case '30d':
        // Last 30 days
        filteredData = filteredData.slice(-30);
        break;
      case '90d':
        // Last 90 days
        filteredData = filteredData.slice(-90);
        break;
      default:
        break;
    }
    
    return filteredData;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gauge className="h-6 w-6 text-primary" />
            Resource Efficiency Optimization
          </h1>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <History className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
                <SelectItem value="30d">Last 30d</SelectItem>
                <SelectItem value="90d">Last 90d</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={fetchResourceData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {currentUsage && (
              <>
                {/* Efficiency Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-primary" />
                        Overall Efficiency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-2">
                        <div className="text-4xl font-bold">{currentUsage.efficiency.overall}%</div>
                        <Progress value={currentUsage.efficiency.overall} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Energy Efficiency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-2">
                        <div className="text-4xl font-bold">{currentUsage.efficiency.energy}%</div>
                        <Progress value={currentUsage.efficiency.energy} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Droplet className="h-5 w-5 text-blue-500" />
                        Water Efficiency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-2">
                        <div className="text-4xl font-bold">{currentUsage.efficiency.water}%</div>
                        <Progress value={currentUsage.efficiency.water} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-green-500" />
                        Nutrient Efficiency
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-2">
                        <div className="text-4xl font-bold">{currentUsage.efficiency.nutrients}%</div>
                        <Progress value={currentUsage.efficiency.nutrients} className="h-2 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Current Usage and Cost */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Resource Usage</CardTitle>
                      <CardDescription>
                        Today's consumption metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Energy breakdown */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <h3 className="text-sm font-medium flex items-center gap-1">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              Energy Usage
                            </h3>
                            <span className="text-sm text-muted-foreground">{currentUsage.energy.total} {currentUsage.energy.unit}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="w-full h-5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div className="flex h-full">
                                <div 
                                  className="bg-yellow-400" 
                                  style={{ width: `${(currentUsage.energy.lighting / currentUsage.energy.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-blue-400" 
                                  style={{ width: `${(currentUsage.energy.pumps / currentUsage.energy.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-red-400" 
                                  style={{ width: `${(currentUsage.energy.hvac / currentUsage.energy.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-gray-400" 
                                  style={{ width: `${(currentUsage.energy.other / currentUsage.energy.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <span>Lighting: {currentUsage.energy.lighting} {currentUsage.energy.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                <span>Pumps: {currentUsage.energy.pumps} {currentUsage.energy.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <span>HVAC: {currentUsage.energy.hvac} {currentUsage.energy.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <span>Other: {currentUsage.energy.other} {currentUsage.energy.unit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Water breakdown */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <h3 className="text-sm font-medium flex items-center gap-1">
                              <Droplet className="h-4 w-4 text-blue-500" />
                              Water Usage
                            </h3>
                            <span className="text-sm text-muted-foreground">{currentUsage.water.total} {currentUsage.water.unit}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="w-full h-5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div className="flex h-full">
                                <div 
                                  className="bg-blue-500" 
                                  style={{ width: `${(currentUsage.water.irrigation / currentUsage.water.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-cyan-400" 
                                  style={{ width: `${(currentUsage.water.cooling / currentUsage.water.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-indigo-400" 
                                  style={{ width: `${(currentUsage.water.cleaning / currentUsage.water.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span>Irrigation: {currentUsage.water.irrigation} {currentUsage.water.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                                <span>Cooling: {currentUsage.water.cooling} {currentUsage.water.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                                <span>Cleaning: {currentUsage.water.cleaning} {currentUsage.water.unit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Nutrients breakdown */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <h3 className="text-sm font-medium flex items-center gap-1">
                              <Sprout className="h-4 w-4 text-green-500" />
                              Nutrient Usage
                            </h3>
                            <span className="text-sm text-muted-foreground">{currentUsage.nutrients.total} {currentUsage.nutrients.unit}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="w-full h-5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              <div className="flex h-full">
                                <div 
                                  className="bg-green-500" 
                                  style={{ width: `${(currentUsage.nutrients.nitrogen / currentUsage.nutrients.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-purple-400" 
                                  style={{ width: `${(currentUsage.nutrients.phosphorus / currentUsage.nutrients.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-orange-400" 
                                  style={{ width: `${(currentUsage.nutrients.potassium / currentUsage.nutrients.total) * 100}%` }}
                                ></div>
                                <div 
                                  className="bg-gray-400" 
                                  style={{ width: `${(currentUsage.nutrients.other / currentUsage.nutrients.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Nitrogen: {currentUsage.nutrients.nitrogen} {currentUsage.nutrients.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                                <span>Phosphorus: {currentUsage.nutrients.phosphorus} {currentUsage.nutrients.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                <span>Potassium: {currentUsage.nutrients.potassium} {currentUsage.nutrients.unit}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <span>Other: {currentUsage.nutrients.other} {currentUsage.nutrients.unit}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Breakdown</CardTitle>
                      <CardDescription>
                        Daily operating expenses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Energy', value: currentUsage.costs.energy },
                                  { name: 'Water', value: currentUsage.costs.water },
                                  { name: 'Nutrients', value: currentUsage.costs.nutrients }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {[
                                  { name: 'Energy', value: currentUsage.costs.energy },
                                  { name: 'Water', value: currentUsage.costs.water },
                                  { name: 'Nutrients', value: currentUsage.costs.nutrients }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`${value} ${currentUsage.costs.currency}`, 'Cost']} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[0] }}></div>
                              <span className="text-sm">Energy</span>
                            </div>
                            <div className="text-base font-medium">{currentUsage.costs.energy} {currentUsage.costs.currency}</div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[1] }}></div>
                              <span className="text-sm">Water</span>
                            </div>
                            <div className="text-base font-medium">{currentUsage.costs.water} {currentUsage.costs.currency}</div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[2] }}></div>
                              <span className="text-sm">Nutrients</span>
                            </div>
                            <div className="text-base font-medium">{currentUsage.costs.nutrients} {currentUsage.costs.currency}</div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4" />
                              <span className="text-sm font-medium">Total</span>
                            </div>
                            <div className="text-lg font-bold">{currentUsage.costs.total} {currentUsage.costs.currency}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Trends and Forecasts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Usage Trends & Forecast</CardTitle>
                    <CardDescription>
                      Historical data and predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            ...getDataForTimeRange(historicalData, timeRange),
                            ...forecastData.slice(0, 7) // Show 7 days of forecast
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FFBB28" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF8042" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FF8042" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{fontSize: 12}} />
                          <YAxis />
                          <Tooltip labelFormatter={value => `Date: ${value}`} />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="energy" 
                            name="Energy (kWh)" 
                            stroke="#FFBB28" 
                            fillOpacity={1} 
                            fill="url(#energyGradient)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="water" 
                            name="Water (L)" 
                            stroke="#0088FE" 
                            fillOpacity={1} 
                            fill="url(#waterGradient)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="costs" 
                            name="Cost (USD)" 
                            stroke="#FF8042" 
                            fillOpacity={1} 
                            fill="url(#costGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex justify-center items-center mt-4">
                      <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                        <Calendar className="h-4 w-4 mr-1" />
                        Historical Data
                      </Badge>
                      <div className="mx-2 border-t border-gray-300 dark:border-gray-600 w-16"></div>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                        <LineChart className="h-4 w-4 mr-1" />
                        Forecast
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
          
          {/* Energy Tab */}
          <TabsContent value="energy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Optimization</CardTitle>
                <CardDescription>
                  Detailed energy usage analytics and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Peak Energy Usage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">10:00 AM - 2:00 PM</div>
                        <p className="text-xs text-gray-500 mt-1">Highest consumption period</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Daily Consumption</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">125.3 kWh</div>
                        <p className="text-xs text-gray-500 mt-1">↓ 4.2% from last week</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Cost per Plant</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">$0.22 / day</div>
                        <p className="text-xs text-gray-500 mt-1">Energy cost per plant</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="h-64">
                    <h3 className="text-sm font-medium mb-2">Daily Energy Profile</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { time: '12 AM', lighting: 5.2, pumps: 1.8, hvac: 0.9 },
                          { time: '3 AM', lighting: 5.2, pumps: 1.8, hvac: 0.8 },
                          { time: '6 AM', lighting: 7.8, pumps: 2.1, hvac: 1.2 },
                          { time: '9 AM', lighting: 9.5, pumps: 3.2, hvac: 2.4 },
                          { time: '12 PM', lighting: 8.6, pumps: 2.8, hvac: 3.1 },
                          { time: '3 PM', lighting: 7.5, pumps: 2.5, hvac: 2.8 },
                          { time: '6 PM', lighting: 6.2, pumps: 2.2, hvac: 1.8 },
                          { time: '9 PM', lighting: 5.5, pumps: 1.9, hvac: 1.1 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="lighting" name="Lighting" stackId="a" fill="#FFBB28" />
                        <Bar dataKey="pumps" name="Pumps" stackId="a" fill="#0088FE" />
                        <Bar dataKey="hvac" name="HVAC" stackId="a" fill="#FF8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Optimization Tips</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <LightbulbOff className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Lighting Schedule Adjustment</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Reducing lighting duration during non-critical growth phases can save up to 15% energy.
                            </p>
                          </div>
                        </div>
                        <div className="ml-8">
                          <Button variant="outline" size="sm" className="mt-2">
                            View Recommendation
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <Gauge className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Pump Efficiency Upgrade</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Variable frequency drive pumps can reduce energy consumption by 30-50% compared to fixed speed.
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Water Tab */}
          <TabsContent value="water" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Water Management</CardTitle>
                <CardDescription>
                  Water usage analytics and conservation opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Daily Water Usage</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{waterMetrics.dailyUsage} L</div>
                        <p className="text-xs text-gray-500 mt-1">Total water actually consumed</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Recirculation Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{waterMetrics.recirculationRate}%</div>
                        <p className="text-xs text-gray-500 mt-1">Of water is recirculated</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Water per Plant</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{waterMetrics.perPlant} L / day</div>
                        <p className="text-xs text-gray-500 mt-1">Average per plant usage</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Water Cycled</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-cyan-500">{waterMetrics.waterCycled} L</div>
                        <p className="text-xs text-gray-500 mt-1">Water cycled through system</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Water Evaporated</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-500">{waterMetrics.waterEvaporated} L</div>
                        <p className="text-xs text-gray-500 mt-1">Lost to evaporation (VPD based)</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Reservoir Level</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-500">{waterMetrics.reservoirLevel} L</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(parseFloat(waterMetrics.reservoirLevel) / 1000) * 100}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Maximum capacity: 1000L</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="h-64">
                    <h3 className="text-sm font-medium mb-2">Water Consumption Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getDataForTimeRange(historicalData, timeRange)}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="waterGradientFull" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="water" 
                          name="Water (L)" 
                          stroke="#0088FE" 
                          fillOpacity={1} 
                          fill="url(#waterGradientFull)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Water Conservation Opportunities</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <Droplet className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Precision Irrigation</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Installing drip irrigation can reduce water usage by up to 60% compared to conventional systems.
                            </p>
                          </div>
                        </div>
                        <div className="ml-8">
                          <Button variant="outline" size="sm" className="mt-2">
                            View Recommendation
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <Timer className="h-5 w-5 text-purple-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Water Cycle Optimization</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Optimizing watering cycles based on plant growth stage can save 20-30% of water.
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
                <CardDescription>
                  Identified ways to improve efficiency and reduce costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                          ${opportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0).toFixed(2)} / month
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Total potential savings</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. ROI Period</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                          {(opportunities.reduce((sum, opp) => sum + opp.roi, 0) / opportunities.length).toFixed(1)} months
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Return on investment</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gray-50 dark:bg-gray-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-500">
                          {opportunities.length} identified
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Optimization actions</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-2">Optimization Recommendations</h3>
                    
                    {opportunities.map((opportunity) => (
                      <Card key={opportunity.id} className={`${
                        opportunity.priority === 'high' 
                          ? 'border-green-500 dark:border-green-700' 
                          : opportunity.priority === 'medium'
                            ? 'border-yellow-500 dark:border-yellow-700' 
                            : 'border-gray-500 dark:border-gray-700'
                      }`}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              {opportunity.type === 'energy' && <Zap className="h-5 w-5 text-yellow-500" />}
                              {opportunity.type === 'water' && <Droplet className="h-5 w-5 text-blue-500" />}
                              {opportunity.type === 'nutrients' && <Sprout className="h-5 w-5 text-green-500" />}
                              {opportunity.type === 'schedule' && <Timer className="h-5 w-5 text-purple-500" />}
                              <CardTitle>{opportunity.title}</CardTitle>
                            </div>
                            <Badge variant={
                              opportunity.priority === 'high' ? 'default' : 
                              opportunity.priority === 'medium' ? 'secondary' : 'outline'
                            }>
                              {opportunity.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                          <CardDescription>
                            {opportunity.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                            <div>
                              <div className="text-sm text-gray-500">Potential Monthly Savings</div>
                              <div className="text-lg font-bold text-green-500">${opportunity.potentialSavings.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Implementation Complexity</div>
                              <div className="text-lg font-medium">{opportunity.implementation}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">ROI Period</div>
                              <div className="text-lg font-medium">{opportunity.roi} months</div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end pt-0">
                          <Button size="sm">Apply Recommendation</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="h-64">
                    <h3 className="text-sm font-medium mb-2">Efficiency Forecast</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Current', efficiency: 85 },
                          { month: 'Month 1', efficiency: 87 },
                          { month: 'Month 2', efficiency: 89 },
                          { month: 'Month 3', efficiency: 90 },
                          { month: 'Month 4', efficiency: 91.5 },
                          { month: 'Month 5', efficiency: 92.5 },
                          { month: 'Month 6', efficiency: 93.2 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[80, 100]} label={{ value: 'Efficiency %', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="efficiency" 
                          name="Overall Efficiency" 
                          stroke="#00C49F" 
                          strokeWidth={2}
                          dot={{ r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button>
                Generate Optimization Plan <GanttChart className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResourceEfficiencyDashboard;