import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Network, 
  Cpu, 
  Database, 
  Wifi, 
  Activity, 
  Zap,
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Settings,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';
import type { NetworkData, NetworkNodeData, NetworkConnectionData } from '@shared/schema';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import InteractiveNodeOverlay from './InteractiveNodeOverlay';

interface EnhancedNetworkTopologyProps {
  networkData: NetworkData;
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
  id: string;
}

interface IsolationEffect {
  nodeId: string;
  connections: string[];
  intensity: number;
}

const EnhancedNetworkTopology: React.FC<EnhancedNetworkTopologyProps> = ({ 
  networkData, 
  className = '' 
}) => {
  // Early return if networkData is null or invalid
  if (!networkData || !networkData.nodes || !networkData.connections) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading network topology...</p>
        </div>
      </div>
    );
  }

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isolationEffect, setIsolationEffect] = useState<IsolationEffect | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'isolated'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [overlayPosition, setOverlayPosition] = useState<{ x: number; y: number } | null>(null);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const { throttledExecution, scheduleRaf } = usePerformanceOptimization();
  
  // Optimized node positions calculation
  const nodePositions = useMemo(() => {
    const positions: NodePosition[] = [];
    const centerX = 400;
    const centerY = 300;
    
    if (!networkData?.nodes) return positions;
    
    networkData.nodes.forEach((node, index) => {
      let x = node.x || centerX;
      let y = node.y || centerY;
      
      // Enhanced positioning logic with organic patterns
      if (node.type === 'hub') {
        x = centerX + (index * 150) - (networkData.nodes.filter(n => n.type === 'hub').length * 75);
        y = centerY;
      } else if (node.type === 'tower') {
        const angle = (index / networkData.nodes.filter(n => n.type === 'tower').length) * 2 * Math.PI;
        const radius = 200 + Math.sin(angle * 3) * 30;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
      } else if (node.type === 'sensor') {
        const parentTower = networkData.nodes.find(n => n.type === 'tower');
        if (parentTower) {
          const offset = (index % 4) * 60 - 90;
          x = (parentTower.x || centerX) + offset;
          y = (parentTower.y || centerY) + (Math.random() - 0.5) * 100;
        }
      }
      
      positions.push({ x, y, id: node.id });
    });
    
    return positions;
  }, [networkData?.nodes]);

  // Clear selection and reset view
  const handleClearSelection = useCallback(() => {
    setSelectedNode(null);
    setIsolationEffect(null);
    setViewMode('overview');
    setOverlayPosition(null);
  }, []);

  // Node selection handler with isolation effects
  const handleNodeSelect = useCallback((nodeId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    throttledExecution('node-select', () => {
      // If clicking the same node, clear selection
      if (selectedNode === nodeId) {
        handleClearSelection();
        return;
      }
      
      const position = nodePositions.find(p => p.id === nodeId);
      if (position && event) {
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          setOverlayPosition({
            x: rect.left + (position.x * rect.width / 800),
            y: rect.top + (position.y * rect.height / 600)
          });
        }
      }
      
      setSelectedNode(nodeId);
      
      // Calculate isolation effect
      const connectedNodes = networkData.connections
        .filter(conn => conn.source === nodeId || conn.target === nodeId)
        .map(conn => conn.source === nodeId ? conn.target : conn.source);
      
      setIsolationEffect({
        nodeId,
        connections: connectedNodes,
        intensity: connectedNodes.length / networkData.nodes.length
      });
      
      setViewMode('isolated');
    }, 100);
  }, [networkData?.connections, networkData?.nodes?.length, throttledExecution, nodePositions]);

  // Get node visual properties
  const getNodeProps = useCallback((node: NetworkNodeData) => {
    const isSelected = selectedNode === node.id;
    const isHovered = hoveredNode === node.id;
    const isIsolated = isolationEffect && 
      (isolationEffect.nodeId === node.id || isolationEffect.connections.includes(node.id));
    const isDimmed = isolationEffect && !isIsolated;
    
    let color = '#64748b';
    let size = 20;
    let icon = <Cpu className="w-4 h-4" />;
    
    switch (node.type) {
      case 'hub':
        color = '#10b981';
        size = 30;
        icon = <Database className="w-6 h-6" />;
        break;
      case 'tower':
        color = '#3b82f6';
        size = 25;
        icon = <Network className="w-5 h-5" />;
        break;
      case 'sensor':
        color = '#f59e0b';
        size = 18;
        if (node.name.includes('Temperature')) icon = <Thermometer className="w-4 h-4" />;
        else if (node.name.includes('Humidity')) icon = <Droplets className="w-4 h-4" />;
        else if (node.name.includes('Light')) icon = <Sun className="w-4 h-4" />;
        else icon = <Activity className="w-4 h-4" />;
        break;
    }
    
    return {
      color: isDimmed ? '#374151' : color,
      size: isSelected ? size * 1.5 : isHovered ? size * 1.2 : size,
      icon,
      opacity: isDimmed ? 0.3 : 1,
      strokeWidth: isSelected ? 4 : isHovered ? 2 : 1,
      glowIntensity: isSelected ? 20 : isHovered ? 10 : 0
    };
  }, [selectedNode, hoveredNode, isolationEffect]);

  // Get connection visual properties
  const getConnectionProps = useCallback((connection: NetworkConnectionData) => {
    const isHighlighted = isolationEffect && 
      (isolationEffect.nodeId === connection.source || isolationEffect.nodeId === connection.target);
    const isDimmed = isolationEffect && !isHighlighted;
    
    return {
      stroke: isDimmed ? '#374151' : connection.status === 'active' ? '#10b981' : '#ef4444',
      strokeWidth: isHighlighted ? 4 : 2,
      opacity: isDimmed ? 0.2 : 1,
      animation: isHighlighted ? 'flow-active' : 'none'
    };
  }, [isolationEffect]);

  // Render enhanced connection with flow animation
  const renderConnection = useCallback((connection: NetworkConnectionData, index: number) => {
    const sourcePos = nodePositions.find(p => p.id === connection.source);
    const targetPos = nodePositions.find(p => p.id === connection.target);
    
    if (!sourcePos || !targetPos) return null;
    
    const props = getConnectionProps(connection);
    const pathId = `connection-${index}`;
    
    return (
      <g key={`${connection.source}-${connection.target}`}>
        <defs>
          <linearGradient id={`gradient-${index}`} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={props.stroke} stopOpacity="0.8" />
            <stop offset="50%" stopColor={props.stroke} stopOpacity="1" />
            <stop offset="100%" stopColor={props.stroke} stopOpacity="0.8" />
          </linearGradient>
          <filter id={`glow-${index}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <motion.line
          x1={sourcePos.x}
          y1={sourcePos.y}
          x2={targetPos.x}
          y2={targetPos.y}
          stroke={`url(#gradient-${index})`}
          strokeWidth={props.strokeWidth}
          opacity={props.opacity}
          filter={props.animation === 'flow-active' ? `url(#glow-${index})` : 'none'}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: index * 0.05 }}
        />
        
        {props.animation === 'flow-active' && (
          <motion.circle
            r="3"
            fill={props.stroke}
            initial={{ x: sourcePos.x, y: sourcePos.y }}
            animate={{ x: targetPos.x, y: targetPos.y }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        )}
      </g>
    );
  }, [nodePositions, getConnectionProps]);

  // Render enhanced node with interactive effects
  const renderNode = useCallback((node: NetworkNodeData, index: number) => {
    const position = nodePositions.find(p => p.id === node.id);
    if (!position) return null;
    
    const props = getNodeProps(node);
    
    return (
      <motion.g
        key={node.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: props.opacity }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        onHoverStart={() => setHoveredNode(node.id)}
        onHoverEnd={() => setHoveredNode(null)}
        onClick={(e) => handleNodeSelect(node.id, e.nativeEvent as any)}
        style={{ cursor: 'pointer' }}
      >
        <defs>
          <filter id={`node-glow-${node.id}`}>
            <feGaussianBlur stdDeviation={props.glowIntensity / 5} result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id={`node-gradient-${node.id}`}>
            <stop offset="0%" stopColor={props.color} stopOpacity="1" />
            <stop offset="70%" stopColor={props.color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={props.color} stopOpacity="0.4" />
          </radialGradient>
        </defs>
        
        <motion.circle
          cx={position.x}
          cy={position.y}
          r={props.size}
          fill={`url(#node-gradient-${node.id})`}
          stroke={props.color}
          strokeWidth={props.strokeWidth}
          filter={props.glowIntensity > 0 ? `url(#node-glow-${node.id})` : 'none'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
        
        <foreignObject
          x={position.x - props.size / 2}
          y={position.y - props.size / 2}
          width={props.size}
          height={props.size}
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center justify-center w-full h-full text-white">
            {props.icon}
          </div>
        </foreignObject>
        
        <motion.text
          x={position.x}
          y={position.y + props.size + 15}
          textAnchor="middle"
          className="text-xs fill-white font-medium"
          opacity={selectedNode === node.id || hoveredNode === node.id ? 1 : 0.7}
        >
          {node.name}
        </motion.text>
        
        {node.status && (
          <motion.rect
            x={position.x + props.size - 8}
            y={position.y - props.size}
            width="16"
            height="12"
            rx="6"
            fill={node.status === 'online' ? '#10b981' : node.status === 'warning' ? '#f59e0b' : '#ef4444'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
        )}
      </motion.g>
    );
  }, [nodePositions, getNodeProps, selectedNode, hoveredNode, handleNodeSelect]);

  return (
    <Card className={`performance-optimized ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Network className="w-5 h-5 mr-2 text-emerald-400" />
            Enhanced Network Topology
            {isolationEffect && (
              <Badge variant="secondary" className="ml-2">
                Isolated View: {isolationEffect.connections.length} connections
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedNode(null);
                setIsolationEffect(null);
                setViewMode('overview');
              }}
              className="text-white border-slate-600"
            >
              <Eye className="w-4 h-4 mr-1" />
              Reset View
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white border-slate-600"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900' : 'h-96'} overflow-hidden rounded-lg bg-slate-800/30`}>
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-full gpu-accelerated"
            style={{ filter: 'contrast(1.1) brightness(1.05)' }}
          >
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Render connections first */}
            <g className="connections">
              {networkData.connections.map(renderConnection)}
            </g>
            
            {/* Render nodes on top */}
            <g className="nodes">
              {networkData?.nodes?.map(renderNode) || []}
            </g>
          </svg>
          
          {/* Interactive Node Overlay */}
          <InteractiveNodeOverlay
            selectedNode={selectedNode ? networkData?.nodes?.find(n => n.id === selectedNode) || null : null}
            position={overlayPosition}
            onClose={() => {
              setSelectedNode(null);
              setOverlayPosition(null);
              setIsolationEffect(null);
              setViewMode('overview');
            }}
            onMaximize={(node) => {
              // Handle node configuration modal
              console.log('Configure node:', node);
            }}
            connectionCount={isolationEffect?.connections.length || 0}
          />
        </div>
        
        {/* Network statistics */}
        <div className="mt-4 grid grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-2xl font-bold text-emerald-400">
              {networkData?.nodes?.filter(n => n.status === 'online').length || 0}
            </div>
            <div className="text-sm text-slate-400">Online Nodes</div>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {networkData.connections.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-slate-400">Active Links</div>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(((networkData?.nodes?.filter(n => n.status === 'online').length || 0) / (networkData?.nodes?.length || 1)) * 100)}%
            </div>
            <div className="text-sm text-slate-400">Health Score</div>
          </div>
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {networkData.connections.reduce((sum, c) => sum + (c.dataRate || 0), 0)}
            </div>
            <div className="text-sm text-slate-400">Total Data Rate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedNetworkTopology;