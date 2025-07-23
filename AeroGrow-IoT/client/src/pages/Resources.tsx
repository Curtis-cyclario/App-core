import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  ExternalLink, 
  Users, 
  Code, 
  Lightbulb,
  Database,
  Settings,
  Zap,
  Leaf,
  Network,
  Brain,
  Shield
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'documentation' | 'video' | 'guide' | 'api' | 'whitepaper' | 'tutorial';
  category: string;
  icon: React.ReactNode;
  downloadUrl?: string;
  externalUrl?: string;
  tags: string[];
  featured?: boolean;
}

const Resources: React.FC = () => {
  const resources: Resource[] = [
    {
      id: '1',
      title: 'VertiGro IoT Platform Documentation',
      description: 'Complete technical documentation covering installation, configuration, and API integration.',
      type: 'documentation',
      category: 'Technical',
      icon: <BookOpen className="w-6 h-6" />,
      externalUrl: '#',
      tags: ['API', 'Setup', 'Integration'],
      featured: true
    },
    {
      id: '2',
      title: 'Smart Agriculture Best Practices',
      description: 'Industry guide on implementing IoT solutions for vertical farming and precision agriculture.',
      type: 'guide',
      category: 'Agriculture',
      icon: <Leaf className="w-6 h-6" />,
      downloadUrl: '#',
      tags: ['Agriculture', 'Best Practices', 'IoT'],
      featured: true
    },
    {
      id: '3',
      title: 'Network Topology Setup Guide',
      description: 'Step-by-step instructions for configuring sensor networks and device connectivity.',
      type: 'tutorial',
      category: 'Network',
      icon: <Network className="w-6 h-6" />,
      downloadUrl: '#',
      tags: ['Networking', 'Sensors', 'Configuration']
    },
    {
      id: '4',
      title: 'AI Diagnostics Training Materials',
      description: 'Machine learning models and training datasets for plant health diagnostics.',
      type: 'tutorial',
      category: 'AI/ML',
      icon: <Brain className="w-6 h-6" />,
      downloadUrl: '#',
      tags: ['AI', 'Machine Learning', 'Diagnostics']
    },
    {
      id: '5',
      title: 'Blockchain Integration Whitepaper',
      description: 'Technical overview of supply chain transparency and crop tokenization implementation.',
      type: 'whitepaper',
      category: 'Blockchain',
      icon: <Shield className="w-6 h-6" />,
      downloadUrl: '#',
      tags: ['Blockchain', 'Supply Chain', 'Tokenization']
    },
    {
      id: '6',
      title: 'Platform Demo Video Series',
      description: 'Video walkthrough of key features including monitoring, analytics, and device management.',
      type: 'video',
      category: 'Training',
      icon: <Video className="w-6 h-6" />,
      externalUrl: '#',
      tags: ['Demo', 'Training', 'Features']
    },
    {
      id: '7',
      title: 'API Reference Documentation',
      description: 'Complete REST API documentation with examples and SDK information.',
      type: 'api',
      category: 'Development',
      icon: <Code className="w-6 h-6" />,
      externalUrl: '#',
      tags: ['API', 'Development', 'SDK']
    },
    {
      id: '8',
      title: 'Energy Efficiency Optimization',
      description: 'Guidelines for optimizing power consumption and implementing renewable energy solutions.',
      type: 'guide',
      category: 'Energy',
      icon: <Zap className="w-6 h-6" />,
      downloadUrl: '#',
      tags: ['Energy', 'Optimization', 'Sustainability']
    },
    {
      id: '9',
      title: 'Database Schema Reference',
      description: 'Complete database schema documentation with entity relationships and data flows.',
      type: 'documentation',
      category: 'Technical',
      icon: <Database className="w-6 h-6" />,
      downloadUrl: '#',
      tags: ['Database', 'Schema', 'Data']
    },
    {
      id: '10',
      title: 'Community Guidelines',
      description: 'Best practices for community collaboration and knowledge sharing.',
      type: 'guide',
      category: 'Community',
      icon: <Users className="w-6 h-6" />,
      externalUrl: '#',
      tags: ['Community', 'Collaboration', 'Guidelines']
    }
  ];

  const categories = ['All', 'Technical', 'Agriculture', 'Network', 'AI/ML', 'Blockchain', 'Training', 'Development', 'Energy', 'Community'];
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const featuredResources = resources.filter(resource => resource.featured);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'documentation': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'video': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'guide': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'api': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'whitepaper': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'tutorial': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Resources & Documentation</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Access comprehensive guides, documentation, and learning materials to maximize your VertiGro IoT platform experience.
          </p>
        </div>

        {/* Featured Resources */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
            Featured Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-slate-800/50 border-slate-600 hover:border-emerald-500/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                          {resource.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                          <Badge className={getTypeColor(resource.type)}>
                            {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300">{resource.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      {resource.downloadUrl && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {resource.externalUrl && (
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Online
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">All Resources</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 
                  "bg-emerald-600 hover:bg-emerald-700" : 
                  "border-slate-600 text-slate-300 hover:bg-slate-700"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="bg-slate-800/50 border-slate-600 hover:border-blue-500/50 transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{resource.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getTypeColor(resource.type)}>
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </Badge>
                        <span className="text-xs text-slate-400">{resource.category}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">{resource.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2 pt-2">
                    {resource.downloadUrl && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                    {resource.externalUrl && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <Card className="bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border-emerald-500/30">
          <CardContent className="p-8 text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
            <h3 className="text-2xl font-semibold text-white mb-2">Need Additional Support?</h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is ready to help you get the most out of your VertiGro IoT platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Users className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <BookOpen className="w-4 h-4 mr-2" />
                Community Forum
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Resources;