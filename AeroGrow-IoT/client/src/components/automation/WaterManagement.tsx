import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Droplet,
  Thermometer,
  BarChart,
  ArrowRightLeft,
  Beaker,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Leaf,
  RefreshCw,
  Settings,
} from 'lucide-react';

interface WaterManagementProps {
  defaultProfile?: string;
  plantsPerTower?: number;
  totalTowers?: number;
  showAdvanced?: boolean;
}

const WaterManagement: React.FC<WaterManagementProps> = ({
  defaultProfile = 'lettuce',
  plantsPerTower = 12,
  totalTowers = 10,
  showAdvanced = true
}) => {
  // Current water data
  const [waterData, setWaterData] = useState({
    tankLevel: 85, // percentage full
    pH: 6.2,
    ec: 1.4, // mS/cm
    waterTemperature: 22.5, // °C
    dissolvedOxygen: 7.8, // mg/L
    totalFlow: 487, // L/day
    pumpStatus: 'active', // active, inactive, error
    filterStatus: 'clean', // clean, attention, replace
    lastTestTime: new Date().toISOString(),
    lastCycleTime: new Date().toISOString()
  });
  
  // Historical water usage data
  const [usageData, setUsageData] = useState({
    daily: 478, // liters
    weekly: 3346, // liters
    absorbed: 408, // liters (absorbed by plants)
    runoff: 70, // liters
    recycled: 65, // percentage
    averagePerPlant: 1.1, // liters per plant per day
    costSavings: 28, // percentage saved vs traditional
    purificationEfficiency: 92 // percentage
  });
  
  // Format time display
  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Card className="shadow-md border border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Water Management System
            </CardTitle>
          </div>
        </div>
        <CardDescription className="mt-1.5 text-gray-500 dark:text-gray-400">
          Advanced water quality management and nutrient delivery system
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Water Quality Panel */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900/30 dark:to-gray-800/30 p-3">
              <h3 className="font-medium text-sm flex items-center">
                <Beaker className="h-4 w-4 mr-2 text-blue-500" />
                Water Quality Metrics
              </h3>
            </div>
            
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* pH Level */}
              <div className="space-y-1">
                <div className="text-sm text-gray-700 dark:text-gray-300">pH Level</div>
                <div className="text-2xl font-bold">{waterData.pH.toFixed(1)}</div>
                <div className="text-xs text-gray-500">Target: 6.0</div>
                <Progress value={(waterData.pH - 4) / 6 * 100} className="h-1.5" />
              </div>
              
              {/* EC/TDS Level */}
              <div className="space-y-1">
                <div className="text-sm text-gray-700 dark:text-gray-300">EC Level</div>
                <div className="text-2xl font-bold">{waterData.ec.toFixed(1)}</div>
                <div className="text-xs text-gray-500">mS/cm (Target: 1.2)</div>
                <Progress value={waterData.ec / 5 * 100} className="h-1.5" />
              </div>
              
              {/* Temperature */}
              <div className="space-y-1">
                <div className="text-sm text-gray-700 dark:text-gray-300">Temperature</div>
                <div className="text-2xl font-bold">{waterData.waterTemperature.toFixed(1)}°C</div>
                <div className="text-xs text-gray-500">Target: 21-23°C</div>
                <Progress value={(waterData.waterTemperature - 15) / 15 * 100} className="h-1.5" />
              </div>
              
              {/* Dissolved Oxygen */}
              <div className="space-y-1">
                <div className="text-sm text-gray-700 dark:text-gray-300">Dissolved O₂</div>
                <div className="text-2xl font-bold">{waterData.dissolvedOxygen} mg/L</div>
                <div className="text-xs text-gray-500">Target: {'>='} 6.0 mg/L</div>
                <Progress value={waterData.dissolvedOxygen / 10 * 100} className="h-1.5" />
              </div>
            </div>
          </div>
          
          {/* Water Usage & Efficiency Panel */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900/30 dark:to-gray-800/30 p-3">
              <h3 className="font-medium text-sm flex items-center">
                <ArrowRightLeft className="h-4 w-4 mr-2 text-green-500" />
                Water Usage & Absorption Metrics
              </h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Total Daily Usage</div>
                  <div className="text-2xl font-bold">{usageData.daily.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">liters</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Plant Absorption</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-500">{usageData.absorbed.toFixed(0)}</div>
                  <div className="text-xs text-gray-500">liters</div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Per Plant Average</div>
                  <div className="text-xl font-bold">{usageData.averagePerPlant.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">liters/day</div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-green-50/50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20">
                  <div className="flex justify-between mb-1">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Water Recycling</div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{usageData.recycled}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Runoff: {usageData.runoff.toFixed(0)}L | Recycled: {(usageData.runoff * usageData.recycled / 100).toFixed(0)}L
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={usageData.recycled} className="h-1" />
                  </div>
                </div>
                
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20">
                  <div className="flex justify-between mb-1">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Purification Efficiency</div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{usageData.purificationEfficiency}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Cost savings: {usageData.costSavings}% vs traditional
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress value={usageData.purificationEfficiency} className="h-1" />
                  </div>
                </div>
              </div>
              
              {/* Rainwater Collection & Grey Water Distillation */}
              <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                <h4 className="text-sm font-medium mb-3 flex items-center">
                  <Droplet className="h-4 w-4 mr-2 text-blue-500" />
                  Sustainable Water Sources
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Rainwater Collection */}
                  <div className="bg-sky-50/50 dark:bg-sky-900/10 p-3 rounded-lg border border-sky-100 dark:border-sky-900/20">
                    <div className="flex justify-between mb-1">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Rainwater Collection</div>
                      <Badge variant="outline" className="text-xs h-5 bg-sky-100/50 dark:bg-sky-900/30">Active</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-800/30 flex items-center justify-center">
                        <Droplet className="h-5 w-5 text-sky-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">132L collected</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Storage capacity: 75% full</div>
                    <Progress value={75} className="h-1 mt-1" />
                  </div>
                  
                  {/* Grey Water Distillation */}
                  <div className="bg-violet-50/50 dark:bg-violet-900/10 p-3 rounded-lg border border-violet-100 dark:border-violet-900/20">
                    <div className="flex justify-between mb-1">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Grey Water Distillation</div>
                      <Badge variant="outline" className="text-xs h-5 bg-violet-100/50 dark:bg-violet-900/30">Active</Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-800/30 flex items-center justify-center">
                        <Beaker className="h-5 w-5 text-violet-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">86L processed</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">Efficiency: 92% recovery rate</div>
                    <Progress value={92} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="w-full flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <Droplet className="h-3.5 w-3.5 mr-1 text-blue-500" />
            <span>Last water test: {formatTime(waterData.lastTestTime)}</span>
          </div>
          
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
            <span>Water system {waterData.pumpStatus === 'active' ? 'active' : 'inactive'}</span>
          </div>
          
          <div className="flex items-center">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            <span>Next cycle: 16:45 (in 22m)</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default WaterManagement;