import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Leaf, 
  Zap, 
  BarChart3, 
  Camera, 
  Shield, 
  Globe, 
  Users,
  CheckCircle,
  Play,
  Sparkles,
  TrendingUp,
  Eye,
  Droplets,
  Sun,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

const Landing: React.FC = () => {
  const [, setLocation] = useLocation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on first visit
    const hasVisited = localStorage.getItem('vertigro-visited');
    return !hasVisited;
  });

  React.useEffect(() => {
    if (showSplash) {
      // Mark as visited
      localStorage.setItem('vertigro-visited', 'true');
      
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

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

  const getStartedSteps = [
    {
      title: "Connect Your System",
      description: "Link your IoT devices and sensors to start monitoring",
      icon: <Zap className="w-5 h-5" />
    },
    {
      title: "Set Up Monitoring",
      description: "Configure environmental parameters and alerts",
      icon: <Eye className="w-5 h-5" />
    },
    {
      title: "Optimize Growth",
      description: "Use AI insights to maximize yield and efficiency",
      icon: <TrendingUp className="w-5 h-5" />
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

  // Splash screen component
  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Leaf className="w-16 h-16 text-emerald-400" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
            >
              Vertigro
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-xl text-slate-300"
          >
            Loading Vertical Farming Intelligence...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            {/* Logo and Branding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="relative animate-float">
                  <Leaf className="w-12 h-12 text-emerald-400 animate-pulse-warm" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                  <div className="absolute inset-0 animate-warm-glow rounded-full"></div>
                </div>
                <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 via-blue-400 via-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-cycle">
                  Vertigro
                </h1>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white max-w-4xl mx-auto">
                The Future of Vertical Farming Intelligence
              </h2>
              
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Transform your vertical farming operations with AI-powered monitoring, 
                real-time analytics, and automated optimization systems.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Button 
                onClick={() => setLocation('/dashboard')}
                className="btn-warm-gradient text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 animate-shimmer"
              >
                Start Monitoring
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setLocation('/demo')}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg rounded-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
            >
              {[
                { icon: <Activity className="w-6 h-6" />, label: "Real-Time Monitoring", value: "24/7" },
                { icon: <TrendingUp className="w-6 h-6" />, label: "Yield Increase", value: "40%" },
                { icon: <Droplets className="w-6 h-6" />, label: "Water Savings", value: "95%" }
              ].map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-emerald-400 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-white mb-4">
              Complete Vertical Farming Solution
            </h3>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Everything you need to monitor, optimize, and scale your vertical farming operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-slate-800/50 border-slate-600 hover:border-emerald-500/50 transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <div className={`text-${feature.color}-400 flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-300 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-6">
                Get Started in Minutes
              </h3>
              <p className="text-slate-300 text-lg mb-8">
                Vertigro is designed for immediate deployment. Connect your existing IoT infrastructure 
                and start monitoring within minutes, not hours.
              </p>

              <div className="space-y-6">
                {getStartedSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                      <p className="text-slate-400">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={() => setLocation('/dashboard')}
                className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl"
              >
                Start Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="bg-slate-800/50 border-slate-600 p-6">
                <h4 className="text-white font-semibold mb-4">Platform Benefits</h4>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <Sun className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Smart Lighting</div>
                  <div className="text-slate-400 text-sm">Automated optimization</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                  <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-white font-semibold">Water Management</div>
                  <div className="text-slate-400 text-sm">Precision delivery</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-emerald-600/10 to-blue-600/10">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h3 className="text-3xl font-bold text-white">
              Ready to Transform Your Vertical Farm?
            </h3>
            <p className="text-slate-300 text-lg">
              Join the future of agriculture with Vertigro's comprehensive monitoring and optimization platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                onClick={() => setLocation('/dashboard')}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setLocation('/contact')}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg rounded-xl"
              >
                Contact Sales
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-slate-400 text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Global Scale</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;