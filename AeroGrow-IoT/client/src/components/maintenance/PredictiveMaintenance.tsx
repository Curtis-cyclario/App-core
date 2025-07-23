import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Thermometer,
  Droplet,
  Lightbulb,
  WrenchIcon,
  ArrowUpRight,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';

// Define maintenance recommendation types
interface MaintenanceRecommendation {
  id: string;
  deviceId: number;
  deviceName: string;
  deviceType: string;
  maintenanceType: 'cleaning' | 'calibration' | 'replacement' | 'inspection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedAction: string;
  dueDate: string;
  createdAt: string;
  status: 'pending' | 'scheduled' | 'completed' | 'dismissed';
}

const PredictiveMaintenance: React.FC = () => {
  const [recommendations, setRecommendations] = useState<MaintenanceRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Simulated maintenance recommendations for demo purposes
  const simulatedRecommendations: MaintenanceRecommendation[] = [
    {
      id: 'rec-001',
      deviceId: 1,
      deviceName: 'Tower 3 Pump',
      deviceType: 'pump',
      maintenanceType: 'cleaning',
      severity: 'medium',
      description: 'Flow rate has decreased by 15% over the past week, indicating potential clogging.',
      suggestedAction: 'Clean filter and check for debris in water lines.',
      dueDate: '2025-05-15T00:00:00.000Z',
      createdAt: '2025-05-07T08:00:00.000Z',
      status: 'pending'
    },
    {
      id: 'rec-002',
      deviceId: 7,
      deviceName: 'Tower 7 pH Sensor',
      deviceType: 'sensor',
      maintenanceType: 'calibration',
      severity: 'high',
      description: 'pH readings becoming inconsistent, variance exceeding threshold.',
      suggestedAction: 'Calibrate pH sensor using standard solution.',
      dueDate: '2025-05-10T00:00:00.000Z',
      createdAt: '2025-05-06T14:30:00.000Z',
      status: 'scheduled'
    },
    {
      id: 'rec-003',
      deviceId: 4,
      deviceName: 'LED Panel B',
      deviceType: 'light',
      maintenanceType: 'replacement',
      severity: 'critical',
      description: 'Light output down to 68%, approaching end of service life.',
      suggestedAction: 'Replace LED panel within 48 hours.',
      dueDate: '2025-05-09T00:00:00.000Z',
      createdAt: '2025-05-05T11:15:00.000Z',
      status: 'pending'
    },
    {
      id: 'rec-004',
      deviceId: 12,
      deviceName: 'Water Reservoir',
      deviceType: 'reservoir',
      maintenanceType: 'inspection',
      severity: 'low',
      description: 'Routine inspection due based on maintenance schedule.',
      suggestedAction: 'Inspect for leaks and clean interior surfaces.',
      dueDate: '2025-05-20T00:00:00.000Z',
      createdAt: '2025-05-02T09:45:00.000Z',
      status: 'pending'
    },
    {
      id: 'rec-005',
      deviceId: 9,
      deviceName: 'Tower 2 Humidity Sensor',
      deviceType: 'sensor',
      maintenanceType: 'replacement',
      severity: 'medium',
      description: 'Humidity readings drifting compared to reference sensors.',
      suggestedAction: 'Replace humidity sensor with calibrated unit.',
      dueDate: '2025-05-12T00:00:00.000Z',
      createdAt: '2025-05-04T16:20:00.000Z',
      status: 'completed'
    }
  ];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        // In a real application, fetch from API
        // const response = await apiRequest('GET', '/api/maintenance/recommendations');
        // const data = await response.json();
        
        // For demo, use simulated data
        setTimeout(() => {
          setRecommendations(simulatedRecommendations);
          setLoading(false);
        }, 600);
      } catch (error) {
        console.error('Error fetching maintenance recommendations:', error);
        setError('Failed to fetch maintenance recommendations');
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Filter recommendations based on active filter
  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') return rec.severity === 'critical';
    if (activeFilter === 'pending') return rec.status === 'pending';
    if (activeFilter === 'completed') return rec.status === 'completed';
    return true;
  });

  // Handle updating recommendation status
  const updateStatus = async (id: string, newStatus: 'pending' | 'scheduled' | 'completed' | 'dismissed') => {
    try {
      // In real app, send to API
      // await apiRequest('PATCH', `/api/maintenance/recommendations/${id}`, { status: newStatus });
      
      // Update local state for demo
      setRecommendations(prevRecs => 
        prevRecs.map(rec => 
          rec.id === id ? { ...rec, status: newStatus } : rec
        )
      );
    } catch (error) {
      console.error('Error updating recommendation status:', error);
    }
  };

  // Get severity badge variant
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">{severity}</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600 text-xs">{severity}</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-xs">{severity}</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">{severity}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{severity}</Badge>;
    }
  };

  // Get device type icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'pump':
        return <Droplet className="h-5 w-5" />;
      case 'sensor':
        return <Thermometer className="h-5 w-5" />;
      case 'light':
        return <Lightbulb className="h-5 w-5" />;
      case 'reservoir':
        return <Droplet className="h-5 w-5 fill-blue-400" />;
      default:
        return <WrenchIcon className="h-5 w-5" />;
    }
  };

  // Get maintenance type icon
  const getMaintenanceIcon = (type: string) => {
    switch (type) {
      case 'cleaning':
        return <Droplet className="h-4 w-4" />;
      case 'calibration':
        return <RotateCcw className="h-4 w-4" />;
      case 'replacement':
        return <Zap className="h-4 w-4" />;
      case 'inspection':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <WrenchIcon className="h-4 w-4" />;
    }
  };

  // Calculate days until due
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-xs flex items-center"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-xs flex items-center bg-blue-50 text-blue-700 border-blue-300"><Calendar className="h-3 w-3 mr-1" /> Scheduled</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-xs flex items-center bg-green-50 text-green-700 border-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'dismissed':
        return <Badge variant="outline" className="text-xs flex items-center bg-gray-50 text-gray-700 border-gray-300"><X className="h-3 w-3 mr-1" /> Dismissed</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-md border border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Predictive Maintenance
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs px-2.5 py-1.5 ${activeFilter === 'all' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs px-2.5 py-1.5 ${activeFilter === 'critical' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              onClick={() => setActiveFilter('critical')}
            >
              Critical
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs px-2.5 py-1.5 ${activeFilter === 'pending' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              onClick={() => setActiveFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-xs px-2.5 py-1.5 ${activeFilter === 'completed' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          AI-powered maintenance alerts and recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading recommendations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        ) : filteredRecommendations.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-3" />
              <p className="text-center text-gray-500 dark:text-gray-400">All caught up! No maintenance tasks match your current filter.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <motion.div 
                key={rec.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${
                      rec.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                      rec.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      rec.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                      'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      {getDeviceIcon(rec.deviceType)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {rec.deviceName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getSeverityBadge(rec.severity)}
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          {getMaintenanceIcon(rec.maintenanceType)}
                          {rec.maintenanceType.charAt(0).toUpperCase() + rec.maintenanceType.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusDisplay(rec.status)}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Due in {getDaysUntilDue(rec.dueDate)} days
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {rec.description}
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-2 rounded text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-start">
                  <ArrowRight className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-amber-500" />
                  <span>{rec.suggestedAction}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>Created {new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {rec.status === 'pending' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => updateStatus(rec.id, 'scheduled')}
                        >
                          Schedule
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => updateStatus(rec.id, 'completed')}
                        >
                          Mark Complete
                        </Button>
                      </>
                    )}
                    {rec.status === 'scheduled' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => updateStatus(rec.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {rec.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => updateStatus(rec.id, 'pending')}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredRecommendations.length} of {recommendations.length} recommendations
          </p>
          <Button variant="link" size="sm" className="text-primary">
            View Maintenance History
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PredictiveMaintenance;