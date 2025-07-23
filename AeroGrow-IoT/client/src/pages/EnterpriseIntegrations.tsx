import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { DemoButton } from '@/components/ui/demo-button';
import { 
  Zap, 
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Database,
  Cloud,
  Webhook,
  Code,
  Mail,
  MessageSquare,
  BarChart3,
  Truck,
  DollarSign,
  Shield,
  Globe,
  Bot,
  Workflow,
  Play,
  Pause,
  Edit,
  Plus,
  Activity
} from 'lucide-react';

const EnterpriseIntegrations: React.FC = () => {
  const [activeIntegrations, setActiveIntegrations] = useState<Record<string, boolean>>({
    salesforce: true,
    slack: true,
    webhook: false,
    sap: true,
    aws: true,
    powerbi: false
  });

  const integrations = [
    {
      id: 'salesforce',
      name: 'Salesforce CRM',
      description: 'Sync customer data and sales opportunities',
      category: 'CRM',
      icon: Database,
      status: 'connected',
      lastSync: '2 minutes ago',
      features: ['Customer sync', 'Lead tracking', 'Revenue analytics']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Real-time notifications and team alerts',
      category: 'Communication',
      icon: MessageSquare,
      status: 'connected',
      lastSync: '5 minutes ago',
      features: ['Alert notifications', 'Team updates', 'Bot commands']
    },
    {
      id: 'webhook',
      name: 'Custom Webhooks',
      description: 'Connect to any third-party service',
      category: 'API',
      icon: Webhook,
      status: 'disconnected',
      lastSync: 'Never',
      features: ['Real-time data push', 'Custom endpoints', 'Event triggers']
    },
    {
      id: 'sap',
      name: 'SAP ERP',
      description: 'Enterprise resource planning integration',
      category: 'ERP',
      icon: BarChart3,
      status: 'connected',
      lastSync: '1 hour ago',
      features: ['Inventory sync', 'Financial data', 'Supply chain']
    },
    {
      id: 'aws',
      name: 'AWS IoT Core',
      description: 'Cloud infrastructure and IoT device management',
      category: 'Cloud',
      icon: Cloud,
      status: 'connected',
      lastSync: 'Real-time',
      features: ['Device management', 'Data storage', 'Analytics']
    },
    {
      id: 'powerbi',
      name: 'Microsoft Power BI',
      description: 'Advanced business intelligence and reporting',
      category: 'Analytics',
      icon: BarChart3,
      status: 'disconnected',
      lastSync: 'Never',
      features: ['Custom dashboards', 'Data visualization', 'Reports']
    }
  ];

  const automatedWorkflows = [
    {
      id: 1,
      name: 'Quality Alert System',
      description: 'Automatically notify team when plant health drops below threshold',
      trigger: 'Plant health < 85%',
      actions: ['Send Slack alert', 'Create Salesforce task', 'Email supervisor'],
      status: 'active',
      runs: 47,
      lastRun: '3 hours ago'
    },
    {
      id: 2,
      name: 'Harvest Optimization',
      description: 'Predict optimal harvest time and schedule logistics',
      trigger: 'Growth stage = Ready',
      actions: ['Update inventory', 'Schedule transport', 'Notify sales team'],
      status: 'active',
      runs: 23,
      lastRun: '1 day ago'
    },
    {
      id: 3,
      name: 'Energy Efficiency Monitor',
      description: 'Track energy usage and optimize consumption patterns',
      trigger: 'Energy usage > baseline + 10%',
      actions: ['Adjust lighting', 'Log incident', 'Generate report'],
      status: 'paused',
      runs: 156,
      lastRun: '2 days ago'
    },
    {
      id: 4,
      name: 'Customer Delivery Updates',
      description: 'Automatically update customers on order status',
      trigger: 'Order status change',
      actions: ['Send email', 'Update CRM', 'Log interaction'],
      status: 'active',
      runs: 89,
      lastRun: '1 hour ago'
    }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/sensors/data',
      description: 'Real-time sensor data',
      usage: '2.4K calls/day'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/controls/adjust',
      description: 'Control environmental systems',
      usage: '156 calls/day'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/analytics/yield',
      description: 'Yield predictions and analytics',
      usage: '843 calls/day'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/alerts/create',
      description: 'Create custom alerts',
      usage: '67 calls/day'
    }
  ];

  const toggleIntegration = (id: string) => {
    setActiveIntegrations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'disconnected': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getWorkflowStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-radial from-teal-500/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 organic-card p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Enterprise Integrations & Automation</h1>
                <p className="text-emerald-200">Connect your agricultural systems with enterprise-grade integrations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DemoButton className="organic-button-secondary" demoText="Integration wizard coming soon!">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </DemoButton>
              <DemoButton className="organic-button-primary" demoText="Workflow builder coming soon!">
                <Workflow className="h-4 w-4 mr-2" />
                Create Workflow
              </DemoButton>
            </div>
          </div>
        </motion.div>

        {/* Integration Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="organic-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-300">Active Integrations</div>
            </CardContent>
          </Card>
          <Card className="organic-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {automatedWorkflows.filter(w => w.status === 'active').length}
              </div>
              <div className="text-sm text-gray-300">Active Workflows</div>
            </CardContent>
          </Card>
          <Card className="organic-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {apiEndpoints.reduce((sum, api) => sum + parseInt(api.usage.replace(/[^\d]/g, '')), 0)}
              </div>
              <div className="text-sm text-gray-300">API Calls Today</div>
            </CardContent>
          </Card>
          <Card className="organic-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">99.9%</div>
              <div className="text-sm text-gray-300">Uptime</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="integrations" className="w-full">
          <TabsList className="organic-card p-2 flex flex-wrap justify-center gap-2 mb-6">
            <TabsTrigger value="integrations" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="workflows" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <Workflow className="h-4 w-4 mr-2" />
              Automated Workflows
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <Code className="h-4 w-4 mr-2" />
              API Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => {
                const IconComponent = integration.icon;
                return (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: integrations.indexOf(integration) * 0.1 }}
                  >
                    <Card className="organic-card h-full">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                              <IconComponent className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{integration.name}</h3>
                              <div className="text-xs text-gray-400">{integration.category}</div>
                            </div>
                          </div>
                          <Switch
                            checked={activeIntegrations[integration.id]}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-4">{integration.description}</p>
                        
                        <div className="mb-4">
                          <Badge className={getStatusColor(integration.status)}>
                            {integration.status === 'connected' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                            {integration.status}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-400 mb-4">
                          Last sync: {integration.lastSync}
                        </div>
                        
                        <div className="space-y-1 mb-4">
                          {integration.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs text-gray-300">
                              <CheckCircle className="h-3 w-3 text-emerald-400" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <DemoButton className="w-full organic-button-secondary text-sm" demoText="Configuration coming soon!">
                          <Settings className="h-3 w-3 mr-2" />
                          Configure
                        </DemoButton>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="workflows">
            <div className="space-y-4">
              {automatedWorkflows.map((workflow) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: workflow.id * 0.1 }}
                >
                  <Card className="organic-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-white">{workflow.name}</h3>
                            <Badge className={getWorkflowStatusColor(workflow.status)}>
                              {workflow.status === 'active' ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                              {workflow.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300 mb-3">{workflow.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                              <span className="text-gray-400">Trigger: </span>
                              <span className="text-blue-300">{workflow.trigger}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Runs: </span>
                              <span className="text-emerald-300">{workflow.runs}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Last run: </span>
                              <span className="text-gray-300">{workflow.lastRun}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DemoButton className="organic-button-secondary text-sm" demoText="Workflow editor coming soon!">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </DemoButton>
                          <DemoButton className="organic-button-secondary text-sm" demoText="Workflow controls coming soon!">
                            {workflow.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </DemoButton>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-gray-400">Actions:</span>
                        {workflow.actions.map((action, index) => (
                          <React.Fragment key={index}>
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                              {action}
                            </Badge>
                            {index < workflow.actions.length - 1 && <ArrowRight className="h-3 w-3 text-gray-500" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Code className="h-5 w-5 text-emerald-400" />
                    <span>API Endpoints</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={`${
                              endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            } text-xs`}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm text-emerald-300">{endpoint.endpoint}</code>
                          </div>
                          <span className="text-xs text-gray-400">{endpoint.usage}</span>
                        </div>
                        <p className="text-sm text-gray-300">{endpoint.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span>API Security & Access</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-white">API Security Status</span>
                      </div>
                      <div className="text-xs text-green-300">All endpoints secured with OAuth 2.0 and rate limiting</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Rate Limit</span>
                        <span className="text-sm text-emerald-400">1000 req/hour</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Authentication</span>
                        <span className="text-sm text-emerald-400">OAuth 2.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Encryption</span>
                        <span className="text-sm text-emerald-400">TLS 1.3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">API Version</span>
                        <span className="text-sm text-emerald-400">v1.2.0</span>
                      </div>
                    </div>
                    
                    <DemoButton className="w-full organic-button-primary text-sm" demoText="API key management coming soon!">
                      <Plus className="h-4 w-4 mr-2" />
                      Generate API Key
                    </DemoButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnterpriseIntegrations;