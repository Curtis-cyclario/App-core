import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Sun, 
  Database, 
  Network, 
  Cpu,
  Zap,
  Wind,
  X,
  Maximize2,
  Settings,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import type { NetworkNodeData } from '@shared/schema';

interface InteractiveNodeOverlayProps {
  selectedNode: NetworkNodeData | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onMaximize?: (node: NetworkNodeData) => void;
  connectionCount: number;
}

interface NodeMetrics {
  performance: number;
  uptime: number;
  dataRate: number;
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  powerUsage: number;
  alerts: string[];
}

const InteractiveNodeOverlay: React.FC<InteractiveNodeOverlayProps> = ({
  selectedNode,
  position,
  onClose,
  onMaximize,
  connectionCount
}) => {
  const [metrics, setMetrics] = useState<NodeMetrics>({
    performance: 0,
    uptime: 0,
    dataRate: 0,
    powerUsage: 0,
    alerts: []
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      // Simulate fetching real-time metrics for the selected node
      const generateMetrics = () => {
        const basePerformance = selectedNode.status === 'online' ? 85 + Math.random() * 15 : 20 + Math.random() * 30;
        const alerts = [];
        
        if (selectedNode.type === 'sensor') {
          if (Math.random() > 0.7) alerts.push('Calibration due in 2 days');
          if (Math.random() > 0.9) alerts.push('High variance detected');
        }
        
        if (selectedNode.type === 'tower' && Math.random() > 0.8) {
          alerts.push('Nutrient levels low');
        }

        setMetrics({
          performance: Math.round(basePerformance),
          uptime: Math.round(95 + Math.random() * 5),
          dataRate: Math.round(1.2 + Math.random() * 2.8),
          temperature: selectedNode.type === 'sensor' ? 22 + Math.random() * 6 : undefined,
          humidity: selectedNode.type === 'sensor' ? 60 + Math.random() * 20 : undefined,
          lightLevel: selectedNode.type === 'sensor' ? 200 + Math.random() * 600 : undefined,
          powerUsage: Math.round(10 + Math.random() * 40),
          alerts
        });
      };

      generateMetrics();
      const interval = setInterval(generateMetrics, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedNode]);

  if (!selectedNode || !position) return null;

  const getNodeIcon = () => {
    switch (selectedNode.type) {
      case 'hub': return <Database className="w-5 h-5" />;
      case 'tower': return <Network className="w-5 h-5" />;
      case 'sensor': 
        if (selectedNode.name.includes('Temperature')) return <Thermometer className="w-5 h-5" />;
        if (selectedNode.name.includes('Humidity')) return <Droplets className="w-5 h-5" />;
        if (selectedNode.name.includes('Light')) return <Sun className="w-5 h-5" />;
        return <Activity className="w-5 h-5" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (selectedNode.status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'offline': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed z-50 pointer-events-auto"
        style={{
          left: Math.min(position.x + 20, window.innerWidth - (isExpanded ? 400 : 320)),
          top: Math.min(position.y - 10, window.innerHeight - (isExpanded ? 500 : 300)),
        }}
      >
        <Card className="bg-slate-800/95 backdrop-blur-sm border-slate-600 shadow-2xl w-80">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-700/50 rounded-lg">
                  {getNodeIcon()}
                </div>
                <div>
                  <CardTitle className="text-white text-lg">{selectedNode.name}</CardTitle>
                  <p className="text-slate-400 text-sm capitalize">{selectedNode.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor()}>
                  {selectedNode.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-400 hover:text-white"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">Performance</span>
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-white font-semibold">{metrics.performance}%</div>
                <Progress value={metrics.performance} className="h-1 mt-1" />
              </div>
              
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">Uptime</span>
                  <Activity className="w-3 h-3 text-blue-400" />
                </div>
                <div className="text-white font-semibold">{metrics.uptime}%</div>
                <Progress value={metrics.uptime} className="h-1 mt-1" />
              </div>
            </div>

            {/* Connection Info */}
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Network Info</span>
                <Network className="w-4 h-4 text-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-400">Connections:</span>
                  <span className="text-white ml-1">{connectionCount}</span>
                </div>
                <div>
                  <span className="text-slate-400">Data Rate:</span>
                  <span className="text-white ml-1">{metrics.dataRate} MB/s</span>
                </div>
              </div>
            </div>

            {/* Sensor Data (if applicable) */}
            {selectedNode.type === 'sensor' && (
              <div className="space-y-2">
                {metrics.temperature && (
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <span className="text-slate-400 text-sm">Temperature</span>
                    </div>
                    <span className="text-white font-medium">{metrics.temperature.toFixed(1)}°C</span>
                  </div>
                )}
                
                {metrics.humidity && (
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-slate-400 text-sm">Humidity</span>
                    </div>
                    <span className="text-white font-medium">{metrics.humidity.toFixed(1)}%</span>
                  </div>
                )}
                
                {metrics.lightLevel && (
                  <div className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-yellow-400" />
                      <span className="text-slate-400 text-sm">Light Level</span>
                    </div>
                    <span className="text-white font-medium">{metrics.lightLevel.toFixed(0)} lux</span>
                  </div>
                )}
              </div>
            )}

            {/* Power Usage */}
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-400 text-sm">Power Usage</span>
                </div>
                <span className="text-white font-medium">{metrics.powerUsage}W</span>
              </div>
              <Progress value={(metrics.powerUsage / 50) * 100} className="h-1" />
            </div>

            {/* Alerts */}
            {metrics.alerts.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm font-medium">Alerts</span>
                </div>
                <div className="space-y-1">
                  {metrics.alerts.map((alert, index) => (
                    <div key={index} className="text-red-300 text-xs">{alert}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Expanded Actions */}
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="space-y-2 border-t border-slate-600 pt-3"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-white border-slate-600"
                  onClick={() => onMaximize?.(selectedNode)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Node
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-white border-slate-600"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View History
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default InteractiveNodeOverlay;