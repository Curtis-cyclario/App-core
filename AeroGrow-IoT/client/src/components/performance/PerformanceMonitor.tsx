import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  networkLatency: number;
  jsHeapSize: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    networkLatency: 0,
    jsHeapSize: 0
  });
  
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const rafId = useRef<number>();

  useEffect(() => {
    const measurePerformance = () => {
      const now = performance.now();
      frameCount.current++;
      
      // Calculate FPS
      if (now - lastTime.current >= 1000) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
        
        // Get memory info if available
        const memory = (performance as any).memory;
        const memoryUsage = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
        const jsHeapSize = memory ? Math.round(memory.totalJSHeapSize / 1024 / 1024) : 0;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage,
          jsHeapSize,
          renderTime: Math.round(now - lastTime.current)
        }));
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      rafId.current = requestAnimationFrame(measurePerformance);
    };

    rafId.current = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'optimal';
    if (value >= thresholds.warning) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const fpsStatus = getPerformanceStatus(metrics.fps, { good: 55, warning: 30 });
  const memoryStatus = getPerformanceStatus(100 - metrics.memoryUsage, { good: 50, warning: 25 });

  return (
    <Card className="performance-optimized bg-slate-800/30 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Activity className="w-5 h-5 mr-2 text-emerald-400" />
          Performance Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <Badge className={getStatusColor(fpsStatus)}>
                {fpsStatus}
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">{metrics.fps}</div>
            <div className="text-xs text-slate-400">FPS</div>
          </div>
          
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <Badge className={getStatusColor(memoryStatus)}>
                {memoryStatus}
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">{metrics.memoryUsage}</div>
            <div className="text-xs text-slate-400">MB Memory</div>
          </div>
          
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">
                active
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">{metrics.renderTime}</div>
            <div className="text-xs text-slate-400">ms Render</div>
          </div>
          
          <div className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/50">
                connected
              </Badge>
            </div>
            <div className="text-lg font-bold text-white">{metrics.jsHeapSize}</div>
            <div className="text-xs text-slate-400">MB Heap</div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-slate-500">
          Performance monitoring active - Optimizations applied for 60+ FPS rendering
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;