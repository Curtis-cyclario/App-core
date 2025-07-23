import React, { useState } from 'react';
import { 
  Droplet, 
  Zap, 
  Thermometer, 
  BarChart3, 
  Settings, 
  Lightbulb,
  ActivityIcon,
  BarChart2,
  LineChart
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import PredictiveMaintenance from '@/components/maintenance/PredictiveMaintenance';
import TemperatureControl from '@/components/automation/TemperatureControl';

// Resource usage summary panel
const ResourceSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <Droplet className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Water Usage</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">487 L</h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-green-500 font-medium">-12%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full mt-3">
            <div className="h-1 bg-blue-500 dark:bg-blue-400 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">65% of weekly budget</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                <Lightbulb className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Light Energy</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1.2 kWh</h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-green-500 font-medium">-8%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full mt-3">
            <div className="h-1 bg-amber-500 dark:bg-amber-400 rounded-full" style={{ width: '70%' }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">70% of daily budget</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <Zap className="h-5 w-5 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Energy</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3.8 kWh</h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-green-500 font-medium">-15%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full mt-3">
            <div className="h-1 bg-green-500 dark:bg-green-400 rounded-full" style={{ width: '55%' }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">55% of daily budget</p>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <BarChart3 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Efficiency Score</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">94.3</h3>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-green-500 font-medium">+3.2</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs last week</span>
            </div>
          </div>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full mt-3">
            <div className="h-1 bg-purple-500 dark:bg-purple-400 rounded-full" style={{ width: '94%' }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Excellent (&gt;90)</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Charts overview panel for weekly resource usage
const ResourceUsageCharts = () => {
  return (
    <Card className="shadow-md border border-gray-100 dark:border-gray-800 mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Resource Analytics
            </CardTitle>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Weekly usage patterns and efficiency metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Droplet className="h-4 w-4 mr-2 text-blue-500" />
              Water Usage (Last 7 Days)
            </h3>
            <div className="h-[200px] flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center">
                <BarChart3 className="h-10 w-10 mb-2 text-gray-300 dark:text-gray-600" />
                <span>Water Usage Chart Visualization</span>
                <span className="text-xs mt-1">(Simulated data visualization placeholder)</span>
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2 text-amber-500" />
              Energy Consumption (Last 7 Days)
            </h3>
            <div className="h-[200px] flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center">
                <LineChart className="h-10 w-10 mb-2 text-gray-300 dark:text-gray-600" />
                <span>Energy Consumption Chart Visualization</span>
                <span className="text-xs mt-1">(Simulated data visualization placeholder)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main resource efficiency page component
const ResourceEfficiency = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Resource Efficiency & Predictive Maintenance</h1>
            <p className="text-gray-500 dark:text-gray-400">Optimize resource usage and automate maintenance procedures</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button className="shadow-sm">
              <ActivityIcon className="h-4 w-4 mr-2" />
              Run Diagnostics
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="temperature">Temperature Control</TabsTrigger>
          <TabsTrigger value="maintenance">Predictive Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <ResourceSummary />
          <ResourceUsageCharts />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TemperatureControl />
            <PredictiveMaintenance />
          </div>
        </TabsContent>
        
        <TabsContent value="temperature">
          <TemperatureControl />
        </TabsContent>
        
        <TabsContent value="maintenance">
          <PredictiveMaintenance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResourceEfficiency;