import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Zap,
  Droplets,
  Thermometer,
  Leaf,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Users,
  Activity
} from 'lucide-react';
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

const AdvancedAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  // Real-time metrics data
  const kpiMetrics = {
    totalRevenue: { value: 2847392, change: 12.5, trend: 'up' },
    yieldEfficiency: { value: 94.7, change: 3.2, trend: 'up' },
    energyEfficiency: { value: 87.3, change: -1.8, trend: 'down' },
    customerSatisfaction: { value: 96.2, change: 2.1, trend: 'up' },
    operationalCosts: { value: 186420, change: -5.3, trend: 'down' },
    plantHealth: { value: 92.8, change: 1.9, trend: 'up' }
  };

  // Performance trend data
  const performanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Yield (kg)',
        data: [2340, 2890, 3120, 3650, 4200, 4750],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Energy Usage (kWh)',
        data: [1800, 1750, 1900, 1820, 1780, 1650],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ],
  };

  // Resource utilization data
  const resourceData = {
    labels: ['Water', 'Energy', 'Nutrients', 'Labor', 'Equipment'],
    datasets: [
      {
        data: [85, 78, 92, 67, 88],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Tower performance comparison
  const towerComparisonData = {
    labels: ['Tower 1', 'Tower 2', 'Tower 3', 'Tower 4', 'Tower 5'],
    datasets: [
      {
        label: 'Yield Efficiency (%)',
        data: [94, 87, 96, 91, 89],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Health Score (%)',
        data: [92, 89, 95, 88, 91],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const predictiveInsights = [
    {
      id: 1,
      type: 'optimization',
      title: 'Nutrient Optimization Opportunity',
      description: 'Tower 2 can increase yield by 8% with adjusted nitrogen levels',
      impact: 'High',
      timeframe: '2 weeks',
      icon: Leaf,
      color: 'emerald'
    },
    {
      id: 2,
      type: 'maintenance',
      title: 'Preventive Maintenance Due',
      description: 'Irrigation system in Tower 4 requires scheduled maintenance',
      impact: 'Medium',
      timeframe: '5 days',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      id: 3,
      type: 'revenue',
      title: 'Market Demand Spike Expected',
      description: 'Basil demand projected to increase 15% next month',
      impact: 'High',
      timeframe: '3 weeks',
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb',
          font: {
            size: 14
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(59, 130, 246, 0.2)',
          lineWidth: 1,
        },
        ticks: {
          color: '#d1d5db',
          font: {
            size: 12,
          },
        },
        border: {
          color: 'rgba(59, 130, 246, 0.3)',
        },
      },
      y: {
        grid: {
          color: 'rgba(59, 130, 246, 0.2)',
          lineWidth: 1,
        },
        ticks: {
          color: '#d1d5db',
          font: {
            size: 12,
          },
        },
        border: {
          color: 'rgba(59, 130, 246, 0.3)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 13
          },
          padding: 15,
        },
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-radial from-teal-500/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 organic-card p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Advanced Analytics & Intelligence</h1>
                <p className="text-emerald-200">Real-time insights and predictive analytics for optimal performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleRefresh}
                className="organic-button-secondary"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button className="organic-button-primary">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {Object.entries(kpiMetrics).map(([key, metric], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="organic-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-2xl font-bold text-white">
                        {key.includes('Revenue') || key.includes('Costs') ? '$' : ''}
                        {metric.value.toLocaleString()}
                        {key.includes('Efficiency') || key.includes('Health') || key.includes('Satisfaction') ? '%' : ''}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-1 ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendingUp className={`h-4 w-4 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                      <span className="text-sm font-medium">{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Analytics Content */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="organic-card p-2 flex flex-wrap justify-center gap-2 mb-6">
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <LineChart className="h-4 w-4 mr-2" />
              Performance Trends
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <PieChart className="h-4 w-4 mr-2" />
              Resource Analysis
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              Tower Comparison
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <Eye className="h-4 w-4 mr-2" />
              Predictive Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <LineChart className="h-5 w-5 text-emerald-400" />
                  <span>Performance Trends Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Line data={performanceTrendData} options={chartOptions as any} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <PieChart className="h-5 w-5 text-emerald-400" />
                    <span>Resource Utilization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Doughnut data={resourceData} options={doughnutOptions as any} />
                  </div>
                </CardContent>
              </Card>

              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <span>Efficiency Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { name: 'Water Efficiency', value: 89, color: 'blue' },
                      { name: 'Energy Efficiency', value: 76, color: 'yellow' },
                      { name: 'Nutrient Efficiency', value: 94, color: 'green' },
                      { name: 'Space Utilization', value: 82, color: 'purple' }
                    ].map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-white">{metric.name}</span>
                          <span className="text-sm font-bold text-emerald-400">{metric.value}%</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <BarChart3 className="h-5 w-5 text-emerald-400" />
                  <span>Tower Performance Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <Bar data={towerComparisonData} options={chartOptions as any} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Eye className="h-5 w-5 text-emerald-400" />
                    <span>AI-Powered Predictive Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {predictiveInsights.map((insight) => {
                      const IconComponent = insight.icon;
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: insight.id * 0.1 }}
                          className="p-4 bg-gray-800/50 border border-gray-600 rounded-xl"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${insight.color}-500/20 flex items-center justify-center`}>
                              <IconComponent className={`h-4 w-4 text-${insight.color}-400`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white text-sm mb-1">{insight.title}</h3>
                              <p className="text-xs text-gray-300 mb-2">{insight.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge className={`bg-${insight.color}-500/20 text-${insight.color}-400 border-${insight.color}-500/30 text-xs`}>
                                  {insight.impact} Impact
                                </Badge>
                                <span className="text-xs text-gray-400">{insight.timeframe}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;