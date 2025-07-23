import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { 
  Thermometer, 
  Droplets, 
  Zap, 
  Wind, 
  Gauge,
  Activity,
  Eye,
  TrendingUp
} from 'lucide-react';

interface Tower {
  id: number;
  name: string;
  location: string;
  plantType: string;
  status: 'active' | 'inactive' | 'maintenance';
}

interface LiveMetrics {
  towerId: number;
  temperature: number;
  humidity: number;
  lightLevel: number;
  waterLevel: number;
  phLevel: number;
  co2Level: number;
  soilMoisture: number;
  energyUsage: number;
  growthRate: number;
  timestamp: string;
}

interface LiveMetricsPanelProps {
  selectedTowerId?: number;
  onTowerChange?: (towerId: number) => void;
}

const LiveMetricsPanel: React.FC<LiveMetricsPanelProps> = ({ 
  selectedTowerId, 
  onTowerChange 
}) => {
  const [currentTowerId, setCurrentTowerId] = useState<number>(selectedTowerId || 1);

  // Fetch available towers
  const { data: towers = [] } = useQuery({
    queryKey: ['/api/towers'],
    queryFn: async () => {
      const response = await fetch('/api/towers');
      return response.json();
    }
  });

  // Fetch live metrics for selected tower
  const { data: liveMetrics, refetch } = useQuery({
    queryKey: ['/api/sensor-data/live', currentTowerId],
    queryFn: async () => {
      const response = await fetch(`/api/sensor-data/live?towerId=${currentTowerId}`);
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: !!currentTowerId
  });

  // Update tower selection
  const handleTowerChange = (towerId: string) => {
    const id = parseInt(towerId);
    setCurrentTowerId(id);
    onTowerChange?.(id);
  };

  // Update when external tower selection changes
  useEffect(() => {
    if (selectedTowerId && selectedTowerId !== currentTowerId) {
      setCurrentTowerId(selectedTowerId);
    }
  }, [selectedTowerId]);

  const selectedTower = towers.find((t: Tower) => t.id === currentTowerId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMetricStatus = (value: number, optimal: { min: number, max: number }) => {
    if (value >= optimal.min && value <= optimal.max) return 'optimal';
    if (value < optimal.min * 0.8 || value > optimal.max * 1.2) return 'critical';
    return 'warning';
  };

  const getMetricColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tower Selection */}
      <Card className="organic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-white">
              <Eye className="h-5 w-5 text-emerald-400" />
              <span>Live Tower Monitoring</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-300">Live</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={currentTowerId.toString()} onValueChange={handleTowerChange}>
              <SelectTrigger className="bg-gray-800/50 border-emerald-500/20 text-white">
                <SelectValue placeholder="Select Tower" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-emerald-500/20">
                {towers.map((tower: Tower) => (
                  <SelectItem key={tower.id} value={tower.id.toString()} className="text-white hover:bg-emerald-500/10">
                    <div className="flex items-center justify-between w-full">
                      <span>{tower.name}</span>
                      <Badge className={getStatusColor(tower.status)}>
                        {tower.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedTower && (
              <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{selectedTower.name}</h3>
                  <Badge className={getStatusColor(selectedTower.status)}>
                    {selectedTower.status}
                  </Badge>
                </div>
                <div className="text-sm text-emerald-300">
                  Location: {selectedTower.location} • Plant Type: {selectedTower.plantType}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics Grid */}
      {liveMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">
                    <Thermometer className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Temperature</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.temperature, { min: 20, max: 26 }))}`}>
                      {liveMetrics.temperature.toFixed(1)}°C
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                    <Droplets className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Humidity</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.humidity, { min: 60, max: 70 }))}`}>
                      {liveMetrics.humidity.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Light Level</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.lightLevel, { min: 200, max: 800 }))}`}>
                      {liveMetrics.lightLevel} lux
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-lg">
                    <Droplets className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Water Level</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.waterLevel, { min: 40, max: 80 }))}`}>
                      {liveMetrics.waterLevel.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Gauge className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">pH Level</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.phLevel, { min: 5.5, max: 6.5 }))}`}>
                      {liveMetrics.phLevel.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg">
                    <Wind className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">CO₂ Level</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.co2Level, { min: 400, max: 1000 }))}`}>
                      {liveMetrics.co2Level} ppm
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-lg">
                    <Activity className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Energy Usage</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.energyUsage, { min: 100, max: 500 }))}`}>
                      {liveMetrics.energyUsage} W
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="organic-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Growth Rate</div>
                    <div className={`text-xl font-bold ${getMetricColor(getMetricStatus(liveMetrics.growthRate, { min: 0.8, max: 1.5 }))}`}>
                      {liveMetrics.growthRate.toFixed(2)} cm/day
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Last Update */}
      {liveMetrics && (
        <div className="text-center text-sm text-gray-400">
          Last updated: {new Date(liveMetrics.timestamp).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default LiveMetricsPanel;