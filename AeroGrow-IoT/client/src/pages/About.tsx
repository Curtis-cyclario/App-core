import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  BarChart3, 
  Camera, 
  Shield, 
  Globe, 
  Zap,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Eye,
  Droplets,
  Sun,
  Activity,
  Users,
  Building,
  Network,
  Cpu,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const About: React.FC = () => {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-Time Analytics",
      description: "Monitor your vertical farms with live sensor data, environmental controls, and predictive insights.",
      color: "emerald"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AI Vision System",
      description: "Advanced computer vision for plant health monitoring, disease detection, and growth optimization.",
      color: "blue"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Blockchain Tracking",
      description: "Secure supply chain verification and crop tokenization for complete transparency.",
      color: "purple"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Multi-Site Management",
      description: "Scale across multiple facilities with centralized monitoring and automated controls.",
      color: "cyan"
    }
  ];

  const platformModules = [
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Monitoring",
      description: "Real-time sensor data and environmental controls"
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Network Topology",
      description: "IoT device management and connectivity visualization"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Device Management",
      description: "Hardware configuration and status monitoring"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Facility Management",
      description: "Multi-site coordination and resource allocation"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Plant Health",
      description: "Growth tracking and health diagnostics"
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: "Resource Efficiency",
      description: "Water, energy, and nutrient optimization"
    }
  ];

  const benefits = [
    "Increase yield by 40% with AI optimization",
    "Reduce water usage by 95% with precise controls",
    "24/7 automated monitoring and alerts",
    "Enterprise-grade reporting and analytics",
    "Blockchain verified supply chain tracking",
    "Multi-site facility management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="container mx-auto px-6 py-12 space-y-16">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <Leaf className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Vertigro
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            The Future of Vertical Farming Intelligence
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Vertigro is a comprehensive agricultural intelligence platform designed for vertical farming operations. 
            It provides real-time monitoring, AI-powered analytics, and automated control systems for optimizing 
            plant growth in controlled environments.
          </p>
        </motion.div>

        {/* Core Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Features</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive tools for modern vertical farming management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-3 rounded-full bg-emerald-100 dark:bg-emerald-900/20 w-fit">
                      <div className="text-emerald-600 dark:text-emerald-400">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Modules */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Platform Modules</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Integrated modules for complete farming operation management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformModules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border hover:shadow-md transition-all duration-300"
              >
                <div className="flex-shrink-0 p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-emerald-600 dark:text-emerald-400">
                    {module.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{module.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{module.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Benefits</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Proven results for vertical farming operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/10 dark:to-cyan-900/10 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Transform your vertical farming operations with AI-powered monitoring, real-time analytics, 
            and automated optimization systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setLocation('/dashboard')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
            >
              View Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              variant="outline"
              onClick={() => setLocation('/resources')}
              className="px-6 py-3"
            >
              Documentation
            </Button>
          </div>
        </motion.div>

        {/* Version & Technical Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center space-y-4 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary">Version 2.0</Badge>
            <Badge variant="outline">React + TypeScript</Badge>
            <Badge variant="outline">Real-time WebSocket</Badge>
            <Badge variant="outline">AI-Powered</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built for modern vertical farming operations with enterprise-grade reliability and scalability
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default About;