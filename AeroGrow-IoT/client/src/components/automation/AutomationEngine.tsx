import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  Activity,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Gauge,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Bot,
  Brain
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: 'sensor' | 'time' | 'manual' | 'condition';
    condition: string;
    threshold?: number;
    schedule?: string;
  };
  actions: AutomationAction[];
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastTriggered?: string;
  successRate: number;
  executionCount: number;
}

interface AutomationAction {
  id: string;
  type: 'adjust_climate' | 'water_plants' | 'adjust_lighting' | 'send_alert' | 'run_diagnosis';
  parameters: Record<string, any>;
  expectedDuration: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface AutomationEngineProps {
  siteId: number;
}

const AutomationEngine: React.FC<AutomationEngineProps> = ({ siteId }) => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isEngineActive, setIsEngineActive] = useState(true);
  const [activeActions, setActiveActions] = useState<AutomationAction[]>([]);
  const [engineStats, setEngineStats] = useState({
    totalRules: 0,
    activeRules: 0,
    executionsToday: 0,
    successRate: 0,
    energySaved: 0,
    waterSaved: 0
  });

  // Initialize automation rules for the site
  useEffect(() => {
    const initializeRules = () => {
      const siteRules: AutomationRule[] = [
        {
          id: 'temp-control-1',
          name: 'Temperature Regulation',
          description: 'Automatically adjust HVAC when temperature exceeds optimal range',
          trigger: {
            type: 'sensor',
            condition: 'temperature > 26°C OR temperature < 20°C',
            threshold: 26
          },
          actions: [
            {
              id: 'adjust-hvac',
              type: 'adjust_climate',
              parameters: { target: 23.5, tolerance: 1.5 },
              expectedDuration: 300,
              status: 'pending'
            }
          ],
          isActive: true,
          priority: 'high',
          lastTriggered: '2025-06-22T21:45:00Z',
          successRate: 94.2,
          executionCount: 156
        },
        {
          id: 'humidity-control-1',
          name: 'Humidity Optimization',
          description: 'Maintain optimal humidity levels for plant growth',
          trigger: {
            type: 'sensor',
            condition: 'humidity < 60% OR humidity > 80%',
            threshold: 60
          },
          actions: [
            {
              id: 'adjust-humidity',
              type: 'adjust_climate',
              parameters: { targetHumidity: 68, method: 'misting' },
              expectedDuration: 180,
              status: 'pending'
            }
          ],
          isActive: true,
          priority: 'medium',
          lastTriggered: '2025-06-22T20:15:00Z',
          successRate: 91.8,
          executionCount: 203
        },
        {
          id: 'lighting-schedule-1',
          name: 'Smart Lighting Control',
          description: 'Automatically adjust LED intensity based on growth stage and time',
          trigger: {
            type: 'time',
            condition: 'Daily schedule',
            schedule: '06:00-22:00'
          },
          actions: [
            {
              id: 'adjust-lighting',
              type: 'adjust_lighting',
              parameters: { intensity: 'auto', spectrum: 'full' },
              expectedDuration: 60,
              status: 'pending'
            }
          ],
          isActive: true,
          priority: 'medium',
          lastTriggered: '2025-06-22T22:00:00Z',
          successRate: 99.1,
          executionCount: 428
        },
        {
          id: 'irrigation-control-1',
          name: 'Precision Irrigation',
          description: 'Water plants based on soil moisture and plant growth stage',
          trigger: {
            type: 'sensor',
            condition: 'soil_moisture < 40%',
            threshold: 40
          },
          actions: [
            {
              id: 'water-plants',
              type: 'water_plants',
              parameters: { duration: 300, zones: 'all' },
              expectedDuration: 300,
              status: 'pending'
            }
          ],
          isActive: true,
          priority: 'high',
          lastTriggered: '2025-06-22T19:30:00Z',
          successRate: 96.7,
          executionCount: 89
        },
        {
          id: 'ai-health-monitoring',
          name: 'AI Plant Health Scan',
          description: 'Automated plant health analysis using computer vision',
          trigger: {
            type: 'time',
            condition: 'Every 4 hours',
            schedule: '00:00,04:00,08:00,12:00,16:00,20:00'
          },
          actions: [
            {
              id: 'run-diagnosis',
              type: 'run_diagnosis',
              parameters: { scan_type: 'full', ai_model: 'plant-health-v3' },
              expectedDuration: 900,
              status: 'pending'
            }
          ],
          isActive: true,
          priority: 'medium',
          lastTriggered: '2025-06-22T20:00:00Z',
          successRate: 87.3,
          executionCount: 67
        },
        {
          id: 'emergency-response',
          name: 'Emergency Alert System',
          description: 'Immediate response to critical system failures',
          trigger: {
            type: 'condition',
            condition: 'power_failure OR water_leak OR extreme_temperature',
          },
          actions: [
            {
              id: 'send-alert',
              type: 'send_alert',
              parameters: { priority: 'critical', channels: ['sms', 'email', 'dashboard'] },
              expectedDuration: 30,
              status: 'pending'
            }
          ],
          isActive: true,
          priority: 'critical',
          successRate: 100,
          executionCount: 3
        }
      ];

      setRules(siteRules);
      
      // Calculate engine stats
      const activeRulesCount = siteRules.filter(rule => rule.isActive).length;
      const totalExecutions = siteRules.reduce((sum, rule) => sum + rule.executionCount, 0);
      const avgSuccessRate = siteRules.reduce((sum, rule) => sum + rule.successRate, 0) / siteRules.length;

      setEngineStats({
        totalRules: siteRules.length,
        activeRules: activeRulesCount,
        executionsToday: Math.floor(totalExecutions * 0.15), // Simulated daily executions
        successRate: Math.round(avgSuccessRate * 10) / 10,
        energySaved: 23.4, // kWh saved today
        waterSaved: 156.8 // Liters saved today
      });
    };

    initializeRules();
  }, [siteId]);

  // Simulate active actions
  useEffect(() => {
    const interval = setInterval(() => {
      if (isEngineActive && Math.random() > 0.7) {
        const randomRule = rules[Math.floor(Math.random() * rules.length)];
        if (randomRule && randomRule.isActive) {
          const action = {
            ...randomRule.actions[0],
            id: `action-${Date.now()}`,
            status: 'running' as const
          };
          
          setActiveActions(prev => [...prev.slice(-2), action]);
          
          // Complete action after duration
          setTimeout(() => {
            setActiveActions(prev => 
              prev.map(a => a.id === action.id ? { ...a, status: 'completed' } : a)
            );
          }, 2000 + Math.random() * 3000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [rules, isEngineActive]);

  const toggleRule = useCallback((ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'adjust_climate': return <Thermometer className="w-4 h-4" />;
      case 'water_plants': return <Droplets className="w-4 h-4" />;
      case 'adjust_lighting': return <Sun className="w-4 h-4" />;
      case 'send_alert': return <AlertTriangle className="w-4 h-4" />;
      case 'run_diagnosis': return <Brain className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Engine Header */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white text-2xl">Automation Engine</CardTitle>
                <p className="text-slate-400">Site {siteId} - Intelligent Control System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Engine Status:</span>
                <Switch 
                  checked={isEngineActive} 
                  onCheckedChange={setIsEngineActive}
                />
                <Badge className={isEngineActive ? 
                  'bg-green-500/20 text-green-400 border-green-500/50' : 
                  'bg-red-500/20 text-red-400 border-red-500/50'
                }>
                  {isEngineActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{engineStats.totalRules}</div>
              <div className="text-xs text-slate-400">Total Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{engineStats.activeRules}</div>
              <div className="text-xs text-slate-400">Active Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{engineStats.executionsToday}</div>
              <div className="text-xs text-slate-400">Executions Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{engineStats.successRate}%</div>
              <div className="text-xs text-slate-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{engineStats.energySaved}</div>
              <div className="text-xs text-slate-400">kWh Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{engineStats.waterSaved}</div>
              <div className="text-xs text-slate-400">L Water Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Actions */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-emerald-400" />
            Live Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {activeActions.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No active automation actions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeActions.map((action) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-600/50 rounded">
                        {getActionIcon(action.type)}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="text-xs text-slate-400">
                          Expected duration: {action.expectedDuration}s
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        action.status === 'running' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                        action.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/50' :
                        'bg-orange-500/20 text-orange-400 border-orange-500/50'
                      }>
                        {action.status}
                      </Badge>
                      {action.status === 'running' && (
                        <div className="w-4 h-4">
                          <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rules.map((rule) => (
          <Card key={rule.id} className="bg-slate-800/50 border-slate-600">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-white text-lg">{rule.name}</CardTitle>
                    <Badge className={getPriorityColor(rule.priority)}>
                      {rule.priority}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-sm">{rule.description}</p>
                </div>
                <Switch 
                  checked={rule.isActive} 
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trigger Info */}
              <div className="p-3 bg-slate-700/30 rounded-lg">
                <div className="text-sm font-medium text-white mb-1">Trigger Condition</div>
                <div className="text-xs text-slate-300">{rule.trigger.condition}</div>
                {rule.trigger.schedule && (
                  <div className="text-xs text-slate-400 mt-1">Schedule: {rule.trigger.schedule}</div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-white">Actions</div>
                {rule.actions.map((action) => (
                  <div key={action.id} className="flex items-center space-x-2 text-sm">
                    {getActionIcon(action.type)}
                    <span className="text-slate-300">
                      {action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-600">
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">{rule.successRate}%</div>
                  <div className="text-xs text-slate-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">{rule.executionCount}</div>
                  <div className="text-xs text-slate-400">Executions</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Last Triggered</div>
                  <div className="text-xs text-white">
                    {rule.lastTriggered ? new Date(rule.lastTriggered).toLocaleTimeString() : 'Never'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AutomationEngine;