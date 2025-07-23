import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, BarChart, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useSensorData } from '@/hooks/useSensorData';

interface ReportsProps {
  title?: string;
}

const Reports: React.FC<ReportsProps> = ({ title = 'Reports' }) => {
  const { sensorData } = useSensorData();
  const [generating, setGenerating] = useState(false);

  // Function to export data to PDF
  const exportToPDF = async () => {
    setGenerating(true);
    
    try {
      // Create new PDF document with orientation: portrait, unit: mm, format: a4
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      doc.setFontSize(20);
      doc.text("VertiGroIoT System Report", 14, 22);
      
      // Add generation date
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
      
      // Add system overview
      doc.setFontSize(16);
      doc.text("System Overview", 14, 45);
      
      try {
        // Use autoTable plugin
        (doc as any).autoTable({
          startY: 50,
          head: [['Metric', 'Value', 'Status']],
          body: [
            ['Temperature', `${sensorData?.temperature || '--'}°C`, 'Normal'],
            ['Humidity', `${sensorData?.humidity || '--'}%`, 'Normal'],
            ['Water Level', `${sensorData?.waterLevel || '--'}%`, 'Normal'],
            ['Nutrient Level', `${sensorData?.nutrientLevel || '--'}%`, 'Normal'],
            ['Pump Status', sensorData?.pumpStatus === 'active' ? 'Active' : 'Inactive', 'Normal'],
            ['Light Status', sensorData?.lightStatus === 'on' ? 'On' : 'Off', 'Normal'],
            ['Water Reservoir', `${sensorData?.reservoirLevel || '--'} L`, sensorData?.reservoirLevel && parseFloat(sensorData.reservoirLevel) < 200 ? 'Warning' : 'Normal'],
            ['Water Flow Rate', `${sensorData?.waterFlowRate || '--'} L/min`, 'Normal'],
          ],
        });
      } catch (tableError) {
        console.error('Error creating table:', tableError);
        // If autoTable fails, add a simple text message instead
        doc.text('Could not generate table data. See system for details.', 14, 65);
      }
      
      // Add maintenance recommendations
      doc.setFontSize(16);
      doc.text("Maintenance Recommendations", 14, 130);
      
      // @ts-ignore - jspdf-autotable types
      doc.autoTable({
        startY: 135,
        head: [['Component', 'Recommendation', 'Priority']],
        body: [
          ['Water Reservoir', 'Refill water within 3 days', 'Medium'],
          ['Nutrient Solution', 'Replace within 7 days', 'Low'],
          ['Growth Lights', 'Check for optimal spectrum', 'Low'],
          ['Air Filters', 'Clean or replace within 30 days', 'Low'],
        ],
      });
      
      // Add footer with company information
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          "VertiGroIoT by Cyclerio - Confidential",
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save("VertiGroIoT-Report.pdf");
    } catch (error) {
      console.error('Error generating PDF report:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border-t border-gray-200 dark:border-dark-600 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="relative rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
              <div className="flex-shrink-0">
                <AreaChart className="h-10 w-10 text-primary-500 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <a href="#" className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">System Performance</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Device performance metrics</p>
                </a>
              </div>
            </div>

            <div className="relative rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
              <div className="flex-shrink-0">
                <BarChart className="h-10 w-10 text-primary-500 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <a href="#" className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Growth Analytics</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Plant growth statistics</p>
                </a>
              </div>
            </div>

            <div className="relative rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
              <div className="flex-shrink-0">
                <FileText className="h-10 w-10 text-primary-500 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <a href="#" className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Maintenance Log</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">System maintenance history</p>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={exportToPDF}
              disabled={generating}
              className="inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {generating ? 'Generating...' : 'Export to PDF'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;
