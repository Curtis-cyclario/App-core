import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Leaf, 
  Zap,
  Database,
  Clock,
  Filter,
  Search,
  Eye,
  FileBarChart,
  Grid3X3,
  List,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Plus
} from 'lucide-react';
import AdvancedReportGenerator from '@/components/reports/AdvancedReportGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  title: string;
  type: 'system' | 'environmental' | 'production' | 'analytics' | 'maintenance';
  date: string;
  size: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'JSON';
  status: 'ready' | 'generating' | 'error';
  description: string;
  tags: string[];
  downloadCount: number;
}

const Reports: React.FC = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const reports: Report[] = [
    {
      id: '1',
      title: 'Weekly System Performance',
      type: 'system',
      date: '2025-06-08',
      size: '2.3 MB',
      format: 'PDF',
      status: 'ready',
      description: 'Comprehensive system health and performance metrics analysis',
      tags: ['Performance', 'System Health', 'Weekly'],
      downloadCount: 47
    },
    {
      id: '2',
      title: 'Environmental Conditions Analysis',
      type: 'environmental',
      date: '2025-06-05',
      size: '1.8 MB',
      format: 'Excel',
      status: 'ready',
      description: 'Temperature, humidity, and air quality tracking report',
      tags: ['Environment', 'Climate', 'Sensors'],
      downloadCount: 32
    },
    {
      id: '3',
      title: 'Monthly Production Summary',
      type: 'production',
      date: '2025-06-03',
      size: '3.1 MB',
      format: 'PDF',
      status: 'ready',
      description: 'Crop yield, growth rates, and harvest optimization data',
      tags: ['Production', 'Yield', 'Monthly'],
      downloadCount: 89
    },
    {
      id: '4',
      title: 'Predictive Analytics Dashboard',
      type: 'analytics',
      date: '2025-06-07',
      size: '4.2 MB',
      format: 'JSON',
      status: 'generating',
      description: 'AI-powered insights and future trend predictions',
      tags: ['AI', 'Predictions', 'Analytics'],
      downloadCount: 15
    },
    {
      id: '5',
      title: 'Maintenance Schedule Report',
      type: 'maintenance',
      date: '2025-06-06',
      size: '1.5 MB',
      format: 'CSV',
      status: 'ready',
      description: 'Equipment maintenance logs and scheduling optimization',
      tags: ['Maintenance', 'Equipment', 'Schedule'],
      downloadCount: 23
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Activity className="w-5 h-5" />;
      case 'environmental': return <Leaf className="w-5 h-5" />;
      case 'production': return <BarChart3 className="w-5 h-5" />;
      case 'analytics': return <TrendingUp className="w-5 h-5" />;
      case 'maintenance': return <Zap className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'generating': return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleDownload = (reportId: string) => {
    toast({
      title: "Downloading Report",
      description: `Report ${reportId} download initiated`,
    });
  };

  const handleView = (reportId: string) => {
    toast({
      title: "Opening Report",
      description: `Report ${reportId} viewer launched`,
    });
  };

  const handleBulkDownload = () => {
    if (selectedReports.length === 0) {
      toast({
        title: "No Reports Selected",
        description: "Please select reports to download",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Bulk Download Started",
      description: `Downloading ${selectedReports.length} reports`,
    });
  };

  const generateNewReport = (type: string) => {
    toast({
      title: "Report Generation Started",
      description: `Generating new ${type} report`,
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Technical Reports</h1>
          <p className="text-slate-300">Generate, view, and export comprehensive system reports</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleBulkDownload}
            disabled={selectedReports.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Bulk Download ({selectedReports.length})
          </Button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          { type: 'system', label: 'System Report', icon: Activity, color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
          { type: 'environmental', label: 'Environment', icon: Leaf, color: 'from-green-500/20 to-emerald-500/20 border-green-500/30' },
          { type: 'production', label: 'Production', icon: BarChart3, color: 'from-orange-500/20 to-red-500/20 border-orange-500/30' },
          { type: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30' },
          { type: 'maintenance', label: 'Maintenance', icon: Zap, color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30' }
        ].map((item, index) => (
          <motion.div
            key={item.type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card 
              className={`bg-gradient-to-br ${item.color} border cursor-pointer hover:scale-105 transition-transform duration-200`}
              onClick={() => generateNewReport(item.type)}
            >
              <CardContent className="p-4 text-center">
                <item.icon className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white font-medium text-sm">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-slate-800/50 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="environmental">Environmental</SelectItem>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="text-white border-slate-600"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="text-white border-slate-600"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Reports */}
      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="bg-slate-800/50 border-slate-600">
          <TabsTrigger value="generator" className="text-white">
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-white">Recent Reports</TabsTrigger>
          <TabsTrigger value="scheduled" className="text-white">Scheduled</TabsTrigger>
          <TabsTrigger value="analytics" className="text-white">Report Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <AdvancedReportGenerator />
        </TabsContent>

        <TabsContent value="recent">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card className="bg-slate-800/30 border-slate-600 hover:bg-slate-800/50 transition-colors duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-emerald-400 mt-1">
                            {getTypeIcon(report.type)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-white text-lg">{report.title}</CardTitle>
                            <CardDescription className="text-slate-300 mt-1">
                              {report.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(report.status)}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-1">
                          {report.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-slate-400">
                          <span>{report.date}</span>
                          <span>{report.size} • {report.format}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">{report.downloadCount} downloads</span>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleView(report.id)}
                              className="text-white border-slate-600 hover:bg-slate-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleDownload(report.id)}
                              disabled={report.status !== 'ready'}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                >
                  <Card className="bg-slate-800/30 border-slate-600 hover:bg-slate-800/50 transition-colors duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="text-emerald-400">
                            {getTypeIcon(report.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium">{report.title}</h3>
                            <p className="text-slate-400 text-sm">{report.description}</p>
                          </div>
                          <div className="hidden md:flex items-center space-x-4 text-sm text-slate-400">
                            <span>{report.date}</span>
                            <span>{report.size}</span>
                            <Badge variant="outline" className="text-slate-300 border-slate-600">
                              {report.format}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {getStatusIcon(report.status)}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleView(report.id)}
                            className="text-white border-slate-600 hover:bg-slate-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleDownload(report.id)}
                            disabled={report.status !== 'ready'}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="bg-slate-800/30 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Scheduled Reports</CardTitle>
              <CardDescription className="text-slate-300">
                Automated report generation schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Daily System Health', time: '06:00 AM', next: 'Tomorrow' },
                  { name: 'Weekly Performance', time: 'Monday 09:00 AM', next: 'In 2 days' },
                  { name: 'Monthly Analytics', time: '1st of month', next: 'In 25 days' },
                  { name: 'Quarterly Review', time: 'Quarter end', next: 'In 89 days' }
                ].map((schedule, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                    <h4 className="text-white font-medium mb-2">{schedule.name}</h4>
                    <p className="text-slate-400 text-sm mb-1">Runs: {schedule.time}</p>
                    <p className="text-emerald-400 text-sm">Next: {schedule.next}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Reports', value: '147', icon: FileBarChart, color: 'text-blue-400' },
              { title: 'This Month', value: '23', icon: Calendar, color: 'text-emerald-400' },
              { title: 'Data Size', value: '8.2GB', icon: Database, color: 'text-purple-400' },
              { title: 'Scheduled', value: '5', icon: Clock, color: 'text-orange-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="bg-slate-800/30 border-slate-600">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-400 text-sm">{stat.title}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;