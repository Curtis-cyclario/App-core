
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BarChart3, 
  Network, 
  Cpu,
  Building2,
  Brain,
  Blocks, 
  TrendingUp, 
  ChevronUp,
  Zap
} from 'lucide-react';

const FloatingNav: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Overview' },
    { path: '/dashboard', icon: BarChart3, label: 'Control Center' },
    { path: '/network', icon: Network, label: 'Network' },
    { path: '/device-management', icon: Cpu, label: 'Devices' },
    { path: '/facility-management', icon: Building2, label: 'Sites' },
    { path: '/ai-diagnostics', icon: Brain, label: 'AI Health' },
    { path: '/blockchain', icon: Blocks, label: 'Supply Chain' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' }
  ];

  useEffect(() => {
    let ticking = false;
    let frameId: number;
    
    const handleScroll = () => {
      if (!ticking) {
        frameId = requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          // Determine scroll direction with threshold to prevent flickering
          const scrollDifference = Math.abs(currentScrollY - lastScrollY);
          if (scrollDifference > 8) { // Increased threshold for better stability
            if (currentScrollY > lastScrollY && currentScrollY > 120) {
              setScrollDirection('down');
            } else if (currentScrollY < lastScrollY) {
              setScrollDirection('up');
            }
          }
          
          // Check if at top or bottom with stable thresholds
          setIsAtTop(currentScrollY < 100);
          setIsAtBottom(currentScrollY + windowHeight >= documentHeight - 200);
          
          // Show floating nav with stable conditions
          setShowFloatingNav(currentScrollY > 150);
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Throttled scroll event with passive listener
    const throttledScroll = () => {
      if (!ticking) {
        handleScroll();
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {showFloatingNav && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              type: "spring", 
              stiffness: 400, 
              damping: 25 
            }
          }}
          exit={{ 
            opacity: 0, 
            y: 100,
            transition: { duration: 0.2 }
          }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="premium-glass rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="px-6 py-4">
              <div className="flex items-center space-x-4">
                {/* Main Navigation */}
                <div className="flex items-center space-x-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;
                    
                    return (
                      <Button
                        key={item.path}
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation(item.path)}
                        className={`
                          relative px-3 py-2 rounded-lg transition-all duration-200
                          ${isActive 
                            ? 'text-emerald-400 bg-emerald-500/20' 
                            : 'text-slate-400 hover:text-emerald-400 hover:bg-white/5'
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        {isActive && (
                          <motion.div
                            layoutId="navIndicator"
                            className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          />
                        )}
                      </Button>
                    );
                  })}
                </div>

                {/* Scroll to Top Button */}
                <div className="border-l border-white/10 pl-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-slate-400 hover:text-emerald-400"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNav;
