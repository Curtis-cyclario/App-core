import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Zap, 
  Thermometer, 
  Settings, 
  Building2,
  ChevronDown
} from 'lucide-react';
import { Link } from 'wouter';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TemperatureController from '@/components/automation/TemperatureController';
import WaterManagement from '@/components/automation/WaterManagement';
import PredictiveMaintenance from '@/components/maintenance/PredictiveMaintenance';
import PlantRecommendationWizard from '@/components/recommendations/PlantRecommendationWizard';
import VisualMetricsPanel from '@/components/dashboard/VisualMetricsPanel';

import MultiSiteMonitoring from '@/components/facilities/MultiSiteMonitoring';
import ParticleBackground from '@/components/ui/ParticleBackground';
import AnimatedBackground from '@/components/ui/animated-background';

interface Facility {
  id: number;
  name: string;
  towers: number;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [facilities] = useState<Facility[]>([
    { id: 1, name: "Facility 1 - Main Campus", towers: 10 },
    { id: 2, name: "Facility 2 - North Site", towers: 8 },
    { id: 3, name: "Facility 3 - Research Center", towers: 5 }
  ]);
  const [selectedFacility, setSelectedFacility] = useState(facilities[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    setIsLoaded(true);
    controls.start("visible");
  }, [controls]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 overflow-hidden">
      {/* Subtle Particle Background */}
      <ParticleBackground 
        intensity="low" 
        color="cyan" 
        className="fixed inset-0 z-0 opacity-30" 
      />
      {/* Organic Flow Elements */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />
        <AnimatedBackground variant="neural" />
      </div>
      {/* Floating organic shapes */}
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-radial from-teal-500/5 to-transparent rounded-full blur-2xl" />
      </div>
      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        {/* Organic Dashboard Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 organic-card p-8 relative overflow-hidden"
        >
          {/* Subtle organic background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-300 to-green-500 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex-1">
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 via-blue-400 via-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-cycle mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Vertigro Dashboard
              </motion.h1>
              <motion.p 
                className="text-lg text-emerald-200 mb-4 lg:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Sustainable farming through autonomous systems and predictive analytics
              </motion.p>
              
              {/* Organic status indicators */}
              <motion.div 
                className="flex flex-wrap gap-3 mt-4 lg:mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-emerald-300 font-medium">Systems Online</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500/30 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-teal-300 font-medium">Towers Active</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-300 font-medium">Optimal Growth</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-6 lg:mt-0 flex flex-wrap gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Link href="/settings">
                <Button className="organic-button-secondary">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </Link>
              <Link href="/analytics">
                <Button className="organic-button-primary">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      
        {/* Organic Facility Selector */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-4 p-4 organic-card">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-300 font-medium">Facility Selection</span>
            </div>
            <div className="w-px h-6 bg-emerald-500/30" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-emerald-300 transition-colors">
                  <Building2 className="h-4 w-4 mr-2 text-emerald-400" />
                  {selectedFacility.name}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[300px] organic-card border-emerald-500/20">
                {facilities.map((facility) => (
                  <DropdownMenuItem 
                    key={facility.id}
                    onClick={() => setSelectedFacility(facility)}
                    className="hover:bg-emerald-500/10 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{facility.name}</span>
                      <span className="text-xs text-emerald-400">{facility.towers} towers</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      
        {/* Organic Navigation Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <TabsList className="organic-card p-3 flex flex-wrap justify-center gap-2 sm:gap-3 border-[10px] border-transparent w-full mb-4 min-h-[60px] items-center">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-[100px] flex items-center justify-center"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Main</span>
              </TabsTrigger>

              <TabsTrigger 
                value="environment" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-[100px] flex items-center justify-center"
              >
                <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Environment</span>
                <span className="sm:hidden">Env</span>
              </TabsTrigger>
              <TabsTrigger 
                value="maintenance" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-[100px] flex items-center justify-center"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Maintenance</span>
                <span className="sm:hidden">Maint</span>
              </TabsTrigger>
              <TabsTrigger 
                value="facilities" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-[100px] flex items-center justify-center"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Multi Site Dashboard</span>
                <span className="sm:hidden">Sites</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>
        
          <TabsContent value="overview" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Enhanced Visual Metrics Panel */}
              <div className="organic-card-enhanced p-6 animate-shimmer">
                <VisualMetricsPanel />
              </div>
              
              {/* System Controls Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <TemperatureController defaultProfile="lettuce" />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <WaterManagement defaultProfile="lettuce" />
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>
        

        
          <TabsContent value="environment" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="organic-card-enhanced p-6 animate-shimmer">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 via-cyan-400 via-blue-400 via-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-cycle">Environmental Controls</h3>
                    <p className="text-emerald-200 text-sm">Climate optimization and atmospheric management</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-warm"></div>
                    <span className="text-sm text-green-300">Optimized</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="text-sm text-green-300 mb-1">Temperature</div>
                    <div className="text-xl font-bold text-white">24.2°C</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="text-sm text-blue-300 mb-1">CO₂ Level</div>
                    <div className="text-xl font-bold text-white">420 PPM</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-xl p-4">
                    <div className="text-sm text-cyan-300 mb-1">Humidity</div>
                    <div className="text-xl font-bold text-white">62%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="text-sm text-purple-300 mb-1">Pressure</div>
                    <div className="text-xl font-bold text-white">1013 hPa</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TemperatureController defaultProfile="basil" />
                <WaterManagement defaultProfile="basil" />
              </div>
              
              {/* Plant Recommendation Wizard */}
              <div className="mt-8">
                <PlantRecommendationWizard />
              </div>
            </motion.div>
          </TabsContent>
        
          <TabsContent value="maintenance" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="organic-card p-6 border-[10px] border-transparent">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">System Maintenance</h3>
                    <p className="text-emerald-200 text-sm">Predictive diagnostics and health monitoring</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-yellow-300">Monitoring</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="text-sm text-green-300 mb-1">System Health</div>
                    <div className="text-xl font-bold text-white">94%</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <div className="text-sm text-yellow-300 mb-1">Active Alerts</div>
                    <div className="text-xl font-bold text-white">2 Minor</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-xl p-4">
                    <div className="text-sm text-cyan-300 mb-1">Uptime</div>
                    <div className="text-xl font-bold text-white">99.8%</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="text-sm text-orange-300 mb-1">Next Service</div>
                    <div className="text-xl font-bold text-white">14 Days</div>
                  </div>
                </div>
              </div>
              
              <PredictiveMaintenance />
            </motion.div>
          </TabsContent>
        
          <TabsContent value="facilities" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="organic-card p-6 border-[10px] border-transparent mt-[5px] mb-[5px]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Multi Site Dashboard</h3>
                    <p className="text-emerald-200 text-sm">Cross-facility monitoring and unified control</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-300">All Sites Online</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
                    <div className="text-sm text-green-300 mb-1">Active Sites</div>
                    <div className="text-xl font-bold text-white">3 Online</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-xl p-4">
                    <div className="text-sm text-cyan-300 mb-1">Total Towers</div>
                    <div className="text-xl font-bold text-white">23 Units</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4">
                    <div className="text-sm text-orange-300 mb-1">Daily Yield</div>
                    <div className="text-xl font-bold text-white">127 kg</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                    <div className="text-sm text-purple-300 mb-1">Efficiency</div>
                    <div className="text-xl font-bold text-white">96.2%</div>
                  </div>
                </div>
              </div>
              
              <MultiSiteMonitoring />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;