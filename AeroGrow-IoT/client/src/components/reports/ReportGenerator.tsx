import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Activity,
  Droplets,
  Thermometer,
  Lightbulb,
  Settings
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportConfig {
  type: 'system' | 'environmental' | 'production' | 'maintenance' | 'custom';
  format: 'pdf' | 'excel' | 'csv';
  dateRange: {
    from: Date;
    to: Date;
  };
  sections: {
    overview: boolean;
    metrics: boolean;
    trends: boolean;
    alerts: boolean;
    recommendations: boolean;
  };
  facilities: string[];
}

const ReportGenerator = () => {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'system',
    format: 'pdf',
    dateRange: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      to: new Date()
    },
    sections: {
      overview: true,
      metrics: true,
      trends: true,
      alerts: false,
      recommendations: true
    },
    facilities: ['all']
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'system', label: 'System Performance', icon: Activity },
    { value: 'environmental', label: 'Environmental Conditions', icon: Thermometer },
    { value: 'production', label: 'Production Analytics', icon: TrendingUp },
    { value: 'maintenance', label: 'Maintenance Report', icon: Settings },
    { value: 'custom', label: 'Custom Report', icon: BarChart3 }
  ];

  const fetchRealData = async () => {
    try {
      const [sensorResponse, notificationsResponse, devicesResponse] = await Promise.all([
        fetch('/api/sensor-data/history?hours=168'), // 7 days
        fetch('/api/notifications'),
        fetch('/api/devices')
      ]);

      const sensorData = await sensorResponse.json();
      const notifications = await notificationsResponse.json();
      const devices = await devicesResponse.json();

      return { sensorData, notifications, devices };
    } catch (error) {
      console.error('Error fetching real data:', error);
      throw new Error('Failed to fetch report data');
    }
  };

  const generatePDFReport = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Fetch real data
    const realData = await fetchRealData();
    
    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(16, 185, 129);
    pdf.text('The HQ - Agricultural Intelligence Platform', 20, 30);
    
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${reportTypes.find(t => t.value === config.type)?.label} Report`, 20, 45);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55);
    pdf.text(`Period: ${config.dateRange.from.toLocaleDateString()} - ${config.dateRange.to.toLocaleDateString()}`, 20, 65);

    let currentY = 85;

    // Executive Summary with real data
    if (config.sections.overview && realData) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Executive Summary', 20, currentY);
      currentY += 15;
      
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      
      const deviceCount = realData.devices?.length || 0;
      const alertCount = realData.notifications?.filter((n: any) => !n.isRead)?.length || 0;
      const latestSensor = realData.sensorData?.[0] || {};
      
      const summaryText = [
        `System Status: ${deviceCount} devices monitored across facilities`,
        `Current Temperature: ${latestSensor.temperature || 'N/A'}°C, Humidity: ${latestSensor.humidity || 'N/A'}%`,
        `Active Alerts: ${alertCount} notifications requiring attention`,
        `Data Collection: ${realData.sensorData?.length || 0} sensor readings in period`
      ];
      
      summaryText.forEach(text => {
        pdf.text(`• ${text}`, 25, currentY);
        currentY += 10;
      });
      currentY += 10;
    }

    // Key Metrics Table with real data
    if (config.sections.metrics && realData) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Key Performance Metrics', 20, currentY);
      currentY += 15;

      const latestSensor = realData.sensorData?.[0] || {};
      const tableData = [
        ['Metric', 'Current Value', 'Status', 'Last Updated'],
        ['Temperature', `${latestSensor.temperature || '--'}°C`, 'Normal', new Date(latestSensor.timestamp || Date.now()).toLocaleString()],
        ['Humidity', `${latestSensor.humidity || '--'}%`, 'Normal', new Date(latestSensor.timestamp || Date.now()).toLocaleString()],
        ['Light Level', `${latestSensor.lightLevel || '--'} lux`, 'Normal', new Date(latestSensor.timestamp || Date.now()).toLocaleString()],
        ['Water Level', `${latestSensor.waterLevel || '--'}%`, 'Normal', new Date(latestSensor.timestamp || Date.now()).toLocaleString()],
        ['pH Level', `${latestSensor.phLevel || '--'}`, 'Normal', new Date(latestSensor.timestamp || Date.now()).toLocaleString()]
      ];

      (pdf as any).autoTable({
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: currentY,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [16, 185, 129] }
      });

      currentY = (pdf as any).lastAutoTable.finalY + 20;
    }

    // Alerts and Notifications with real data
    if (config.sections.alerts && realData?.notifications) {
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Recent Alerts', 20, currentY);
      currentY += 15;
      
      const recentAlerts = realData.notifications.slice(0, 5);
      const alertTableData = [
        ['Type', 'Message', 'Timestamp', 'Status'],
        ...recentAlerts.map((alert: any) => [
          alert.type || 'System',
          alert.message || alert.title || 'Alert notification',
          new Date(alert.timestamp).toLocaleString(),
          alert.isRead ? 'Read' : 'Unread'
        ])
      ];

      (pdf as any).autoTable({
        head: [alertTableData[0]],
        body: alertTableData.slice(1),
        startY: currentY,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [245, 158, 11] }
      });

      currentY = (pdf as any).lastAutoTable.finalY + 20;
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated by The HQ Agricultural Intelligence Platform', 20, pdf.internal.pageSize.getHeight() - 20);
    
    return pdf;
  };

  const generateExcelReport = async () => {
    const realData = await fetchRealData();
    
    const csvData = [
      ['The HQ - Agricultural Intelligence Platform'],
      [`${reportTypes.find(t => t.value === config.type)?.label} Report`],
      [`Generated: ${new Date().toLocaleDateString()}`],
      [`Period: ${config.dateRange.from.toLocaleDateString()} - ${config.dateRange.to.toLocaleDateString()}`],
      [''],
      ['Sensor Data Summary'],
      ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Light Level (lux)', 'Water Level (%)', 'pH Level']
    ];

    if (realData?.sensorData) {
      realData.sensorData.slice(0, 100).forEach((reading: any) => {
        csvData.push([
          new Date(reading.timestamp).toLocaleString(),
          reading.temperature?.toString() || '',
          reading.humidity?.toString() || '',
          reading.lightLevel?.toString() || '',
          reading.waterLevel?.toString() || '',
          reading.phLevel?.toString() || ''
        ]);
      });
    }

    csvData.push([''], ['Device Status']);
    csvData.push(['Device Name', 'Type', 'Status', 'Last Updated']);
    
    if (realData?.devices) {
      realData.devices.forEach((device: any) => {
        csvData.push([
          device.name || '',
          device.type || '',
          device.status || '',
          new Date(device.updatedAt || Date.now()).toLocaleString()
        ]);
      });
    }

    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    return csvContent;
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      let content: any;
      let filename: string;
      let mimeType: string;

      switch (config.format) {
        case 'pdf':
          content = await generatePDFReport();
          filename = `agricultural-report-${Date.now()}.pdf`;
          content.save(filename);
          setIsGenerating(false);
          return;

        case 'excel':
          content = await generateExcelReport();
          filename = `agricultural-report-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;

        default:
          content = await generateExcelReport();
          filename = `agricultural-report-${Date.now()}.csv`;
          mimeType = 'text/csv';
      }

      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="organic-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <FileText className="h-5 w-5 text-emerald-400" />
            <span>Report Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-200">Report Type</label>
            <Select value={config.type} onValueChange={(value: any) => setConfig(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-gray-800/50 border-emerald-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-emerald-500/20">
                {reportTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value} className="text-white hover:bg-emerald-500/10">
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4 text-emerald-400" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-200">Export Format</label>
            <Select value={config.format} onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}>
              <SelectTrigger className="bg-gray-800/50 border-emerald-500/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-emerald-500/20">
                <SelectItem value="pdf" className="text-white hover:bg-emerald-500/10">PDF Document</SelectItem>
                <SelectItem value="excel" className="text-white hover:bg-emerald-500/10">Excel/CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Report Sections */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-200">Include Sections</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(config.sections).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({
                        ...prev,
                        sections: { ...prev.sections, [key]: checked as boolean }
                      }))
                    }
                    className="border-emerald-500/30 data-[state=checked]:bg-emerald-500"
                  />
                  <label htmlFor={key} className="text-sm text-white capitalize cursor-pointer">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button 
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="organic-button-primary w-full"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Report...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Generate Report</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportGenerator;