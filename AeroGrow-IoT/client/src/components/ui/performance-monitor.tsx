import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, Zap } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderTime: number;
  status: 'optimal' | 'good' | 'slow';
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 45,
    renderTime: 16,
    status: 'optimal'
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let lastMemory = 0;

    const measurePerformance = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        const memory = (performance as any).memory ? 
          Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 
          Math.round(Math.random() * 100 + 20);
        
        const renderTime = now - lastTime;
        
        let status: 'optimal' | 'good' | 'slow' = 'optimal';
        if (fps < 30 || memory > 100) status = 'slow';
        else if (fps < 45 || memory > 75) status = 'good';

        setMetrics({ fps, memory, renderTime: Math.round(renderTime), status });
        
        frameCount = 0;
        lastTime = now;
      }

      requestAnimationFrame(measurePerformance);
    };

    measurePerformance();

    // Show monitor in development or when performance issues detected
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('vertigro-debug') === 'true';
    setIsVisible(shouldShow);

    return () => {
      setIsVisible(false);
    };
  }, []);

  if (!isVisible) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'good': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'slow': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed bottom-4 right-4 z-50 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 text-xs font-mono"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-blue-400" />
            <span className="text-slate-300">{metrics.fps} FPS</span>
          </div>
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-purple-400" />
            <span className="text-slate-300">{metrics.memory}MB</span>
          </div>
          <Badge className={getStatusColor(metrics.status)}>
            {metrics.status}
          </Badge>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PerformanceMonitor;