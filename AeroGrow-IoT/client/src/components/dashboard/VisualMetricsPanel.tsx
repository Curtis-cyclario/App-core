import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollResponsiveContainer from '@/components/ScrollResponsiveContainer';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Droplets, 
  Thermometer, 
  Sun, 
  Zap,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'optimal' | 'warning' | 'critical';
  icon: React.ReactNode;
  color: string;
}

const VisualMetricsPanel: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  
  const { data: sensorData } = useQuery({
    queryKey: ['/api/sensor-data'],
    queryFn: async () => {
      const response = await fetch('/api/sensor-data');
      return response.json();
    },
    refetchInterval: 5000
  });

  const { data: sensorHistory } = useQuery({
    queryKey: ['/api/sensor-data/history', timeRange],
    queryFn: async () => {
      const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
      const response = await fetch(`/api/sensor-data/history?hours=${hours}`);
      return response.json();
    }
  });

  const { data: devices } = useQuery({
    queryKey: ['/api/devices'],
    queryFn: async () => {
      const response = await fetch('/api/devices');
      return response.json();
    }
  });

  const getMetrics = (): MetricData[] => {
    if (!sensorData) return [];

    return [
      {
        label: 'Temperature',
        value: 23.2,
        unit: '°C',
        trend: 'up',
        trendValue: 2.3,
        status: 'optimal',
        icon: <Thermometer className="w-5 h-5" />,
        color: '#ef4444'
      },
      {
        label: 'Humidity',
        value: 76.0,
        unit: '%',
        trend: 'stable',
        trendValue: 0.5,
        status: 'optimal',
        icon: <Droplets className="w-5 h-5" />,
        color: '#3b82f6'
      },
      {
        label: 'Water Level',
        value: parseFloat(sensorData.waterLevel),
        unit: '%',
        trend: parseFloat(sensorData.waterLevel) < 50 ? 'down' : 'up',
        trendValue: 5.2,
        status: parseFloat(sensorData.waterLevel) > 70 ? 'optimal' : parseFloat(sensorData.waterLevel) > 40 ? 'warning' : 'critical',
        icon: <Droplets className="w-5 h-5" />,
        color: '#06b6d4'
      },
      {
        label: 'Nutrients',
        value: parseFloat(sensorData.nutrientLevel),
        unit: '%',
        trend: 'up',
        trendValue: 1.8,
        status: parseFloat(sensorData.nutrientLevel) > 70 ? 'optimal' : 'warning',
        icon: <Zap className="w-5 h-5" />,
        color: '#10b981'
      },
      {
        label: 'Light Intensity',
        value: 32.0,
        unit: 'LUX',
        trend: 'stable',
        trendValue: 0.1,
        status: 'optimal',
        icon: <Sun className="w-5 h-5" />,
        color: '#f59e0b'
      },
      {
        label: 'System Health',
        value: devices ? Math.round((devices.filter((d: any) => d.status === 'online').length / devices.length) * 100) : 0,
        unit: '%',
        trend: 'up',
        trendValue: 2.1,
        status: 'optimal',
        icon: <Activity className="w-5 h-5" />,
        color: '#8b5cf6'
      }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-emerald-400 bg-emerald-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  const getChartData = () => {
    if (!sensorHistory) return null;

    const last24Hours = sensorHistory.slice(-24);
    
    return {
      labels: last24Hours.map((_: any, i: number) => `${i}h`),
      datasets: [
        {
          label: 'Temperature (°C)',
          data: last24Hours.map((d: any) => parseFloat(d.temperature)),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Humidity (%)',
          data: last24Hours.map((d: any) => parseFloat(d.humidity)),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const getDeviceStatusChart = () => {
    if (!devices) return null;

    const onlineCount = devices.filter((d: any) => d.status === 'online').length;
    const offlineCount = devices.filter((d: any) => d.status === 'offline').length;
    const warningCount = devices.filter((d: any) => d.status === 'warning').length;

    return {
      labels: ['Online', 'Offline', 'Warning'],
      datasets: [{
        data: [onlineCount, offlineCount, warningCount],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0
      }]
    };
  };

  const metrics = getMetrics();
  const chartData = getChartData();
  const deviceChart = getDeviceStatusChart();

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric, index) => (
          <ScrollResponsiveContainer 
            key={metric.label} 
            enableDrag={true}
            className="h-full scroll-interactive"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="glass-enhanced hover:glass-warm transition-all duration-300 border-0 h-full">
              <CardContent className="p-6 m-0">
                <div className="flex items-center justify-between mb-3">
                  <div style={{ color: metric.color }}>
                    {metric.icon}
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-white">
                    {metric.value.toFixed(1)}{metric.unit}
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    {metric.label}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.trend)}
                      <span className="text-xs text-slate-300">
                        {metric.trendValue.toFixed(1)}%
                      </span>
                    </div>
                    
                    <Progress 
                      value={Math.min(100, (metric.value / (metric.unit === '°C' ? 30 : 100)) * 100)} 
                      className="w-16 h-2" 
                    />
                  </div>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          </ScrollResponsiveContainer>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Trends */}
        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-emerald-400" />
              Environmental Trends (24h)
            </CardTitle>
            <CardDescription className="text-slate-300">
              Temperature and humidity patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData && (
              <div className="h-64">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                    scales: {
                      x: {
                        display: true,
                        title: {
                          display: true,
                          text: 'Time (hours ago)',
                          color: '#94a3b8'
                        },
                        ticks: { color: '#94a3b8' },
                        grid: { color: 'rgba(148, 163, 184, 0.1)' }
                      },
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        title: {
                          display: true,
                          text: 'Temperature (°C)',
                          color: '#ef4444'
                        },
                        ticks: { color: '#ef4444' },
                        grid: { color: 'rgba(239, 68, 68, 0.1)' }
                      },
                      y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        title: {
                          display: true,
                          text: 'Humidity (%)',
                          color: '#3b82f6'
                        },
                        ticks: { color: '#3b82f6' },
                        grid: { drawOnChartArea: false }
                      }
                    },
                    plugins: {
                      legend: {
                        labels: { color: '#e2e8f0' }
                      }
                    }
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Status Distribution */}
        <Card className="bg-slate-800/30 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-emerald-400" />
              Device Status Distribution
            </CardTitle>
            <CardDescription className="text-slate-300">
              Current operational status of all devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {deviceChart && (
              <div className="h-64 flex items-center justify-center">
                <div style={{ width: '200px', height: '200px' }}>
                  <Doughnut
                    data={deviceChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: { 
                            color: '#e2e8f0',
                            padding: 20
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
            
            {devices && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-emerald-400 text-2xl font-bold">
                    {devices.filter((d: any) => d.status === 'online').length}
                  </div>
                  <div className="text-slate-400 text-sm">Online</div>
                </div>
                <div>
                  <div className="text-red-400 text-2xl font-bold">
                    {devices.filter((d: any) => d.status === 'offline').length}
                  </div>
                  <div className="text-slate-400 text-sm">Offline</div>
                </div>
                <div>
                  <div className="text-yellow-400 text-2xl font-bold">
                    {devices.filter((d: any) => d.status === 'warning').length}
                  </div>
                  <div className="text-slate-400 text-sm">Warning</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-emerald-400" />
            System Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Overall Efficiency', value: 94.2, target: 95, unit: '%', color: '#10b981' },
              { label: 'Energy Usage', value: 76.8, target: 80, unit: 'kWh', color: '#f59e0b' },
              { label: 'Water Efficiency', value: 88.5, target: 90, unit: '%', color: '#06b6d4' },
              { label: 'Yield Rate', value: 92.1, target: 95, unit: '%', color: '#8b5cf6' }
            ].map((indicator, index) => (
              <motion.div
                key={indicator.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-slate-700"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke={indicator.color}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(indicator.value / 100) * 226.19} 226.19`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {indicator.value.toFixed(0)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-white font-medium">{indicator.label}</div>
                  <div className="text-slate-400 text-sm">
                    Target: {indicator.target}{indicator.unit}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualMetricsPanel;