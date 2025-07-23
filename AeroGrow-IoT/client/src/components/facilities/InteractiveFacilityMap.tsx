import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Activity, 
  Zap, 
  Droplets, 
  Thermometer, 
  Wind,
  Users,
  Building2,
  Leaf,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';

interface FacilityLocation {
  id: number;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  type: 'indoor' | 'greenhouse' | 'outdoor';
  status: 'active' | 'maintenance' | 'expansion';
  size: number;
  totalTowers: number;
  activeTowers: number;
  capacity: number;
  currentYield: number;
  efficiency: number;
  resources: {
    power: { current: number; max: number; unit: string };
    water: { current: number; max: number; unit: string };
    staff: { current: number; max: number; unit: string };
    storage: { current: number; max: number; unit: string };
  };
  metrics: {
    temperature: number;
    humidity: number;
    co2Level: number;
    lightLevel: number;
    energyEfficiency: number;
    waterEfficiency: number;
  };
  alerts: Array<{
    id: number;
    type: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: string;
  }>;
}

interface InteractiveFacilityMapProps {
  className?: string;
}

const InteractiveFacilityMap: React.FC<InteractiveFacilityMapProps> = ({ className = '' }) => {
  const [facilities, setFacilities] = useState<FacilityLocation[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<FacilityLocation | null>(null);
  const [mapView, setMapView] = useState<'australia' | 'detailed'>('australia');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize facility data with Australian locations
  useEffect(() => {
    const australiaFacilities: FacilityLocation[] = [
      {
        id: 1,
        name: "VertiGro Primary Site",
        location: "Sydney Innovation Hub, NSW",
        coordinates: { lat: -33.8688, lng: 151.2093 },
        type: "indoor",
        status: "active",
        size: 18500,
        totalTowers: 145,
        activeTowers: 142,
        capacity: 2800,
        currentYield: 2650,
        efficiency: 94.6,
        resources: {
          power: { current: 1850, max: 2200, unit: "kW" },
          water: { current: 180, max: 220, unit: "L/min" },
          staff: { current: 24, max: 28, unit: "people" },
          storage: { current: 850, max: 1200, unit: "kg" }
        },
        metrics: {
          temperature: 23.5,
          humidity: 68,
          co2Level: 410,
          lightLevel: 850,
          energyEfficiency: 89.2,
          waterEfficiency: 92.8
        },
        alerts: [
          { id: 1, type: 'info', message: 'Optimal growing conditions maintained', timestamp: '2025-06-22T23:15:00Z' },
          { id: 2, type: 'warning', message: 'Tower 87 sensor calibration needed', timestamp: '2025-06-22T22:30:00Z' }
        ]
      },
      {
        id: 2,
        name: "Melbourne Research Facility",
        location: "Clayton Innovation Precinct, VIC",
        coordinates: { lat: -37.8136, lng: 144.9631 },
        type: "greenhouse",
        status: "active",
        size: 12000,
        totalTowers: 96,
        activeTowers: 94,
        capacity: 1800,
        currentYield: 1720,
        efficiency: 95.6,
        resources: {
          power: { current: 1200, max: 1500, unit: "kW" },
          water: { current: 140, max: 180, unit: "L/min" },
          staff: { current: 18, max: 20, unit: "people" },
          storage: { current: 650, max: 900, unit: "kg" }
        },
        metrics: {
          temperature: 22.8,
          humidity: 72,
          co2Level: 395,
          lightLevel: 720,
          energyEfficiency: 91.5,
          waterEfficiency: 94.2
        },
        alerts: [
          { id: 3, type: 'info', message: 'New crop variety trial initiated', timestamp: '2025-06-22T21:45:00Z' }
        ]
      },
      {
        id: 3,
        name: "Brisbane Pilot Farm",
        location: "Queensland University of Technology, QLD",
        coordinates: { lat: -27.4698, lng: 153.0251 },
        type: "outdoor",
        status: "active",
        size: 8500,
        totalTowers: 68,
        activeTowers: 65,
        capacity: 1200,
        currentYield: 1150,
        efficiency: 95.8,
        resources: {
          power: { current: 680, max: 900, unit: "kW" },
          water: { current: 95, max: 130, unit: "L/min" },
          staff: { current: 12, max: 15, unit: "people" },
          storage: { current: 420, max: 600, unit: "kg" }
        },
        metrics: {
          temperature: 25.2,
          humidity: 65,
          co2Level: 415,
          lightLevel: 950,
          energyEfficiency: 87.8,
          waterEfficiency: 91.3
        },
        alerts: [
          { id: 4, type: 'info', message: 'Weather monitoring active', timestamp: '2025-06-22T23:00:00Z' },
          { id: 5, type: 'warning', message: '3 towers scheduled maintenance', timestamp: '2025-06-22T20:30:00Z' }
        ]
      },
      {
        id: 4,
        name: "Perth Desert Innovation Site",
        location: "Murdoch University, WA",
        coordinates: { lat: -31.9505, lng: 115.8605 },
        type: "indoor",
        status: "expansion",
        size: 6500,
        totalTowers: 52,
        activeTowers: 48,
        capacity: 950,
        currentYield: 850,
        efficiency: 89.5,
        resources: {
          power: { current: 520, max: 750, unit: "kW" },
          water: { current: 65, max: 100, unit: "L/min" },
          staff: { current: 8, max: 12, unit: "people" },
          storage: { current: 280, max: 450, unit: "kg" }
        },
        metrics: {
          temperature: 24.1,
          humidity: 63,
          co2Level: 400,
          lightLevel: 820,
          energyEfficiency: 85.6,
          waterEfficiency: 88.9
        },
        alerts: [
          { id: 6, type: 'info', message: 'Phase 2 expansion in progress', timestamp: '2025-06-22T18:00:00Z' },
          { id: 7, type: 'info', message: 'New water recycling system online', timestamp: '2025-06-22T16:20:00Z' }
        ]
      }
    ];

    setFacilities(australiaFacilities);
    setSelectedFacility(australiaFacilities[0]);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setFacilities(prev => prev.map(facility => ({
        ...facility,
        resources: {
          ...facility.resources,
          power: {
            ...facility.resources.power,
            current: Math.max(0, facility.resources.power.current + (Math.random() - 0.5) * 50)
          },
          water: {
            ...facility.resources.water,
            current: Math.max(0, facility.resources.water.current + (Math.random() - 0.5) * 10)
          }
        },
        metrics: {
          ...facility.metrics,
          temperature: facility.metrics.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.max(40, Math.min(90, facility.metrics.humidity + (Math.random() - 0.5) * 5)),
          energyEfficiency: Math.max(80, Math.min(100, facility.metrics.energyEfficiency + (Math.random() - 0.5) * 2))
        }
      })));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'expansion': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getResourceUtilization = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    return {
      percentage,
      color: percentage > 90 ? 'bg-red-400' : percentage > 75 ? 'bg-yellow-400' : 'bg-green-400'
    };
  };

  const totalResources = facilities.reduce((acc, facility) => ({
    power: acc.power + facility.resources.power.current,
    water: acc.water + facility.resources.water.current,
    staff: acc.staff + facility.resources.staff.current,
    towers: acc.towers + facility.activeTowers,
    yield: acc.yield + facility.currentYield
  }), { power: 0, water: 0, staff: 0, towers: 0, yield: 0 });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Facility Resource Map</h2>
          <p className="text-slate-400 text-sm">
            Real-time monitoring across all Australian sites
            <span className="ml-2 text-green-400">● Live</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-slate-300">
            Last Update: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setMapView(mapView === 'australia' ? 'detailed' : 'australia')}
            className="border-slate-600 text-slate-300"
          >
            {mapView === 'australia' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              <div>
                <p className="text-xs text-slate-400">Total Power</p>
                <p className="text-lg font-bold text-white">{totalResources.power.toFixed(0)} kW</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Droplets className="w-6 h-6 text-blue-400 mr-2" />
              <div>
                <p className="text-xs text-slate-400">Water Usage</p>
                <p className="text-lg font-bold text-white">{totalResources.water.toFixed(0)} L/min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-purple-400 mr-2" />
              <div>
                <p className="text-xs text-slate-400">Staff Active</p>
                <p className="text-lg font-bold text-white">{totalResources.staff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="w-6 h-6 text-emerald-400 mr-2" />
              <div>
                <p className="text-xs text-slate-400">Active Towers</p>
                <p className="text-lg font-bold text-white">{totalResources.towers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Leaf className="w-6 h-6 text-green-400 mr-2" />
              <div>
                <p className="text-xs text-slate-400">Total Yield</p>
                <p className="text-lg font-bold text-white">{totalResources.yield.toFixed(0)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
              Australia Facility Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={mapRef}
              className="relative bg-slate-900/50 rounded-lg h-96 overflow-hidden"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)
                `,
                backgroundSize: '100% 100%'
              }}
            >
              {/* Australia Outline SVG */}
              <svg 
                viewBox="0 0 800 600" 
                className="absolute inset-0 w-full h-full"
                style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))' }}
              >
                {/* Simplified Australia outline */}
                <path
                  d="M150 200 L200 150 L300 140 L400 160 L500 180 L600 200 L650 250 L680 350 L650 450 L600 500 L500 520 L400 510 L300 490 L200 470 L150 400 L120 300 Z"
                  fill="rgba(16, 185, 129, 0.1)"
                  stroke="rgba(16, 185, 129, 0.3)"
                  strokeWidth="2"
                />
                
                {/* Facility Markers */}
                {facilities.map((facility, index) => {
                  const x = 200 + (facility.coordinates.lng + 120) * 3;
                  const y = 400 - (facility.coordinates.lat + 40) * 4;
                  const isSelected = selectedFacility?.id === facility.id;
                  
                  return (
                    <g key={facility.id}>
                      {/* Facility Marker */}
                      <motion.circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 12 : 8}
                        fill={
                          facility.status === 'active' ? '#10b981' :
                          facility.status === 'expansion' ? '#3b82f6' : '#f59e0b'
                        }
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        onClick={() => setSelectedFacility(facility)}
                        style={{
                          filter: `drop-shadow(0 0 ${isSelected ? 15 : 8}px ${
                            facility.status === 'active' ? '#10b981' :
                            facility.status === 'expansion' ? '#3b82f6' : '#f59e0b'
                          })`
                        }}
                      />
                      
                      {/* Resource Usage Ring */}
                      <motion.circle
                        cx={x}
                        cy={y}
                        r={16}
                        fill="none"
                        stroke={
                          facility.resources.power.current / facility.resources.power.max > 0.9 ? '#ef4444' :
                          facility.resources.power.current / facility.resources.power.max > 0.75 ? '#f59e0b' : '#10b981'
                        }
                        strokeWidth="2"
                        strokeDasharray={`${(facility.resources.power.current / facility.resources.power.max) * 100} 100`}
                        className="opacity-60"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: `${x}px ${y}px` }}
                      />
                      
                      {/* Facility Label */}
                      <text
                        x={x}
                        y={y + 35}
                        textAnchor="middle"
                        className="text-xs fill-white font-medium"
                        style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8))' }}
                      >
                        {facility.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
                
                {/* Connection Lines */}
                {facilities.map((facility, index) => {
                  if (index === 0) return null;
                  const prevFacility = facilities[index - 1];
                  const x1 = 200 + (prevFacility.coordinates.lng + 120) * 3;
                  const y1 = 400 - (prevFacility.coordinates.lat + 40) * 4;
                  const x2 = 200 + (facility.coordinates.lng + 120) * 3;
                  const y2 = 400 - (facility.coordinates.lat + 40) * 4;
                  
                  return (
                    <motion.line
                      key={`connection-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(16, 185, 129, 0.4)"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: index * 0.5 }}
                    />
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Selected Facility Details */}
        <Card className="bg-slate-800/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Facility Details</span>
              {selectedFacility && (
                <Badge className={getStatusColor(selectedFacility.status)}>
                  {selectedFacility.status}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedFacility ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedFacility.name}</h3>
                  <p className="text-sm text-slate-400">{selectedFacility.location}</p>
                </div>

                {/* Resource Utilization */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white">Resource Utilization</h4>
                  
                  {Object.entries(selectedFacility.resources).map(([key, resource]) => {
                    const utilization = getResourceUtilization(resource.current, resource.max);
                    const icon = {
                      power: <Zap className="w-4 h-4" />,
                      water: <Droplets className="w-4 h-4" />,
                      staff: <Users className="w-4 h-4" />,
                      storage: <Building2 className="w-4 h-4" />
                    }[key];

                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="text-slate-400">{icon}</div>
                            <span className="text-sm text-slate-300 capitalize">{key}</span>
                          </div>
                          <span className="text-sm text-white">
                            {resource.current.toFixed(0)}/{resource.max} {resource.unit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${utilization.color} transition-all duration-300`}
                            style={{ width: `${utilization.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Environmental Metrics */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-white">Environmental Conditions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-1">
                        <Thermometer className="w-3 h-3 text-red-400" />
                        <span className="text-xs text-slate-400">Temp</span>
                      </div>
                      <div className="text-sm font-medium text-white">
                        {selectedFacility.metrics.temperature.toFixed(1)}°C
                      </div>
                    </div>
                    <div className="p-2 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-slate-400">Humidity</span>
                      </div>
                      <div className="text-sm font-medium text-white">
                        {selectedFacility.metrics.humidity.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Efficiency Metrics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white">Efficiency</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Energy</span>
                      <span className="text-xs text-white">{selectedFacility.metrics.energyEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedFacility.metrics.energyEfficiency} className="h-1" />
                    
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400">Water</span>
                      <span className="text-xs text-white">{selectedFacility.metrics.waterEfficiency.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedFacility.metrics.waterEfficiency} className="h-1" />
                  </div>
                </div>

                {/* Recent Alerts */}
                {selectedFacility.alerts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Recent Activity</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {selectedFacility.alerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`flex items-center space-x-2 p-2 rounded text-xs ${
                            alert.type === 'critical' ? 'bg-red-500/20 text-red-300' :
                            alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}
                        >
                          {alert.type === 'critical' ? <AlertTriangle className="w-3 h-3" /> :
                           alert.type === 'warning' ? <AlertTriangle className="w-3 h-3" /> :
                           <CheckCircle className="w-3 h-3" />}
                          <span className="flex-1">{alert.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a facility on the map to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveFacilityMap;