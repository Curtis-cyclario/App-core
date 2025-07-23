import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  TrendingUp,
  Calendar,
  FileText,
  Activity,
  Zap,
  Droplets,
  Thermometer,
  Lightbulb,
  Cpu,
  Shield,
  BarChart3,
  PieChart,
  Target,
  Users,
  MapPin,
  History,
  Bell,
  Download
} from 'lucide-react';

interface MaintenanceItem {
  id: string;
  type: 'preventive' | 'predictive' | 'emergency' | 'routine';
  priority: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  description: string;
  dueDate: string;
  estimatedDuration: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  location: string;
  healthScore: number;
  lastMaintenance: string;
  nextPredictedFailure?: string;
}

interface HealthMetric {
  component: string;
  currentHealth: number;
  degradationRate: number;
  remainingLife: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastInspection: string;
}

const PredictiveMaintenance = () => {
  const [activeMainTab, setActiveMainTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('dashboard');

  // Sample maintenance data
  const maintenanceItems: MaintenanceItem[] = [
    {
      id: 'PM001',
      type: 'predictive',
      priority: 'high',
      component: 'Water Pump A',
      description: 'Bearing vibration levels indicate replacement needed within 2 weeks',
      dueDate: '2025-06-23',
      estimatedDuration: '4 hours',
      assignedTo: 'John Smith',
      status: 'pending',
      location: 'Tower 1 - Level 2',
      healthScore: 65,
      lastMaintenance: '2025-05-15',
      nextPredictedFailure: '2025-06-25'
    },
    {
      id: 'PM002',
      type: 'preventive',
      priority: 'medium',
      component: 'LED Panel Array',
      description: 'Scheduled cleaning and inspection of light panels',
      dueDate: '2025-06-15',
      estimatedDuration: '2 hours',
      assignedTo: 'Sarah Johnson',
      status: 'in-progress',
      location: 'Tower 3 - All Levels',
      healthScore: 88,
      lastMaintenance: '2025-05-01'
    },
    {
      id: 'PM003',
      type: 'routine',
      priority: 'low',
      component: 'Nutrient Tank Sensors',
      description: 'Weekly calibration of pH and EC sensors',
      dueDate: '2025-06-12',
      estimatedDuration: '1 hour',
      assignedTo: 'Mike Davis',
      status: 'completed',
      location: 'Central Hub',
      healthScore: 95,
      lastMaintenance: '2025-06-05'
    },
    {
      id: 'PM004',
      type: 'emergency',
      priority: 'critical',
      component: 'Climate Control Unit',
      description: 'Temperature fluctuations detected - immediate inspection required',
      dueDate: '2025-06-10',
      estimatedDuration: '6 hours',
      assignedTo: 'Emergency Team',
      status: 'overdue',
      location: 'Tower 2 - Climate Zone',
      healthScore: 35,
      lastMaintenance: '2025-04-20'
    }
  ];

  const healthMetrics: HealthMetric[] = [
    { component: 'Water Pumps', currentHealth: 72, degradationRate: 2.1, remainingLife: 45, riskLevel: 'medium', lastInspection: '2025-06-05' },
    { component: 'LED Systems', currentHealth: 89, degradationRate: 0.8, remainingLife: 120, riskLevel: 'low', lastInspection: '2025-06-08' },
    { component: 'Sensors Network', currentHealth: 94, degradationRate: 0.5, remainingLife: 180, riskLevel: 'low', lastInspection: '2025-06-09' },
    { component: 'Climate Control', currentHealth: 41, degradationRate: 4.2, remainingLife: 12, riskLevel: 'critical', lastInspection: '2025-06-01' },
    { component: 'Nutrient System', currentHealth: 78, degradationRate: 1.5, remainingLife: 68, riskLevel: 'medium', lastInspection: '2025-06-07' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-300';
      case 'high': return 'border-orange-500/50 bg-orange-500/10 text-orange-300';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300';
      case 'low': return 'border-green-500/50 bg-green-500/10 text-green-300';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-300';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Settings className="h-8 w-8 mr-3 text-emerald-400" />
                Predictive Maintenance Hub
              </h1>
              <p className="text-emerald-200 mt-2">AI-powered maintenance scheduling and system health monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">94%</div>
                <div className="text-sm text-emerald-200">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">12</div>
                <div className="text-sm text-blue-200">Active Tasks</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
          <TabsList className="organic-card p-3 flex flex-wrap justify-center gap-3 border-[10px] border-transparent mb-6 overflow-x-auto min-h-[70px] items-center">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-3 whitespace-nowrap flex-shrink-0 min-w-[120px] flex items-center justify-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Main</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-3 whitespace-nowrap flex-shrink-0 min-w-[120px] flex items-center justify-center"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tasks</span>
              <span className="sm:hidden">Tasks</span>
            </TabsTrigger>
            <TabsTrigger 
              value="health" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-3 whitespace-nowrap flex-shrink-0 min-w-[120px] flex items-center justify-center"
            >
              <Activity className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Health</span>
              <span className="sm:hidden">Health</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-3 whitespace-nowrap flex-shrink-0 min-w-[120px] flex items-center justify-center"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="scheduling" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-3 whitespace-nowrap flex-shrink-0 min-w-[120px] flex items-center justify-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Schedule</span>
              <span className="sm:hidden">Time</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-[10px]">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
              <TabsList className="organic-card p-2 flex flex-wrap justify-start gap-2 border-[10px] border-transparent mb-4 overflow-x-auto">
                <TabsTrigger value="dashboard" className="rounded-lg px-3 py-1 m-[5px]">
                  <Target className="h-3 w-3 mr-1" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="alerts" className="rounded-lg px-3 py-1 m-[5px]">
                  <Bell className="h-3 w-3 mr-1" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="reports" className="rounded-lg px-3 py-1 m-[5px]">
                  <FileText className="h-3 w-3 mr-1" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-[10px]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Critical Alerts */}
                  <Card className="organic-card border-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                        Critical Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {maintenanceItems.filter(item => item.priority === 'critical').map(item => (
                          <div key={item.id} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-red-300">{item.component}</span>
                              <Badge className="bg-red-500 text-white text-xs">CRITICAL</Badge>
                            </div>
                            <p className="text-sm text-red-200">{item.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-red-300">Due: {item.dueDate}</span>
                              <span className="text-xs text-red-300">{item.assignedTo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Health Overview */}
                  <Card className="organic-card border-emerald-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Activity className="h-5 w-5 mr-2 text-emerald-400" />
                        System Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {healthMetrics.slice(0, 3).map((metric, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-white">{metric.component}</span>
                              <span className={`text-sm font-medium ${getRiskColor(metric.riskLevel)}`}>
                                {metric.currentHealth}%
                              </span>
                            </div>
                            <Progress value={metric.currentHealth} className="h-2" />
                            <div className="flex justify-between items-center text-xs text-gray-300">
                              <span>Risk: {metric.riskLevel}</span>
                              <span>{metric.remainingLife} days remaining</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activities */}
                  <Card className="organic-card border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <History className="h-5 w-5 mr-2 text-blue-400" />
                        Recent Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {maintenanceItems.slice(0, 4).map(item => (
                          <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg bg-blue-500/5">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white truncate">{item.component}</p>
                              <p className="text-xs text-gray-300">{item.status} - {item.assignedTo}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="mt-[10px]">
                <Card className="organic-card">
                  <CardHeader>
                    <CardTitle className="text-white">Active Alerts & Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {maintenanceItems.filter(item => item.priority === 'critical' || item.priority === 'high').map(item => (
                        <div key={item.id} className={`p-4 rounded-lg border ${getPriorityColor(item.priority)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${item.priority === 'critical' ? 'bg-red-500' : 'bg-orange-500'} text-white`}>
                              {item.priority.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-300">{item.dueDate}</span>
                          </div>
                          <h4 className="font-medium text-white mb-1">{item.component}</h4>
                          <p className="text-sm text-gray-200 mb-2">{item.description}</p>
                          <div className="flex justify-between items-center text-xs">
                            <span>Health: {item.healthScore}%</span>
                            <span>{item.assignedTo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="mt-[10px]">
                <Card className="organic-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>Maintenance Reports</span>
                      <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-300">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <h4 className="font-medium text-blue-300 mb-2">Weekly Summary</h4>
                        <p className="text-sm text-blue-200">Completed: 15 tasks</p>
                        <p className="text-sm text-blue-200">Efficiency: 94%</p>
                        <p className="text-sm text-blue-200">Cost savings: $2,340</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <h4 className="font-medium text-green-300 mb-2">Predictive Accuracy</h4>
                        <p className="text-sm text-green-200">Predictions: 87% accurate</p>
                        <p className="text-sm text-green-200">Prevented failures: 3</p>
                        <p className="text-sm text-green-200">Downtime saved: 24 hours</p>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <h4 className="font-medium text-purple-300 mb-2">Component Lifecycle</h4>
                        <p className="text-sm text-purple-200">Avg. component life: 180 days</p>
                        <p className="text-sm text-purple-200">Optimal replacement: 85%</p>
                        <p className="text-sm text-purple-200">ROI improvement: 23%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Maintenance Tasks Tab */}
          <TabsContent value="tasks" className="mt-[10px]">
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="text-white">All Maintenance Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceItems.map(item => (
                    <div key={item.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={`${getStatusColor(item.status)} text-white`}>
                            {item.status}
                          </Badge>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          <span className="text-sm text-gray-300">{item.type}</span>
                        </div>
                        <span className="text-sm text-gray-300">{item.id}</span>
                      </div>
                      <h4 className="font-medium text-white mb-2">{item.component}</h4>
                      <p className="text-sm text-gray-200 mb-3">{item.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Due Date:</span>
                          <p className="text-white">{item.dueDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <p className="text-white">{item.estimatedDuration}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Assigned To:</span>
                          <p className="text-white">{item.assignedTo}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Location:</span>
                          <p className="text-white">{item.location}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">Health Score:</span>
                          <Progress value={item.healthScore} className="w-24 h-2" />
                          <span className="text-sm text-white">{item.healthScore}%</span>
                        </div>
                        <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health" className="mt-[10px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">Component Health Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {healthMetrics.map((metric, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-white">{metric.component}</h4>
                          <Badge className={getRiskColor(metric.riskLevel)}>
                            {metric.riskLevel} risk
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Current Health</span>
                            <span className="text-white">{metric.currentHealth}%</span>
                          </div>
                          <Progress value={metric.currentHealth} className="h-2" />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-gray-400">Degradation Rate</span>
                            <p className="text-white">{metric.degradationRate}%/week</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Remaining Life</span>
                            <p className="text-white">{metric.remainingLife} days</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Last Inspection</span>
                            <p className="text-white">{metric.lastInspection}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">Predictive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <h4 className="font-medium text-yellow-300 mb-2">Upcoming Maintenance</h4>
                      <p className="text-sm text-yellow-200">Water Pump A will require replacement in approximately 14 days based on current degradation patterns.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <h4 className="font-medium text-blue-300 mb-2">Optimization Opportunity</h4>
                      <p className="text-sm text-blue-200">LED panel maintenance can be optimized by combining with routine inspections, saving 2 hours per cycle.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <h4 className="font-medium text-green-300 mb-2">Performance Improvement</h4>
                      <p className="text-sm text-green-200">Recent sensor calibrations have improved system accuracy by 12% and reduced false alerts.</p>
                    </div>
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

export default PredictiveMaintenance;