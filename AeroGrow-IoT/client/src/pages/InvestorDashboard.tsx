import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  BarChart2,
  Zap,
  TrendingUp,
  Layers,
  Cpu,
  PieChart,
  Activity,
  Leaf,
  FileText,
  BarChart,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Rocket
} from 'lucide-react';
import { useSensorData } from '@/hooks/useSensorData';

// Simple demo of a 3D card with glassmorphic effect
const Feature3DCard = ({ title, description, icon: Icon, stats, color }: {
  title: string;
  description: string;
  icon: React.ElementType;
  stats: string;
  color: string;
}) => {
  return (
    <div className="relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300`}></div>
      <Card className="relative h-full glassmorphism border-opacity-50 transition-all duration-300 transform group-hover:scale-[1.01]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <Icon className={`h-6 w-6 ${color.includes('from-blue') ? 'text-blue-500' : 
                             color.includes('from-green') ? 'text-green-500' : 
                             color.includes('from-purple') ? 'text-purple-500' : 
                             color.includes('from-red') ? 'text-red-500' : 'text-primary'}`} />
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2 flex flex-col">
            <div className="text-3xl font-bold">{stats}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InvestorDashboard = () => {
  const { sensorData } = useSensorData();
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <BarChart2 className="h-8 w-8 text-primary" />
            VertiGrow Investment Opportunity
          </h1>
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 rounded-xl backdrop-blur-sm border border-primary/20">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-2">VertiGrow IoT Platform</h2>
            <p className="text-muted-foreground mb-4">
              A modular, scalable, and blockchain-verified digital twin platform for vertical farming systems 
              that optimizes yield, reduces resource consumption, and provides real-time insights.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="bg-primary/20 px-3 py-1 rounded-full text-sm font-medium">Vertical Farming</div>
              <div className="bg-blue-500/20 px-3 py-1 rounded-full text-sm font-medium">IoT Integration</div>
              <div className="bg-green-500/20 px-3 py-1 rounded-full text-sm font-medium">Resource Optimization</div>
              <div className="bg-purple-500/20 px-3 py-1 rounded-full text-sm font-medium">Blockchain Verification</div>
              <div className="bg-yellow-500/20 px-3 py-1 rounded-full text-sm font-medium">Digital Twin Technology</div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tech">Technology</TabsTrigger>
            <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
            <TabsTrigger value="roadmap">Launch Roadmap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Feature3DCard 
                title="Digital Twin"
                description="Interactive 3D models with real-time data integration"
                icon={Layers}
                stats={`${sensorData?.temperature || 24}°C | ${sensorData?.humidity || 65}%`}
                color="from-blue-600 to-cyan-600"
              />
              
              <Feature3DCard 
                title="Resource Efficiency"
                description="AI-optimized resource allocation and consumption"
                icon={Zap}
                stats="42% Savings"
                color="from-green-600 to-emerald-600"
              />
              
              <Feature3DCard 
                title="Yield Improvement"
                description="Optimal growing conditions for maximum yield"
                icon={TrendingUp}
                stats="3.5x Increase"
                color="from-purple-600 to-indigo-600"
              />
              
              <Feature3DCard 
                title="Multi-Site Capability"
                description="Centralized control of distributed growing facilities"
                icon={Cpu}
                stats="12 Sites"
                color="from-red-600 to-rose-600"
              />
              
              <Feature3DCard 
                title="Plant Recognition"
                description="Computer vision for growth tracking and health monitoring"
                icon={Leaf}
                stats="99.2% Accuracy"
                color="from-green-600 to-teal-600"
              />
              
              <Feature3DCard 
                title="Blockchain Integration"
                description="Immutable record-keeping and verification"
                icon={Activity}
                stats="100% Verified"
                color="from-blue-600 to-sky-600"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tech" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Technology Stack</CardTitle>
                  <CardDescription>Core components powering our platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <Layers className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">3D Digital Twin Visualization</h3>
                        <p className="text-sm text-muted-foreground">
                          WebGL-powered interactive 3D models with real-time data overlays and environmental simulation
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Blockchain Data Verification</h3>
                        <p className="text-sm text-muted-foreground">
                          Immutable records of sensor data and growing conditions ensuring traceability and authenticity
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <Leaf className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Computer Vision & AI</h3>
                        <p className="text-sm text-muted-foreground">
                          Advanced plant recognition, growth tracking, and predictive analytics for optimal harvesting
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Cpu className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">IoT Sensor Network</h3>
                        <p className="text-sm text-muted-foreground">
                          Low-power, high-reliability sensor mesh with redundant connectivity options
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Key Differentiators</CardTitle>
                  <CardDescription>What sets our solution apart</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <BarChart2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Full-Spectrum Monitoring</h3>
                        <p className="text-sm text-muted-foreground">
                          Holistic environmental and biological monitoring provides unprecedented visibility into growing conditions
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500/20 p-2 rounded-lg">
                        <PieChart className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Modular Widget System</h3>
                        <p className="text-sm text-muted-foreground">
                          Drag-and-drop customizable dashboards tailored to different user personas and use cases
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Predictive Yield Optimization</h3>
                        <p className="text-sm text-muted-foreground">
                          ML-powered forecasting helps optimize planting and harvesting schedules for maximum yield
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <BarChart className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-medium">Advanced Analytics for Technical Users</h3>
                        <p className="text-sm text-muted-foreground">
                          Dedicated technical dashboards with deep data exploration and custom report generation
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="metrics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Resource Efficiency Metrics</CardTitle>
                  <CardDescription>Compared to traditional farming methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Water Usage</span>
                        <span className="text-sm font-medium text-green-500 dark:text-green-400">-95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Energy Consumption</span>
                        <span className="text-sm font-medium text-green-500 dark:text-green-400">-42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Land Utilization</span>
                        <span className="text-sm font-medium text-green-500 dark:text-green-400">-99%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full" style={{ width: '99%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Nutrient Recycling</span>
                        <span className="text-sm font-medium text-green-500 dark:text-green-400">+87%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Carbon Footprint</span>
                        <span className="text-sm font-medium text-green-500 dark:text-green-400">-76%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Productivity Metrics</CardTitle>
                  <CardDescription>Yield and operational improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Crop Yield</span>
                        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">+350%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Growing Cycles Per Year</span>
                        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">+220%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Labor Efficiency</span>
                        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">+180%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Plant Health & Quality</span>
                        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">+90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Time-to-Market</span>
                        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">-65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="roadmap" className="mt-6">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Growth & Market Opportunity</CardTitle>
                <CardDescription>Five-year projections and market analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Market Opportunity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Global Vertical Farming Market</p>
                          <p className="text-sm text-muted-foreground">Current estimated value</p>
                        </div>
                        <div className="text-xl font-bold">$7.3B</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Projected Market by 2028</p>
                          <p className="text-sm text-muted-foreground">CAGR of 25.2%</p>
                        </div>
                        <div className="text-xl font-bold">$22.1B</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">AgTech Software Segment</p>
                          <p className="text-sm text-muted-foreground">Current market share opportunity</p>
                        </div>
                        <div className="text-xl font-bold">$1.8B</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Target Market Penetration</p>
                          <p className="text-sm text-muted-foreground">5-year goal</p>
                        </div>
                        <div className="text-xl font-bold">8.5%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Revenue Projections</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Year 1 Revenue</p>
                          <p className="text-sm text-muted-foreground">Initial launch with 15 clients</p>
                        </div>
                        <div className="text-xl font-bold">$1.2M</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Year 3 Revenue</p>
                          <p className="text-sm text-muted-foreground">Scale to 120+ clients</p>
                        </div>
                        <div className="text-xl font-bold">$14.8M</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Year 5 Revenue</p>
                          <p className="text-sm text-muted-foreground">Full market penetration</p>
                        </div>
                        <div className="text-xl font-bold">$52.3M</div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Projected Profit Margin</p>
                          <p className="text-sm text-muted-foreground">Year 5</p>
                        </div>
                        <div className="text-xl font-bold">42%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="text-sm text-muted-foreground">Full financial breakdown available upon request</div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestorDashboard;