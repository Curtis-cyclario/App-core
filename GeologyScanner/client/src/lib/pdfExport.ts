import { formatDate, formatCoordinates } from './utils';
import { type Mineral, type MlAnalysis, type Scan } from '@shared/schema';

interface ExportOptions {
  includeMineralDetails?: boolean;
  includeLocation?: boolean;
  includeAnalysis?: boolean;
  includeTimestamp?: boolean;
  title?: string;
  customText?: string;
}

/**
 * Generate PDF content for export from a scan and its analysis
 * 
 * Note: This is a mock implementation as we don't want to include a full PDF library
 * In a real implementation, you would use a library like jsPDF, PDFMake, or similar
 * 
 * @param scan The scan data
 * @param analysis The ML analysis data
 * @param minerals The detected minerals
 * @param options Export customization options
 */
export function generateScanPdf(
  scan: Scan,
  analysis?: MlAnalysis,
  minerals?: Mineral[],
  options: ExportOptions = {}
): Blob {
  // In a real implementation, this would create a PDF
  // Here we'll just return a text representation as a blob
  
  const {
    includeMineralDetails = true,
    includeLocation = true,
    includeAnalysis = true,
    includeTimestamp = true,
    title = 'Geological Scan Report',
    customText = ''
  } = options;
  
  let content = `# ${title}\n\n`;
  
  if (includeTimestamp) {
    content += `Report generated on ${formatDate(new Date())}\n\n`;
  }
  
  if (customText) {
    content += `${customText}\n\n`;
  }
  
  content += `## Scan Information\n`;
  content += `Name: ${scan.name}\n`;
  content += `Description: ${scan.description || 'N/A'}\n`;
  content += `Confidence: ${(scan.confidence * 100).toFixed(1)}%\n`;
  content += `Date: ${formatDate(scan.timestamp)}\n`;
  
  if (includeLocation && scan.latitude && scan.longitude) {
    content += `\n## Location\n`;
    content += `Coordinates: ${formatCoordinates(scan.latitude, scan.longitude)}\n`;
    content += `Location Name: ${scan.location || 'Not specified'}\n`;
  }
  
  if (includeMineralDetails && minerals && minerals.length > 0) {
    content += `\n## Detected Minerals\n`;
    minerals.forEach((mineral, index) => {
      content += `\n### ${index + 1}. ${mineral.name}\n`;
      content += `Confidence: ${(mineral.confidence * 100).toFixed(1)}%\n`;
      
      if (mineral.composition) {
        content += `\nComposition:\n`;
        Object.entries(mineral.composition).forEach(([element, value]) => {
          content += `- ${element.toUpperCase()}: ${value}%\n`;
        });
      }
      
      if (mineral.properties) {
        content += `\nProperties:\n`;
        Object.entries(mineral.properties).forEach(([property, value]) => {
          content += `- ${property}: ${value}\n`;
        });
      }
    });
  }
  
  if (includeAnalysis && analysis) {
    content += `\n## ML Analysis Details\n`;
    content += `Analysis Date: ${formatDate(analysis.analysisDate)}\n`;
    content += `Confidence Score: ${(analysis.confidenceScore * 100).toFixed(1)}%\n`;
    content += `Processing Time: ${analysis.processingTime}ms\n`;
    
    if (analysis.tags && analysis.tags.length > 0) {
      content += `\nTags: ${analysis.tags.join(', ')}\n`;
    }
    
    // In a real implementation, you might include other details from the analysis
    // such as model information, etc.
  }
  
  // Return as plain text blob (in a real implementation, this would be a PDF)
  return new Blob([content], { type: 'text/plain' });
}

/**
 * Save a generated PDF blob as a file for download
 * 
 * @param blob The PDF blob
 * @param filename The filename to save as
 */
export function downloadPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a scan report as a PDF
 * 
 * @param scan The scan data
 * @param analysis The ML analysis data
 * @param minerals The detected minerals
 * @param options Export customization options
 */
export function exportScanToPdf(
  scan: Scan,
  analysis?: MlAnalysis,
  minerals?: Mineral[],
  options?: ExportOptions
): void {
  const blob = generateScanPdf(scan, analysis, minerals, options);
  const filename = `scan-report-${scan.id}-${new Date().toISOString().slice(0, 10)}.txt`;
  downloadPdf(blob, filename);
}