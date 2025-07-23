import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Cpu,
  Droplet,
  Zap,
  Database,
  ThermometerIcon,
  AlertTriangle,
  Server,
  Signal,
  Lightbulb,
  Gauge,
  Activity,
  CheckCircle2,
  XCircle,
  Wifi
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the network data types
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
  size?: number;
  icon?: string;
  color?: string;
}

interface NetworkConnectionData {
  source: string;
  target: string;
  status: string;
  isCentral?: boolean;
  flowRate?: number;
  intensity?: number;
  dataRate?: number;
}

interface NetworkData {
  nodes: NetworkNodeData[];
  connections: NetworkConnectionData[];
}

interface ForceGraphProps {
  data: NetworkData;
  width: number;
  height: number;
  nodeSelected: (id: string | null) => void;
  selectedNode: string | null;
  theme: string;
  colorScheme?: 'organic' | 'cyber' | 'monochrome' | 'vibrant' | 'custom';
  customColors?: Record<string, string>;
}

// Physics constants for force-directed layout
const REPULSION_FORCE = 150; // Node repulsion strength
const ATTRACTION_FORCE = 0.1; // Edge attraction strength
const CENTERING_FORCE = 0.05; // Force pulling toward center
const MIN_DISTANCE = 70; // Minimum distance between nodes

// Enhanced Force Graph component for beautiful network visualization
const EnhancedForceGraph: React.FC<ForceGraphProps> = ({
  data,
  width = 800,
  height = 600,
  nodeSelected,
  selectedNode,
  theme = 'light',
  colorScheme = 'organic',
  customColors = {}
}) => {
  // Internal state to track node positions for force-directed layout
  const [nodes, setNodes] = useState<NetworkNodeData[]>([]);
  const [connections, setConnections] = useState<NetworkConnectionData[]>([]);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [initialPositionsSet, setInitialPositionsSet] = useState<boolean>(false);
  
  // Animation constants
  const [animationTime, setAnimationTime] = useState<number>(0);
  const animationRef = useRef<number>(0);
  
  // Deep copy to prevent mutating props
  useEffect(() => {
    if (data && data.nodes && data.connections) {
      // Apply initial positions based on network topology
      if (!initialPositionsSet) {
        setNodes(organizeTopology(data.nodes));
        setInitialPositionsSet(true);
      } else {
        setNodes([...data.nodes]);
      }
      setConnections([...data.connections]);
      
      // Start physics simulation
      setSimulating(true);
    }
  }, [data]);
  
  // Organize network topology into a meaningful structure
  const organizeTopology = (inputNodes: NetworkNodeData[]): NetworkNodeData[] => {
    const resultNodes = [...inputNodes];
    
    // Identify hubs and towers
    const hubs = resultNodes.filter(n => n.type === 'hub');
    const towers = resultNodes.filter(n => n.type === 'tower');
    
    // Place hubs in horizontal central pipeline
    const hubSpacing = Math.min(width / (hubs.length + 1), 200);
    const hubY = height / 2;
    
    hubs.forEach((hub, i) => {
      const hubX = (width / 2) - ((hubs.length - 1) * hubSpacing / 2) + (i * hubSpacing);
      hub.x = hubX;
      hub.y = hubY;
    });
    
    // Place towers in a semi-circle around the central pipeline
    // 5 towers in top semi-circle, 5 in bottom semi-circle
    const radius = Math.min(width, height) * 0.35;
    const goldenRatio = 1.618033988749895;
    
    towers.forEach((tower, i) => {
      let angle;
      
      // Position in a semi-circle based on index
      if (i < towers.length / 2) {
        angle = Math.PI - (Math.PI * (i + 1) / (towers.length / 2 + 1));
      } else {
        angle = Math.PI * (i - towers.length / 2 + 1) / (towers.length / 2 + 1);
      }
      
      // Apply golden ratio offset for organic feel
      const offsetMagnitude = 20;
      const offsetAngle = (i * goldenRatio) % (2 * Math.PI);
      const offsetX = Math.cos(offsetAngle) * offsetMagnitude;
      const offsetY = Math.sin(offsetAngle) * offsetMagnitude;
      
      tower.x = (width / 2) + Math.cos(angle) * radius + offsetX;
      tower.y = hubY + Math.sin(angle) * radius + offsetY;
    });
    
    // Position sensors near their respective towers or hubs
    resultNodes.filter(n => n.type === 'sensor').forEach((sensor) => {
      // Determine parent node from id (e.g. "tower-1-temp" belongs to "tower-1")
      const idParts = sensor.id.split('-');
      let parentId;
      
      if (idParts[0] === 'tower' && idParts.length > 2) {
        parentId = `tower-${idParts[1]}`;
      } else if (['water', 'light', 'data', 'sensor'].includes(idParts[0])) {
        parentId = `${idParts[0]}-hub`;
      }
      
      if (parentId) {
        const parent = resultNodes.find(n => n.id === parentId);
        if (parent) {
          // Position in a circle around parent
          const sensorIndex = Math.floor(Math.random() * 8);
          const angle = (sensorIndex / 8) * Math.PI * 2;
          const distance = 50;
          
          sensor.x = parent.x + Math.cos(angle) * distance;
          sensor.y = parent.y + Math.sin(angle) * distance;
        }
      }
    });
    
    // Position other node types
    resultNodes.filter(n => !['hub', 'tower', 'sensor'].includes(n.type)).forEach((node, i) => {
      // Find if there's a related hub based on id prefix
      const idPrefix = node.id.split('-')[0];
      const relatedHub = hubs.find(h => h.id.includes(idPrefix));
      
      if (relatedHub) {
        // Position subsystems around their related hub
        const angle = (i % 6) * (Math.PI * 2 / 6);
        const distance = 70;
        
        node.x = relatedHub.x + Math.cos(angle) * distance;
        node.y = relatedHub.y + Math.sin(angle) * distance;
      } else {
        // Default position
        node.x = Math.random() * width;
        node.y = Math.random() * height;
      }
    });
    
    return resultNodes;
  };
  
  // Apply force-directed layout algorithm to prevent node overlap
  useEffect(() => {
    if (!simulating) return;
    
    let frame: number;
    
    const simulateForces = () => {
      setNodes(currentNodes => {
        // Deep copy of current nodes to avoid mutation
        const newNodes = [...currentNodes];
        
        // Apply repulsion forces between nodes (prevent overlap)
        for (let i = 0; i < newNodes.length; i++) {
          for (let j = i + 1; j < newNodes.length; j++) {
            const node1 = newNodes[i];
            const node2 = newNodes[j];
            
            const dx = node2.x - node1.x;
            const dy = node2.y - node1.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
            
            // Skip if nodes are far enough apart
            if (distance > MIN_DISTANCE * 2) continue;
            
            // Calculate repulsion force
            const force = Math.min(REPULSION_FORCE / (distance * distance), 10);
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            
            // Apply forces in opposite directions
            if (distance < MIN_DISTANCE) {
              node2.x += fx;
              node2.y += fy;
              node1.x -= fx;
              node1.y -= fy;
            }
          }
        }
        
        // Apply attraction forces along connections
        connections.forEach(conn => {
          const source = newNodes.find(n => n.id === conn.source);
          const target = newNodes.find(n => n.id === conn.target);
          
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
            
            // Skip if nodes are at good distance
            if (distance < MIN_DISTANCE || distance > MIN_DISTANCE * 3) {
              // Apply force to bring nodes to optimal distance
              const force = (distance - MIN_DISTANCE) * ATTRACTION_FORCE;
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              // Apply force to both nodes (weighted for hub/tower nodes)
              const sourceWeight = source.type === 'hub' || source.type === 'tower' ? 0.2 : 1;
              const targetWeight = target.type === 'hub' || target.type === 'tower' ? 0.2 : 1;
              
              source.x += fx * sourceWeight;
              source.y += fy * sourceWeight;
              target.x -= fx * targetWeight;
              target.y -= fy * targetWeight;
            }
          }
        });
        
        // Apply centering force to keep nodes within bounds
        newNodes.forEach(node => {
          const centerForce = CENTERING_FORCE;
          node.x += (width / 2 - node.x) * centerForce * 0.05;
          node.y += (height / 2 - node.y) * centerForce * 0.05;
          
          // Keep within bounds
          node.x = Math.max(30, Math.min(width - 30, node.x));
          node.y = Math.max(30, Math.min(height - 30, node.y));
        });
        
        return newNodes;
      });
      
      // Update animation time for fluid animating connections
      setAnimationTime(prev => prev + 0.01);
      
      // Continue simulation
      frame = requestAnimationFrame(simulateForces);
    };
    
    frame = requestAnimationFrame(simulateForces);
    
    // Clean up on unmount
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [simulating, connections, width, height]);
  
  // Get icon component for the node type
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'hub': return <Database className="h-full w-full" />;
      case 'tower': return <Building2 className="h-full w-full" />;
      case 'sensor': return <Signal className="h-full w-full" />;
      case 'controller': return <Cpu className="h-full w-full" />;
      case 'pump': return <Droplet className="h-full w-full" />;
      case 'light': return <Lightbulb className="h-full w-full" />;
      case 'server': return <Server className="h-full w-full" />;
      case 'subsystem': return <Gauge className="h-full w-full" />;
      default: return <Cpu className="h-full w-full" />;
    }
  };
  
  // Get color based on node type and status
  const getNodeColor = (type: string, status: string) => {
    // Use custom colors if provided
    if (customColors && customColors[type]) {
      return customColors[type];
    }
    
    // Status takes precedence for warnings/errors
    if (status === 'error' || status === 'offline') {
      return '#EF4444'; // Red
    } else if (status === 'warning') {
      return '#F59E0B'; // Amber
    }
    
    // Color by type
    switch (colorScheme) {
      case 'organic':
        switch (type) {
          case 'hub': return '#10B981'; // Emerald
          case 'tower': return '#2DD4BF'; // Teal
          case 'sensor': return '#3B82F6'; // Blue
          case 'controller': return '#7C3AED'; // Violet
          case 'pump': return '#8B5CF6'; // Purple
          case 'light': return '#F59E0B'; // Amber
          case 'server': return '#EC4899'; // Pink
          default: return '#6366F1'; // Indigo
        }
      case 'cyber':
        switch (type) {
          case 'hub': return '#00FFAA'; 
          case 'tower': return '#00D1FF';
          case 'sensor': return '#7B42FF';
          case 'controller': return '#FF19A5';
          case 'pump': return '#19FFFC';
          case 'light': return '#FFCC00';
          case 'server': return '#0080FF';
          default: return '#C961DE';
        }
      case 'monochrome':
        // Monochrome with different shades
        switch (type) {
          case 'hub': return theme === 'dark' ? '#E5E7EB' : '#1F2937';
          case 'tower': return theme === 'dark' ? '#D1D5DB' : '#374151';
          case 'sensor': return theme === 'dark' ? '#9CA3AF' : '#4B5563';
          case 'controller': return theme === 'dark' ? '#6B7280' : '#6B7280';
          case 'pump': return theme === 'dark' ? '#4B5563' : '#9CA3AF';
          case 'light': return theme === 'dark' ? '#374151' : '#D1D5DB';
          case 'server': return theme === 'dark' ? '#1F2937' : '#E5E7EB';
          default: return theme === 'dark' ? '#9CA3AF' : '#4B5563';
        }
      case 'vibrant':
        switch (type) {
          case 'hub': return '#FF5733';
          case 'tower': return '#C70039';
          case 'sensor': return '#900C3F';
          case 'controller': return '#581845';
          case 'pump': return '#FFC300';
          case 'light': return '#DAF7A6';
          case 'server': return '#FF5733';
          default: return '#2E86C1';
        }
      default:
        return '#3B82F6'; // Default blue
    }
  };
  
  // Get line attributes for connections
  const getLineAttributes = (connection: NetworkConnectionData) => {
    const source = nodes.find(node => node.id === connection.source);
    const target = nodes.find(node => node.id === connection.target);
    
    if (!source || !target) return null;
    
    // Line style based on status
    let strokeWidth = connection.isCentral ? 3 : 1.5;
    let color = connection.status === 'offline' 
      ? '#EF4444' 
      : connection.status === 'warning' 
        ? '#F59E0B' 
        : connection.isCentral 
          ? '#3B82F6' 
          : '#6B7280';
    
    // Adjust for dark mode
    if (theme === 'dark') {
      color = connection.status === 'offline' 
        ? '#EF4444' 
        : connection.status === 'warning' 
          ? '#F59E0B' 
          : connection.isCentral 
            ? '#60A5FA' 
            : '#9CA3AF';
    }
    
    // Dashed line for inactive connections
    const dashArray = connection.status === 'offline' ? "6 3" : undefined;
    
    // Calculate flow animation offset
    const flowOffset = (connection.flowRate || 1) * animationTime % 15;
    
    return {
      x1: source.x,
      y1: source.y,
      x2: target.x,
      y2: target.y,
      stroke: color,
      strokeWidth,
      strokeDasharray: dashArray,
      strokeDashoffset: flowOffset
    };
  };
  
  // Get node size based on type
  const getNodeSize = (node: NetworkNodeData) => {
    // Use custom size if provided
    if (node.size) return node.size;
    
    // Size by type
    switch (node.type) {
      case 'hub': return 32;
      case 'tower': return 28;
      case 'controller': return 24;
      case 'server': return 24;
      case 'pump': return 22;
      case 'light': return 22;
      case 'sensor': return 18;
      default: return 20;
    }
  };
  
  // Get status icon and text
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'online':
        return { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, text: 'Online', color: 'bg-green-500' };
      case 'offline':
        return { icon: <XCircle className="h-4 w-4 text-red-500" />, text: 'Offline', color: 'bg-red-500' };
      case 'warning':
        return { icon: <AlertTriangle className="h-4 w-4 text-amber-500" />, text: 'Warning', color: 'bg-amber-500' };
      case 'active':
        return { icon: <Activity className="h-4 w-4 text-purple-500" />, text: 'Active', color: 'bg-purple-500' };
      case 'idle':
        return { icon: <Wifi className="h-4 w-4 text-blue-500" />, text: 'Idle', color: 'bg-blue-500' };
      default:
        return { icon: <CheckCircle2 className="h-4 w-4 text-gray-500" />, text: status, color: 'bg-gray-500' };
    }
  };
  
  return (
    <svg 
      width={width} 
      height={height} 
      className="overflow-visible" 
      style={{ background: 'transparent' }}
    >
      {/* GridLines for visual reference (optional) */}
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path 
            d="M 20 0 L 0 0 0 20" 
            fill="none" 
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#smallGrid)" />
      
      {/* Connections between nodes */}
      {connections.map((connection, i) => {
        const attrs = getLineAttributes(connection);
        if (!attrs) return null;
        
        return (
          <g key={`conn-${i}`}>
            {/* Main connection line */}
            <line
              {...attrs}
              strokeLinecap="round"
              className="transition-all duration-300 ease-in-out"
            />
            
            {/* Animated flow particles for active connections */}
            {connection.status !== 'offline' && connection.isCentral && (
              <>
                <circle
                  cx={attrs.x1 + (attrs.x2 - attrs.x1) * ((animationTime * 0.3) % 1)}
                  cy={attrs.y1 + (attrs.y2 - attrs.y1) * ((animationTime * 0.3) % 1)}
                  r={2}
                  fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
                  className="opacity-70"
                />
                <circle
                  cx={attrs.x1 + (attrs.x2 - attrs.x1) * ((animationTime * 0.3 + 0.3) % 1)}
                  cy={attrs.y1 + (attrs.y2 - attrs.y1) * ((animationTime * 0.3 + 0.3) % 1)}
                  r={2}
                  fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
                  className="opacity-70"
                />
                <circle
                  cx={attrs.x1 + (attrs.x2 - attrs.x1) * ((animationTime * 0.3 + 0.6) % 1)}
                  cy={attrs.y1 + (attrs.y2 - attrs.y1) * ((animationTime * 0.3 + 0.6) % 1)}
                  r={2}
                  fill={theme === 'dark' ? '#60A5FA' : '#3B82F6'}
                  className="opacity-70"
                />
              </>
            )}
          </g>
        );
      })}
      
      {/* Nodes */}
      {nodes.map(node => {
        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNode === node.id;
        const size = getNodeSize(node);
        const color = node.color || getNodeColor(node.type, node.status);
        const statusInfo = getStatusIndicator(node.status);
        
        return (
          <g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            onClick={() => nodeSelected(node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ cursor: 'pointer' }}
            className="transition-all duration-300"
          >
            {/* Selection/highlight ring */}
            {(isSelected || isHovered) && (
              <circle
                r={size + 5}
                fill="transparent"
                stroke={isSelected ? (theme === 'dark' ? '#60A5FA' : '#3B82F6') : (theme === 'dark' ? '#9CA3AF' : '#6B7280')}
                strokeWidth={2}
                strokeDasharray={isHovered && !isSelected ? "3 2" : undefined}
                className="transition-all duration-300"
              />
            )}
            
            {/* Node circle background */}
            <circle
              r={size}
              fill={color}
              className={`transition-all duration-300 ${node.status === 'warning' || node.status === 'active' ? 'animate-pulse' : ''}`}
            />
            
            {/* Node icon */}
            <foreignObject
              x={-size * 0.6}
              y={-size * 0.6}
              width={size * 1.2}
              height={size * 1.2}
              className="flex items-center justify-center"
              style={{ color: 'white' }}
            >
              <div className="flex items-center justify-center h-full w-full">
                {getNodeIcon(node.type)}
              </div>
            </foreignObject>
            
            {/* Node label */}
            <foreignObject
              x={-size * 2}
              y={size + 5}
              width={size * 4}
              height={22}
              className="text-center"
            >
              <div 
                className={`text-xs font-medium px-1 py-0.5 rounded ${theme === 'dark' ? 'text-gray-300 bg-gray-800/70' : 'text-gray-700 bg-white/90'}`}
                style={{ 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  maxWidth: size * 4,
                  backdropFilter: 'blur(4px)',
                  textAlign: 'center'
                }}
              >
                {node.name}
              </div>
            </foreignObject>
            
            {/* Value badge for sensors */}
            {node.value && (
              <foreignObject
                x={size * 0.3}
                y={-size * 1.3}
                width={40}
                height={22}
              >
                <div 
                  className={`text-xs font-bold px-2 py-0.5 rounded ${theme === 'dark' ? 'text-gray-100 bg-gray-800' : 'text-gray-800 bg-white'}`}
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  {node.value}
                </div>
              </foreignObject>
            )}
            
            {/* Status indicator, only visible on hover or select */}
            {(isHovered || isSelected) && (
              <foreignObject
                x={-18}
                y={-size - 25}
                width={36}
                height={20}
                className="transition-opacity duration-200"
              >
                <div 
                  className={`flex items-center justify-center text-xs gap-1 px-1 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                  style={{ backdropFilter: 'blur(4px)' }}
                >
                  <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {statusInfo.text}
                  </span>
                </div>
              </foreignObject>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default EnhancedForceGraph;