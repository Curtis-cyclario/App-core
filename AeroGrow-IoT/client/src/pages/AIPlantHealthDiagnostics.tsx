import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  Upload, 
  Scan, 
  Brain,
  Leaf,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Bug,
  Droplets,
  Sun,
  Activity,
  Download,
  Share,
  History
} from 'lucide-react';

const AIPlantHealthDiagnostics = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIAnalysis = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simulate AI analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          
          // Simulate AI analysis result
          setAnalysisResult({
            overallHealth: 87,
            confidence: 94,
            issues: [
              {
                type: 'disease',
                name: 'Early Blight',
                severity: 'Low',
                confidence: 78,
                treatment: 'Apply copper-based fungicide',
                color: 'yellow'
              },
              {
                type: 'nutrient',
                name: 'Nitrogen Deficiency',
                severity: 'Medium',
                confidence: 85,
                treatment: 'Increase nitrogen fertilizer',
                color: 'orange'
              }
            ],
            recommendations: [
              'Increase watering frequency by 20%',
              'Adjust light exposure to 6-8 hours daily',
              'Monitor humidity levels (optimal: 60-70%)',
              'Consider repotting in 2-3 weeks'
            ],
            plantSpecies: 'Lycopersicon esculentum (Tomato)',
            growthStage: 'Vegetative',
            estimatedYield: '2.3 kg'
          });
          
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  const recentAnalyses = [
    {
      id: 1,
      plantName: 'Basil Plant #3',
      date: '2 hours ago',
      health: 92,
      status: 'Healthy'
    },
    {
      id: 2,
      plantName: 'Tomato Tower A',
      date: '5 hours ago',
      health: 76,
      status: 'Needs Attention'
    },
    {
      id: 3,
      plantName: 'Lettuce Batch 12',
      date: '1 day ago',
      health: 88,
      status: 'Good'
    }
  ];

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
            <Brain className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">AI Plant Health Diagnostics</h1>
              <p className="text-emerald-200">Advanced computer vision analysis for plant health assessment</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Scan className="h-5 w-5 text-emerald-400" />
                  <span>Plant Image Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-emerald-500/30 rounded-xl p-8 text-center">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={selectedImage} 
                        alt="Plant analysis" 
                        className="max-h-64 mx-auto rounded-lg shadow-lg"
                      />
                      <div className="flex space-x-2 justify-center">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="organic-button-secondary"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Different Image
                        </Button>
                        <Button
                          onClick={runAIAnalysis}
                          disabled={isAnalyzing}
                          className="organic-button-primary"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          {isAnalyzing ? 'Analyzing...' : 'Analyze Plant Health'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Camera className="h-16 w-16 text-emerald-400/60 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Upload Plant Image</h3>
                        <p className="text-gray-400 mb-4">Upload a clear photo of your plant for AI-powered health analysis</p>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="organic-button-primary"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-emerald-400 animate-pulse" />
                      <span className="text-white font-medium">AI Analysis in Progress...</span>
                    </div>
                    <Progress value={analysisProgress} className="w-full" />
                    <div className="text-sm text-gray-400">
                      {analysisProgress < 30 && 'Preprocessing image...'}
                      {analysisProgress >= 30 && analysisProgress < 60 && 'Detecting plant features...'}
                      {analysisProgress >= 60 && analysisProgress < 90 && 'Analyzing health indicators...'}
                      {analysisProgress >= 90 && 'Generating recommendations...'}
                    </div>
                  </motion.div>
                )}

                {/* Analysis Results */}
                {analysisResult && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Overall Health Score */}
                    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Overall Health Score</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {analysisResult.confidence}% Confidence
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Progress value={analysisResult.overallHealth} className="h-3" />
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">
                          {analysisResult.overallHealth}%
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-300">
                        Plant Species: {analysisResult.plantSpecies}
                      </div>
                    </div>

                    {/* Issues Detected */}
                    {analysisResult.issues.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">Issues Detected</h3>
                        {analysisResult.issues.map((issue: any, index: number) => (
                          <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {issue.type === 'disease' && <Bug className="h-4 w-4 text-red-400" />}
                                {issue.type === 'nutrient' && <Droplets className="h-4 w-4 text-yellow-400" />}
                                <span className="font-medium text-white">{issue.name}</span>
                              </div>
                              <Badge className={`bg-${issue.color}-500/20 text-${issue.color}-400 border-${issue.color}-500/30`}>
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{issue.treatment}</p>
                            <div className="text-xs text-gray-400">
                              Confidence: {issue.confidence}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysisResult.recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button className="organic-button-primary">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                      <Button className="organic-button-secondary">
                        <Share className="h-4 w-4 mr-2" />
                        Share Results
                      </Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Analyses */}
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <History className="h-5 w-5 text-emerald-400" />
                  <span>Recent Analyses</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="p-3 bg-gray-800/50 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white text-sm">{analysis.plantName}</span>
                        <span className="text-xs text-gray-400">{analysis.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300">{analysis.status}</span>
                        <span className="text-sm font-bold text-emerald-400">{analysis.health}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <span>Analysis Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">247</div>
                    <div className="text-xs text-emerald-300">Total Analyses</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <div className="text-lg font-bold text-blue-400">94%</div>
                      <div className="text-xs text-blue-300">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                      <div className="text-lg font-bold text-yellow-400">23</div>
                      <div className="text-xs text-yellow-300">Issues Found</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPlantHealthDiagnostics;