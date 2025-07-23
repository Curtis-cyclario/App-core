import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart2, 
  Settings, 
  Home, 
  Network, 
  Cpu, 
  BookOpen, 
  FileText, 
  Video,
  X,
  Activity,
  Crop,
  Gauge,
  Leaf,
  Zap,
  TrendingUp,
  ShoppingCart,
  Brain,
  Users,
  Shield,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const [location] = useLocation();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const links = [
    { href: '/', label: 'Site Overview', icon: <Home className="mr-3 h-6 w-6" /> },
    { href: '/monitoring', label: 'Live Monitoring', icon: <Activity className="mr-3 h-6 w-6" /> },
    { href: '/network', label: 'Network Topology', icon: <Network className="mr-3 h-6 w-6" /> },
    { href: '/device-management', label: 'IoT Devices', icon: <Cpu className="mr-3 h-6 w-6" /> },
    { href: '/facility-management', label: 'Site Management', icon: <Building2 className="mr-3 h-6 w-6" /> },
    { href: '/plants', label: 'Plant Biology', icon: <Leaf className="mr-3 h-6 w-6" /> },
    { href: '/ai-diagnostics', label: 'AI Health Scanner', icon: <Brain className="mr-3 h-6 w-6" /> },
    { href: '/plant-marketplace', label: 'Plant Exchange', icon: <ShoppingCart className="mr-3 h-6 w-6" /> },
    { href: '/blockchain', label: 'Supply Chain', icon: <Shield className="mr-3 h-6 w-6" /> },
    { href: '/analytics', label: 'Deep Analytics', icon: <BarChart2 className="mr-3 h-6 w-6" /> },
    { href: '/digital-twin', label: 'Digital Twin', icon: <Crop className="mr-3 h-6 w-6" /> },
    { href: '/predictive-maintenance', label: 'Predictive Care', icon: <Settings className="mr-3 h-6 w-6" /> },
    { href: '/investor-dashboard', label: 'Investor Portal', icon: <TrendingUp className="mr-3 h-6 w-6" /> },
    { href: '/integrations', label: 'Enterprise', icon: <Zap className="mr-3 h-6 w-6" /> },
    { href: '/resources', label: 'Knowledge Base', icon: <FileText className="mr-3 h-6 w-6" /> },
    { href: '/about', label: 'About Platform', icon: <BookOpen className="mr-3 h-6 w-6" /> },
    { href: '/settings', label: 'Configuration', icon: <Settings className="mr-3 h-6 w-6" /> },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div className={cn(
        "lg:flex lg:flex-shrink-0 w-64 flex-col sidebar-glass",
        "transition-all duration-300 ease-in-out",
        !collapsed ? "flex fixed inset-y-0 left-0 z-50 shadow-lg lg:shadow-none" : "hidden"
      )}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-dark-700 lg:hidden">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-primary-500 mr-2" />
            <span className="text-lg font-semibold text-gray-900 dark:text-white">VertiGrow IoT</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            <AnimatePresence>
              {links.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href={link.href}
                    onClick={handleNavClick}
                  >
                    <motion.div
                      className={cn(
                        "group flex items-center px-3 py-3 text-sm font-medium rounded-xl cursor-pointer relative overflow-hidden",
                        "transition-all duration-300 ease-in-out border border-transparent",
                        location === link.href 
                          ? theme === 'dark' 
                            ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border-emerald-500/30 shadow-lg shadow-emerald-500/10" 
                            : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 shadow-lg shadow-emerald-100/50"
                          : theme === 'dark'
                            ? "text-gray-300 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 hover:border-gray-600/30"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-200"
                      )}
                      onHoverStart={() => setHoveredLink(link.href)}
                      onHoverEnd={() => setHoveredLink(null)}
                    >
                      {/* Background glow effect */}
                      {location === link.href && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      
                      {/* Hover ripple effect */}
                      {hoveredLink === link.href && location !== link.href && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 to-teal-400/5 rounded-xl"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}

                      <motion.span 
                        className={cn(
                          "transition-all duration-300 ease-in-out relative z-10",
                          location === link.href 
                            ? theme === 'dark'
                              ? "text-emerald-400"
                              : "text-emerald-600"
                            : theme === 'dark'
                              ? "text-gray-400 group-hover:text-emerald-300"
                              : "text-gray-500 group-hover:text-emerald-500"
                        )}
                        animate={{
                          rotate: hoveredLink === link.href ? [0, -5, 5, 0] : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {link.icon}
                      </motion.span>
                      
                      <motion.span
                        className="relative z-10"
                        animate={{
                          x: location === link.href ? 2 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.label}
                      </motion.span>

                      {/* Active indicator */}
                      {location === link.href && (
                        <motion.div
                          className="absolute right-2 w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-lg"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
        </div>
        
        {/* System status indicator */}
        <div className="flex-shrink-0 flex border-t border-opacity-50 border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>System Online</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Updated 2 min ago</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
