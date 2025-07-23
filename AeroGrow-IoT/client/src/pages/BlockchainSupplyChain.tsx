import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DemoButton } from '@/components/ui/demo-button';
import { 
  Shield, 
  Search, 
  Package,
  Truck,
  Store,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  QrCode,
  FileText,
  Globe,
  Lock,
  Leaf,
  MapPin,
  Calendar,
  User,
  Award,
  TrendingUp,
  Activity,
  Share2
} from 'lucide-react';

interface SupplyChainStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  status: 'completed' | 'in-progress' | 'pending';
  verifier: string;
  transactionHash?: string;
  icon: React.ElementType;
}

interface Product {
  id: string;
  name: string;
  type: string;
  origin: string;
  batchId: string;
  harvestDate: string;
  currentLocation: string;
  carbonFootprint: number;
  organicCertified: boolean;
  sustainabilityScore: number;
  verificationStatus: 'verified' | 'pending' | 'failed';
}

const BlockchainSupplyChain = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const sampleProduct: Product = {
    id: 'BC-7829-2024',
    name: 'Organic Basil Batch #47',
    type: 'Fresh Herbs',
    origin: 'VertiGrow Facility A, San Francisco',
    batchId: 'BAS-2024-047',
    harvestDate: '2024-06-03',
    currentLocation: 'Distribution Center, Oakland',
    carbonFootprint: 0.12,
    organicCertified: true,
    sustainabilityScore: 94,
    verificationStatus: 'verified'
  };

  const supplyChainSteps: SupplyChainStep[] = [
    {
      id: '1',
      title: 'Seed Sourcing',
      description: 'Organic basil seeds sourced from certified supplier',
      timestamp: '2024-03-15 09:00',
      location: 'Organic Seeds Inc., Davis CA',
      status: 'completed',
      verifier: 'USDA Organic Certification',
      transactionHash: '0x1a2b3c4d...',
      icon: Leaf
    },
    {
      id: '2',
      title: 'Planting & Growth',
      description: 'Seeds planted in controlled vertical farming environment',
      timestamp: '2024-03-20 14:30',
      location: 'VertiGrow Facility A, San Francisco',
      status: 'completed',
      verifier: 'VertiGrow Systems',
      transactionHash: '0x2b3c4d5e...',
      icon: Package
    },
    {
      id: '3',
      title: 'Growth Monitoring',
      description: 'AI-monitored growth with optimal conditions maintained',
      timestamp: '2024-04-01 - 2024-06-01',
      location: 'VertiGrow Facility A, Tower 3',
      status: 'completed',
      verifier: 'Automated IoT Systems',
      transactionHash: '0x3c4d5e6f...',
      icon: Activity
    },
    {
      id: '4',
      title: 'Quality Testing',
      description: 'Comprehensive quality and safety testing completed',
      timestamp: '2024-06-02 11:00',
      location: 'VertiGrow Lab, San Francisco',
      status: 'completed',
      verifier: 'AgriTest Labs',
      transactionHash: '0x4d5e6f7g...',
      icon: CheckCircle
    },
    {
      id: '5',
      title: 'Harvest',
      description: 'Fresh basil harvested at peak freshness',
      timestamp: '2024-06-03 06:00',
      location: 'VertiGrow Facility A, San Francisco',
      status: 'completed',
      verifier: 'Harvest Team Lead',
      transactionHash: '0x5e6f7g8h...',
      icon: Award
    },
    {
      id: '6',
      title: 'Packaging',
      description: 'Sustainably packaged with biodegradable materials',
      timestamp: '2024-06-03 08:30',
      location: 'VertiGrow Packaging Center',
      status: 'completed',
      verifier: 'Packaging Quality Control',
      transactionHash: '0x6f7g8h9i...',
      icon: Package
    },
    {
      id: '7',
      title: 'Transportation',
      description: 'Cold-chain transport to distribution center',
      timestamp: '2024-06-03 10:00',
      location: 'En route to Oakland Distribution',
      status: 'in-progress',
      verifier: 'GreenLogistics Inc.',
      icon: Truck
    },
    {
      id: '8',
      title: 'Retail Distribution',
      description: 'Distribution to retail partners',
      timestamp: 'Pending arrival',
      location: 'Various retail locations',
      status: 'pending',
      verifier: 'Retail Partners',
      icon: Store
    }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSelectedProduct(sampleProduct);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Blockchain Supply Chain Tracking</h1>
              <p className="text-emerald-200">Transparent, immutable tracking from seed to shelf</p>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <Card className="organic-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter product ID, batch number, or QR code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-gray-800/50 border-emerald-500/20 text-white"
                />
              </div>
              <Button onClick={handleSearch} className="organic-button-primary">
                <Search className="h-4 w-4 mr-2" />
                Track Product
              </Button>
              <DemoButton className="organic-button-secondary" demoText="QR scanner coming soon!">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR
              </DemoButton>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Product Information */}
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-emerald-400" />
                    <span>Product Information</span>
                  </div>
                  <Badge className={`${
                    selectedProduct.verificationStatus === 'verified' 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {selectedProduct.verificationStatus === 'verified' ? 'Blockchain Verified' : 'Verification Pending'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Product Details</div>
                    <div className="text-lg font-semibold text-white">{selectedProduct.name}</div>
                    <div className="text-sm text-emerald-300">{selectedProduct.type}</div>
                    <div className="text-xs text-gray-400">ID: {selectedProduct.id}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Origin & Location</div>
                    <div className="flex items-center space-x-1 text-sm text-white">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedProduct.origin}</span>
                    </div>
                    <div className="text-sm text-blue-300">Current: {selectedProduct.currentLocation}</div>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Harvested: {selectedProduct.harvestDate}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Sustainability</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-lg font-bold text-emerald-400">{selectedProduct.sustainabilityScore}%</div>
                      <Progress value={selectedProduct.sustainabilityScore} className="flex-1 h-2" />
                    </div>
                    <div className="text-xs text-emerald-300">Carbon: {selectedProduct.carbonFootprint} kg CO₂</div>
                    {selectedProduct.organicCertified && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Leaf className="h-3 w-3 mr-1" />
                        Organic Certified
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">Blockchain Info</div>
                    <div className="text-sm text-white">Batch: {selectedProduct.batchId}</div>
                    <DemoButton className="organic-button-secondary text-xs" demoText="Blockchain explorer coming soon!">
                      <Globe className="h-3 w-3 mr-1" />
                      View on Chain
                    </DemoButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Timeline */}
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <ArrowRight className="h-5 w-5 text-emerald-400" />
                  <span>Supply Chain Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplyChainSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Connection Line */}
                        {index < supplyChainSteps.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gradient-to-b from-emerald-500/50 to-gray-600" />
                        )}
                        
                        <div className="flex items-start space-x-4 p-4 bg-gray-800/30 border border-gray-600 rounded-xl">
                          {/* Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                            step.status === 'completed' 
                              ? 'bg-emerald-500/20 border-emerald-500' 
                              : step.status === 'in-progress'
                              ? 'bg-yellow-500/20 border-yellow-500'
                              : 'bg-gray-500/20 border-gray-500'
                          }`}>
                            <StepIcon className={`h-5 w-5 ${
                              step.status === 'completed' 
                                ? 'text-emerald-400' 
                                : step.status === 'in-progress'
                                ? 'text-yellow-400'
                                : 'text-gray-400'
                            }`} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-white">{step.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(step.status)}>
                                  {getStatusIcon(step.status)}
                                  <span className="ml-1 capitalize">{step.status.replace('-', ' ')}</span>
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div className="flex items-center space-x-1 text-gray-400">
                                <Clock className="h-3 w-3" />
                                <span>{step.timestamp}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-400">
                                <MapPin className="h-3 w-3" />
                                <span>{step.location}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-400">
                                <User className="h-3 w-3" />
                                <span>Verified by: {step.verifier}</span>
                              </div>
                            </div>
                            
                            {step.transactionHash && (
                              <div className="mt-2">
                                <DemoButton className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20" demoText="Blockchain explorer coming soon!">
                                  <Lock className="h-3 w-3 mr-1" />
                                  TX: {step.transactionHash}
                                </DemoButton>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex space-x-4">
              <DemoButton className="organic-button-primary" demoText="Report generation coming soon!">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </DemoButton>
              <DemoButton className="organic-button-secondary" demoText="Sharing features coming soon!">
                <Share2 className="h-4 w-4 mr-2" />
                Share Tracking
              </DemoButton>
              <DemoButton className="organic-button-secondary" demoText="Certification downloads coming soon!">
                <Award className="h-4 w-4 mr-2" />
                Download Certificates
              </DemoButton>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!selectedProduct && (
          <Card className="organic-card">
            <CardContent className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Track Your Product</h3>
              <p className="text-gray-400 mb-4">Enter a product ID or scan a QR code to view the complete supply chain journey</p>
              <p className="text-sm text-emerald-300">Try searching: BC-7829-2024</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BlockchainSupplyChain;