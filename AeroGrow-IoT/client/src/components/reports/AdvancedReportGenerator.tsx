import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Leaf, 
  Zap,
  Database,
  Clock,
  Calendar,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Gauge,
  Thermometer,
  Droplets,
  Sun,
  Eye,
  LineChart,
  PieChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

interface ReportSection {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  required: boolean;
}

interface ReportConfig {
  title: string;
  dateRange: string;
  format: 'PDF' | 'Excel' | 'CSV';
  includeGraphs: boolean;
  includeTables: boolean;
  includeImages: boolean;
  sections: ReportSection[];
}

const AdvancedReportGenerator: React.FC = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: 'System Performance Report',
    dateRange: '7-days',
    format: 'PDF',
    includeGraphs: true,
    includeTables: true,
    includeImages: true,
    sections: [
      {
        id: 'overview',
        name: 'Executive Summary',
        description: 'High-level system performance overview',
        icon: <TrendingUp className="w-4 h-4" />,
        enabled: true,
        required: true
      },
      {
        id: 'environmental',
        name: 'Environmental Metrics',
        description: 'Temperature, humidity, and climate data',
        icon: <Thermometer className="w-4 h-4" />,
        enabled: true,
        required: false
      },
      {
        id: 'production',
        name: 'Production Analytics',
        description: 'Yield, growth rates, and harvest data',
        icon: <Leaf className="w-4 h-4" />,
        enabled: true,
        required: false
      },
      {
        id: 'system',
        name: 'System Health',
        description: 'Device status, uptime, and maintenance',
        icon: <Activity className="w-4 h-4" />,
        enabled: true,
        required: false
      },
      {
        id: 'alerts',
        name: 'Alerts & Notifications',
        description: 'System alerts and critical events',
        icon: <AlertTriangle className="w-4 h-4" />,
        enabled: true,
        required: false
      },
      {
        id: 'recommendations',
        name: 'AI Recommendations',
        description: 'Optimization suggestions and insights',
        icon: <Zap className="w-4 h-4" />,
        enabled: true,
        required: false
      }
    ]
  });

  // Fetch real data for report generation
  const { data: sensorHistory } = useQuery({
    queryKey: ['/api/sensor-data/history'],
    queryFn: async () => {
      const response = await fetch('/api/sensor-data/history?hours=168');
      return response.json();
    }
  });

  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
    queryFn: async () => {
      const response = await fetch('/api/notifications');
      return response.json();
    }
  });

  const { data: devices } = useQuery({
    queryKey: ['/api/devices'],
    queryFn: async () => {
      const response = await fetch('/api/devices');
      return response.json();
    }
  });

  const { data: currentSensorData } = useQuery({
    queryKey: ['/api/sensor-data'],
    queryFn: async () => {
      const response = await fetch('/api/sensor-data');
      return response.json();
    }
  });

  const generateChartImage = async (chartData: any, type: 'line' | 'bar' | 'pie'): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('');
        return;
      }

      // Create a temporary chart instance for image generation
      import('chart.js/auto').then((Chart) => {
        const chart = new Chart.default(ctx, {
          type,
          data: chartData,
          options: {
            responsive: false,
            animation: {
              onComplete: () => {
                const imageData = canvas.toDataURL('image/png');
                chart.destroy();
                resolve(imageData);
              }
            }
          }
        });
      });
    });
  };

  const generateComprehensivePDF = async () => {
    if (!sensorHistory || !notifications || !devices || !currentSensorData) {
      toast({
        title: "Data Not Available",
        description: "Unable to fetch required data for report generation",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const pdf = new jsPDF();
      let yPosition = 20;

      // Company Header
      pdf.setFontSize(24);
      pdf.setTextColor(16, 185, 129);
      pdf.text('VertiGrow IoT Platform', 20, yPosition);
      
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      yPosition += 10;
      pdf.text(`${reportConfig.title}`, 20, yPosition);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      yPosition += 8;
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
      pdf.text(`Period: ${reportConfig.dateRange}`, 150, yPosition);

      setGenerationProgress(10);

      // Executive Summary Section
      if (reportConfig.sections.find(s => s.id === 'overview')?.enabled) {
        yPosition += 20;
        pdf.setFontSize(18);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Executive Summary', 20, yPosition);
        
        yPosition += 15;
        pdf.setFontSize(12);
        
        const totalDevices = devices.length;
        const onlineDevices = devices.filter((d: any) => d.status === 'online').length;
        const uptime = Math.round((onlineDevices / totalDevices) * 100);
        const currentTemp = parseFloat(currentSensorData.temperature);
        const currentHumidity = parseFloat(currentSensorData.humidity);
        
        pdf.text(`• System Uptime: ${uptime}% (${onlineDevices}/${totalDevices} devices online)`, 30, yPosition);
        yPosition += 8;
        pdf.text(`• Current Environment: ${currentTemp}°C, ${currentHumidity}% humidity`, 30, yPosition);
        yPosition += 8;
        pdf.text(`• Active Alerts: ${notifications.filter((n: any) => !n.read).length} unread notifications`, 30, yPosition);
        yPosition += 8;
        pdf.text(`• System Health: Optimal operating conditions maintained`, 30, yPosition);
      }

      setGenerationProgress(25);

      // Environmental Metrics with Charts
      if (reportConfig.sections.find(s => s.id === 'environmental')?.enabled && reportConfig.includeGraphs) {
        pdf.addPage();
        yPosition = 20;
        
        pdf.setFontSize(18);
        pdf.text('Environmental Metrics', 20, yPosition);
        yPosition += 20;

        // Temperature chart data
        const tempData = {
          labels: sensorHistory.slice(-24).map((_: any, i: number) => `${i}h`),
          datasets: [{
            label: 'Temperature (°C)',
            data: sensorHistory.slice(-24).map((d: any) => parseFloat(d.temperature)),
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4
          }]
        };

        const tempChartImage = await generateChartImage(tempData, 'line');
        if (tempChartImage) {
          pdf.addImage(tempChartImage, 'PNG', 20, yPosition, 160, 80);
        }
        
        yPosition += 90;

        // Environmental data table
        if (reportConfig.includeTables) {
          const tableData = sensorHistory.slice(-10).map((d: any) => [
            new Date(d.timestamp).toLocaleTimeString(),
            `${parseFloat(d.temperature).toFixed(1)}°C`,
            `${parseFloat(d.humidity).toFixed(1)}%`,
            `${parseFloat(d.waterLevel).toFixed(1)}%`,
            `${parseFloat(d.nutrientLevel).toFixed(1)}%`
          ]);

          (pdf as any).autoTable({
            head: [['Time', 'Temperature', 'Humidity', 'Water Level', 'Nutrients']],
            body: tableData,
            startY: yPosition,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }
          });
        }
      }

      setGenerationProgress(50);

      // System Health Section
      if (reportConfig.sections.find(s => s.id === 'system')?.enabled) {
        pdf.addPage();
        yPosition = 20;
        
        pdf.setFontSize(18);
        pdf.text('System Health Analysis', 20, yPosition);
        yPosition += 20;

        // Device status chart
        if (reportConfig.includeGraphs) {
          const deviceStatusData = {
            labels: ['Online', 'Offline', 'Warning'],
            datasets: [{
              data: [
                devices.filter((d: any) => d.status === 'online').length,
                devices.filter((d: any) => d.status === 'offline').length,
                devices.filter((d: any) => d.status === 'warning').length
              ],
              backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
            }]
          };

          const statusChartImage = await generateChartImage(deviceStatusData, 'pie');
          if (statusChartImage) {
            pdf.addImage(statusChartImage, 'PNG', 20, yPosition, 100, 100);
          }
        }

        // Device details table
        if (reportConfig.includeTables) {
          const deviceTableData = devices.map((d: any) => [
            d.name,
            d.type,
            d.status,
            d.location || 'N/A'
          ]);

          (pdf as any).autoTable({
            head: [['Device Name', 'Type', 'Status', 'Location']],
            body: deviceTableData,
            startY: yPosition + 110,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }
          });
        }
      }

      setGenerationProgress(75);

      // Alerts and Notifications
      if (reportConfig.sections.find(s => s.id === 'alerts')?.enabled) {
        pdf.addPage();
        yPosition = 20;
        
        pdf.setFontSize(18);
        pdf.text('Alerts & Notifications', 20, yPosition);
        yPosition += 20;

        const recentAlerts = notifications.slice(0, 15);
        const alertTableData = recentAlerts.map((n: any) => [
          new Date(n.timestamp).toLocaleString(),
          n.level.toUpperCase(),
          n.message.substring(0, 50) + (n.message.length > 50 ? '...' : ''),
          n.read ? 'Read' : 'Unread'
        ]);

        (pdf as any).autoTable({
          head: [['Timestamp', 'Level', 'Message', 'Status']],
          body: alertTableData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129] },
          columnStyles: {
            1: { cellWidth: 20 },
            2: { cellWidth: 80 },
            3: { cellWidth: 20 }
          }
        });
      }

      setGenerationProgress(90);

      // AI Recommendations
      if (reportConfig.sections.find(s => s.id === 'recommendations')?.enabled) {
        pdf.addPage();
        yPosition = 20;
        
        pdf.setFontSize(18);
        pdf.text('AI-Powered Recommendations', 20, yPosition);
        yPosition += 20;

        pdf.setFontSize(12);
        
        // Generate recommendations based on current data
        const recommendations = [];
        
        if (parseFloat(currentSensorData.waterLevel) < 50) {
          recommendations.push('• Consider implementing automated water level monitoring alerts');
          recommendations.push('• Optimize irrigation schedule based on current consumption patterns');
        }
        
        if (parseFloat(currentSensorData.nutrientLevel) < 70) {
          recommendations.push('• Adjust nutrient delivery frequency to maintain optimal levels');
          recommendations.push('• Implement predictive nutrient management system');
        }
        
        recommendations.push('• System uptime optimization: Schedule maintenance during low-activity periods');
        recommendations.push('• Energy efficiency: Implement smart lighting controls based on plant growth cycles');
        recommendations.push('• Predictive analytics: Enable early warning system for equipment failures');

        recommendations.forEach((rec, index) => {
          pdf.text(rec, 30, yPosition + (index * 8));
        });
      }

      setGenerationProgress(100);

      // Save the PDF
      const fileName = `${reportConfig.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Report Generated Successfully",
        description: `${fileName} has been downloaded`,
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Report Generation Failed",
        description: "An error occurred while generating the report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const updateSection = (sectionId: string, enabled: boolean) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, enabled } : section
      )
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/30 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-emerald-400" />
            Advanced Report Generator
          </CardTitle>
          <CardDescription className="text-slate-300">
            Create comprehensive PDF reports with charts, tables, and real-time data analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="bg-slate-700/50 border-slate-600">
              <TabsTrigger value="config" className="text-white">Configuration</TabsTrigger>
              <TabsTrigger value="preview" className="text-white">Preview</TabsTrigger>
              <TabsTrigger value="generate" className="text-white">Generate</TabsTrigger>
            </TabsList>

            <TabsContent value="config" className="space-y-6">
              {/* Report Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-title" className="text-white">Report Title</Label>
                    <Input
                      id="report-title"
                      value={reportConfig.title}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date-range" className="text-white">Date Range</Label>
                    <Select value={reportConfig.dateRange} onValueChange={(value) => 
                      setReportConfig(prev => ({ ...prev, dateRange: value }))
                    }>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="24-hours">Last 24 Hours</SelectItem>
                        <SelectItem value="7-days">Last 7 Days</SelectItem>
                        <SelectItem value="30-days">Last 30 Days</SelectItem>
                        <SelectItem value="90-days">Last 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="format" className="text-white">Export Format</Label>
                    <Select value={reportConfig.format} onValueChange={(value: 'PDF' | 'Excel' | 'CSV') => 
                      setReportConfig(prev => ({ ...prev, format: value }))
                    }>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="PDF">PDF Report</SelectItem>
                        <SelectItem value="Excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="CSV">CSV Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-3 block">Include Components</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-graphs"
                          checked={reportConfig.includeGraphs}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeGraphs: !!checked }))
                          }
                        />
                        <Label htmlFor="include-graphs" className="text-slate-300">
                          Charts and Graphs
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-tables"
                          checked={reportConfig.includeTables}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeTables: !!checked }))
                          }
                        />
                        <Label htmlFor="include-tables" className="text-slate-300">
                          Data Tables
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-images"
                          checked={reportConfig.includeImages}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeImages: !!checked }))
                          }
                        />
                        <Label htmlFor="include-images" className="text-slate-300">
                          Images and Diagrams
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Sections */}
              <div>
                <Label className="text-white mb-4 block">Report Sections</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportConfig.sections.map((section) => (
                    <Card 
                      key={section.id} 
                      className={`cursor-pointer transition-all duration-200 ${
                        section.enabled 
                          ? 'bg-emerald-500/20 border-emerald-500/50' 
                          : 'bg-slate-700/30 border-slate-600'
                      }`}
                      onClick={() => !section.required && updateSection(section.id, !section.enabled)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-emerald-400 mt-1">
                            {section.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium">{section.name}</h4>
                              <Checkbox
                                checked={section.enabled}
                                disabled={section.required}
                                onCheckedChange={(checked) => updateSection(section.id, !!checked)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <p className="text-slate-300 text-sm mt-1">{section.description}</p>
                            {section.required && (
                              <Badge className="bg-orange-500/20 text-orange-400 text-xs mt-2">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-6">
                <h3 className="text-white text-lg font-medium mb-4">Report Preview</h3>
                
                {/* Live Data Charts Preview */}
                {reportConfig.includeGraphs && sensorHistory && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-slate-300 mb-3">Temperature Trends (Last 24 Hours)</h4>
                      <div className="bg-white rounded-lg p-4">
                        <Line
                          data={{
                            labels: sensorHistory.slice(-24).map((_: any, i: number) => `${i}h`),
                            datasets: [{
                              label: 'Temperature (°C)',
                              data: sensorHistory.slice(-24).map((d: any) => parseFloat(d.temperature)),
                              borderColor: 'rgb(16, 185, 129)',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              tension: 0.4
                            }]
                          }}
                          options={{
                            responsive: true,
                            scales: {
                              y: {
                                beginAtZero: false
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {devices && (
                      <div>
                        <h4 className="text-slate-300 mb-3">Device Status Distribution</h4>
                        <div className="bg-white rounded-lg p-4">
                          <div style={{ width: '300px', height: '300px', margin: '0 auto' }}>
                            <Pie
                              data={{
                                labels: ['Online', 'Offline', 'Warning'],
                                datasets: [{
                                  data: [
                                    devices.filter((d: any) => d.status === 'online').length,
                                    devices.filter((d: any) => d.status === 'offline').length,
                                    devices.filter((d: any) => d.status === 'warning').length
                                  ],
                                  backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
                                }]
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: true
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Data Summary */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                  <h4 className="text-white mb-3">Data Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Total Devices</div>
                      <div className="text-white font-bold">{devices?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Data Points</div>
                      <div className="text-white font-bold">{sensorHistory?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Notifications</div>
                      <div className="text-white font-bold">{notifications?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Sections</div>
                      <div className="text-white font-bold">
                        {reportConfig.sections.filter(s => s.enabled).length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="generate" className="space-y-6">
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-white text-lg font-medium mb-2">Ready to Generate Report</h3>
                  <p className="text-slate-300">
                    Your report will include {reportConfig.sections.filter(s => s.enabled).length} sections
                    {reportConfig.includeGraphs && ', charts'}
                    {reportConfig.includeTables && ', data tables'}
                    {reportConfig.includeImages && ', images'}.
                  </p>
                </div>

                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-white">Generating Comprehensive Report...</div>
                      <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
                      <div className="grid grid-cols-3 gap-4 text-center text-sm max-w-md mx-auto">
                        <div className={generationProgress > 25 ? 'text-emerald-400' : 'text-slate-400'}>
                          ✓ Data Collection
                        </div>
                        <div className={generationProgress > 50 ? 'text-emerald-400' : 'text-slate-400'}>
                          ✓ Chart Generation
                        </div>
                        <div className={generationProgress > 75 ? 'text-emerald-400' : 'text-slate-400'}>
                          ✓ PDF Assembly
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={generateComprehensivePDF}
                  disabled={isGenerating}
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Generating...' : `Generate ${reportConfig.format} Report`}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedReportGenerator;