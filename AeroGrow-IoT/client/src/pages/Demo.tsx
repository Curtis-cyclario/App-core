import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Monitor, 
  Camera, 
  BarChart3, 
  Settings,
  Leaf,
  Droplets,
  Sun,
  Thermometer,
  Activity,
  TrendingUp,
  Eye,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

const Demo: React.FC = () => {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Live Monitoring Dashboard",
      description: "Real-time sensor data and environmental controls",
      icon: <Monitor className="w-6 h-6" />,
      preview: "dashboard",
      metrics: [
        { label: "Temperature", value: "22.4°C", status: "optimal" },
        { label: "Humidity", value: "65%", status: "optimal" },
        { label: "Water Level", value: "78%", status: "good" },
        { label: "Nutrients", value: "82%", status: "optimal" }
      ]
    },
    {
      title: "AI Vision System",
      description: "Computer vision for plant health monitoring",
      icon: <Camera className="w-6 h-6" />,
      preview: "ai-vision",
      features: [
        "Disease detection",
        "Growth tracking",
        "Quality assessment",
        "Automated alerts"
      ]
    },
    {
      title: "Analytics & Reports",
      description: "Comprehensive data analysis and reporting",
      icon: <BarChart3 className="w-6 h-6" />,
      preview: "reports",
      charts: [
        "Yield optimization trends",
        "Resource efficiency metrics",
        "Performance comparisons",
        "Predictive insights"
      ]
    },
    {
      title: "System Configuration",
      description: "Automated controls and optimization settings",
      icon: <Settings className="w-6 h-6" />,
      preview: "settings",
      controls: [
        "Environmental parameters",
        "Automation rules",
        "Alert thresholds",
        "Integration settings"
      ]
    }
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        nextStep();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Leaf className="w-8 h-8 text-emerald-400" />
            <h1 className="text-4xl font-bold text-white">
              Vertigro Platform Demo
            </h1>
          </div>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the complete vertical farming intelligence platform with interactive demonstrations 
            of our core features and capabilities.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <Button 
              onClick={() => setLocation('/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl"
            >
              Try Live Platform
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setLocation('/')}
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-6 py-3 rounded-xl"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Demo Controls */}
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center space-x-4"
        >
          <Button
            onClick={startDemo}
            disabled={isPlaying}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Demo
          </Button>
          
          <Button
            onClick={pauseDemo}
            disabled={!isPlaying}
            variant="outline"
            className="border-slate-600"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
          
          <Button
            onClick={resetDemo}
            variant="outline"
            className="border-slate-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between mb-2">
            {demoSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-emerald-400' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
          <div className="text-center text-slate-400 text-sm">
            Step {currentStep + 1} of {demoSteps.length}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="container mx-auto px-6 pb-20">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-slate-800/50 border-slate-600 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="text-emerald-400">
                  {demoSteps[currentStep].icon}
                </div>
                <CardTitle className="text-white text-2xl">
                  {demoSteps[currentStep].title}
                </CardTitle>
              </div>
              <CardDescription className="text-slate-300 text-lg">
                {demoSteps[currentStep].description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Dashboard Preview */}
              {demoSteps[currentStep].preview === 'dashboard' && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {demoSteps[currentStep].metrics?.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-700/50 rounded-xl p-4 text-center"
                    >
                      <div className="text-slate-400 text-sm mb-1">{metric.label}</div>
                      <div className="text-white text-xl font-bold">{metric.value}</div>
                      <Badge 
                        className={`mt-2 ${
                          metric.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-400' :
                          metric.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {metric.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* AI Vision Preview */}
              {demoSteps[currentStep].preview === 'ai-vision' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 rounded-xl p-6 h-48 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Camera className="w-12 h-12 text-emerald-400 mx-auto" />
                      <div className="text-white font-semibold">Live Camera Feed</div>
                      <div className="text-slate-400 text-sm">AI-powered plant monitoring</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {demoSteps[currentStep].features?.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-3"
                      >
                        <Eye className="w-5 h-5 text-emerald-400" />
                        <span className="text-white">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reports Preview */}
              {demoSteps[currentStep].preview === 'reports' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 rounded-xl p-6 h-48 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <BarChart3 className="w-12 h-12 text-emerald-400 mx-auto" />
                      <div className="text-white font-semibold">Interactive Charts</div>
                      <div className="text-slate-400 text-sm">Real-time data visualization</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {demoSteps[currentStep].charts?.map((chart, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-3"
                      >
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <span className="text-white">{chart}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Preview */}
              {demoSteps[currentStep].preview === 'settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 rounded-xl p-6 h-48 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Settings className="w-12 h-12 text-emerald-400 mx-auto" />
                      <div className="text-white font-semibold">Automation Controls</div>
                      <div className="text-slate-400 text-sm">Smart system configuration</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {demoSteps[currentStep].controls?.map((control, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex items-center space-x-3 bg-slate-700/30 rounded-lg p-3"
                      >
                        <Shield className="w-5 h-5 text-emerald-400" />
                        <span className="text-white">{control}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-600">
                <Button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="border-slate-600"
                >
                  Previous
                </Button>
                
                <div className="text-slate-400 text-sm">
                  {currentStep + 1} / {demoSteps.length}
                </div>
                
                <Button
                  onClick={() => setCurrentStep(Math.min(demoSteps.length - 1, currentStep + 1))}
                  disabled={currentStep === demoSteps.length - 1}
                  variant="outline"
                  className="border-slate-600"
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600/10 to-blue-600/10 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-white">
              Ready to Experience Vertigro?
            </h3>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Start monitoring your vertical farm with our comprehensive platform today.
            </p>
            
            <Button 
              onClick={() => setLocation('/dashboard')}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg rounded-xl"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Demo;