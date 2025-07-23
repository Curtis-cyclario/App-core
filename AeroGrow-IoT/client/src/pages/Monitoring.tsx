import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import HistoryChart from '@/components/dashboard/HistoryChart';
import SystemOverview from '@/components/dashboard/SystemOverview';
import { useSensorData } from '@/hooks/useSensorData';

const Monitoring = () => {
  const { sensorData, loading } = useSensorData();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Monitoring</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="humidity">Humidity</TabsTrigger>
          <TabsTrigger value="water">Water Levels</TabsTrigger>
          <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
          <TabsTrigger value="all">All Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="mb-6">
            <SystemOverview sensorData={sensorData} loading={loading} />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Current Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Temperature</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{sensorData?.temperature || '--'}°C</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal range: 20-25°C</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Humidity</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{sensorData?.humidity || '--'}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal range: 60-70%</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Water Level</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{sensorData?.waterLevel || '--'}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Refill below: 20%</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nutrient Level</h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{sensorData?.nutrientLevel || '--'}%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Refill below: 30%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="temperature">
          <div className="space-y-6">
            <HistoryChart title="Temperature History" dataType="temperature" />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">Temperature Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Temperature:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{sensorData?.temperature || '--'}°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Optimal Range:</span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">20-25°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">Normal</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="humidity">
          <HistoryChart title="Humidity History" dataType="humidity" />
        </TabsContent>
        
        <TabsContent value="water">
          <HistoryChart title="Water Level History" dataType="waterLevel" />
        </TabsContent>
        
        <TabsContent value="nutrients">
          <HistoryChart title="Nutrient Level History" dataType="nutrientLevel" />
        </TabsContent>
        
        <TabsContent value="all">
          <HistoryChart title="All Metrics" dataType="all" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Monitoring;
