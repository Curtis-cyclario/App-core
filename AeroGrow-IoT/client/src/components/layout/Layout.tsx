import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import Sidebar from './Sidebar';
import Header from './Header.tsx';
import { getRouteGradient, usePageTransition } from '@/lib/usePageTransition';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [siteTitle, setSiteTitle] = useState('VertiGrow Control Center');
  const [customizing, setCustomizing] = useState(false);
  const { isTransitioning, scrollY, getParallaxStyle, transitionDirection, getGlassEffect } = usePageTransition();
  
  // Get background gradient based on current route
  const backgroundGradient = getRouteGradient(location);
  
  // Handle page title changes
  useEffect(() => {
    let title = '';
    switch(location) {
      case '/': title = 'Overview'; break;
      case '/dashboard': title = 'Dashboard'; break;
      case '/network': title = 'Network Topology'; break;
      case '/plants': title = 'Plant Management'; break;
      case '/resources': title = 'Resource Management'; break;
      case '/blockchain': title = 'Blockchain'; break;
      case '/facilities': title = 'Facilities'; break;
      case '/analytics': title = 'Analytics'; break;
      case '/settings': title = 'Settings'; break;
      default: title = 'VertiGrow';
    }
    
    document.title = `${title} | ${siteTitle}`;
  }, [location, siteTitle]);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Update site title
  const updateSiteTitle = (newTitle: string) => {
    setSiteTitle(newTitle);
    setCustomizing(false);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header 
          sidebarCollapsed={sidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
          siteTitle={siteTitle}
          setSiteTitle={updateSiteTitle}
          customizing={customizing}
          setCustomizing={setCustomizing}
        />
        
        {/* Enhanced Page Background with Multi-layer Parallax Effect */}
        <div 
          className={`absolute inset-0 mt-16 overflow-hidden -z-10 ${backgroundGradient}`}
          style={{ 
            opacity: 0.85,
            pointerEvents: 'none' 
          }}
        >
          {/* Animated Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px'
            }}
          />
          
          {/* Multi-layer Parallax Elements */}
          <div 
            className="absolute -right-40 -top-20 w-[600px] h-[600px] rounded-full opacity-[0.08] dark:opacity-[0.12] bg-purple-300 dark:bg-purple-600 blur-3xl"
            style={getParallaxStyle(0.2, 0.4)}
          />
          <div 
            className="absolute -left-40 top-40 w-[500px] h-[500px] rounded-full opacity-[0.08] dark:opacity-[0.12] bg-blue-300 dark:bg-blue-600 blur-3xl"
            style={getParallaxStyle(0.1, 0.3)}
          />
          <div 
            className="absolute right-80 bottom-20 w-[300px] h-[300px] rounded-full opacity-[0.08] dark:opacity-[0.12] bg-green-300 dark:bg-green-600 blur-3xl"
            style={getParallaxStyle(0.3, 0.2)}
          />
          
          {/* Additional Organic Shapes */}
          <div 
            className="absolute left-1/4 top-1/3 w-[400px] h-[400px] rounded-full opacity-[0.06] dark:opacity-[0.1] bg-teal-300 dark:bg-teal-600 blur-3xl"
            style={getParallaxStyle(0.15, 0.1)}
          />
          <div 
            className="absolute right-1/4 bottom-1/4 w-[250px] h-[250px] rounded-full opacity-[0.06] dark:opacity-[0.1] bg-amber-300 dark:bg-amber-600 blur-3xl"
            style={getParallaxStyle(0.25, 0.15)}
          />
        </div>
        
        {/* Enhanced Main Content with Advanced Transitions */}
        <main 
          className={`
            flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-500 ease-in-out
            ${sidebarCollapsed ? 'pl-[5.5rem] sm:pl-24' : 'pl-4 sm:pl-6 lg:pl-8 md:pl-[17rem]'}
          `}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ 
                opacity: 0, 
                y: transitionDirection === 'forward' ? 24 : -24,
                scale: 0.98,
                filter: 'blur(8px)'
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1,
                filter: 'blur(0px)'
              }}
              exit={{ 
                opacity: 0, 
                y: transitionDirection === 'forward' ? -24 : 24,
                scale: 0.98,
                filter: 'blur(8px)'
              }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.4 
              }}
              className="pb-10"
            >
              {/* Glass-like container for content */}
              <motion.div
                className="relative overflow-hidden rounded-xl"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                {children}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;