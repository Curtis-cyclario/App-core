import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  AlertTriangle,
  Database
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import ForceGraph from './ForceGraph';

// Simplified API client for this component
async function fetchFromApi<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json() as Promise<T>;
}

// Define types for the network data
interface NetworkNodeData {
  id: string;
  type: string;
  name: string;
  status: string;
  x: number;
  y: number;
  plantType?: string;
  growthStage?: number;
  health?: number;
  value?: string;
  color?: string;
}

interface NetworkConnectionData {
  source: string;
  target: string;
  status: string;
  isCentral?: boolean;
}

interface NetworkData {
  nodes: NetworkNodeData[];
  connections: NetworkConnectionData[];
}

// Type definitions for the props
type ColorFormat = 'rgb' | 'hsl' | 'hsv' | 'hex';
type ColorScheme = 'organic' | 'cyber' | 'monochrome' | 'vibrant' | 'custom';
type CursorStyle = 'default' | 'glow' | 'particle' | 'pointer';

interface NetworkTopologyProps {
  networkData?: NetworkData | null;
  layoutMode?: 'standard' | 'mindmap';
  editMode?: boolean;
  towers?: any[];
  devices?: any[];
}

const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  networkData: externalNetworkData,
  layoutMode = 'standard',
  editMode = false,
  towers = [],
  devices = []
}) => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();

  // Fetch network data on component mount
  useEffect(() => {
    fetchNetworkData();
  }, []);

  // Fetch network data if external data is not provided
  const fetchNetworkData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (externalNetworkData) {
        setNetworkData(externalNetworkData);
      } else {
        const data = await fetchFromApi<NetworkData>('/api/network');
        setNetworkData(data);
      }
    } catch (err) {
      console.error('Failed to fetch network data:', err);
      setError('Failed to load network topology. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Network Topology</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchNetworkData}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      <Card className="shadow-lg border border-gray-100 dark:border-gray-800">
        <CardContent className="p-4 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/30">
          <div className="h-[490px] relative overflow-hidden rounded-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400 dark:text-gray-500">Loading network data...</p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Failed to load network data</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">{error}</p>
                <Button 
                  onClick={fetchNetworkData} 
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : !networkData || networkData.nodes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Database className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No network data available</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">There appears to be no network topology data available at this time.</p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ForceGraph
                  data={networkData}
                  width={800}
                  height={490}
                  nodeSelected={setSelectedNode}
                  selectedNode={selectedNode}
                  theme={theme}
                  colorScheme="organic"
                  customColors={{
                    hub: '#10B981',
                    tower: '#2DD4BF',
                    sensor: '#3B82F6',
                    controller: '#7C3AED',
                    pump: '#8B5CF6',
                    light: '#F59E0B',
                    reservoir: '#38BDF8',
                    server: '#EC4899',
                    storage: '#6366F1'
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkTopology;