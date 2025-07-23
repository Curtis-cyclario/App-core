import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  Settings, 
  User, 
  LogOut,
  Search,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  siteTitle: string;
  setSiteTitle: (title: string) => void;
  customizing: boolean;
  setCustomizing: (customizing: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  siteTitle,
  setSiteTitle,
  customizing,
  setCustomizing
}) => {
  const { theme, setTheme } = useTheme();
  const [notificationCount, setNotificationCount] = useState<number>(5);
  const [title, setTitle] = useState(siteTitle);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const response = await fetch('/api/notifications/count');
      if (!response.ok) {
        throw new Error(`Failed to fetch notification count: ${response.status}`);
      }
      const data = await response.json();
      setNotificationCount(parseInt(data.count));
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
    }
  };
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Customize title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  // Save title change
  const handleSaveTitleChange = () => {
    setSiteTitle(title);
    toast({
      description: 'Site title updated successfully'
    });
  };
  
  return (
    <motion.header 
      className="sticky top-0 z-30 premium-glass border-b border-cyan-500/20 backdrop-blur-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-4 py-3">
        {/* Main Header Row */}
        <div className="flex items-center justify-between">
          {/* Left Side - Toggle and Title */}
          <div className="flex items-center min-w-0 flex-1 mr-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="mr-3 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all duration-300"
            >
              <Menu className="h-5 w-5 text-cyan-400" />
            </Button>
            
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              {customizing ? (
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <Input 
                    value={title} 
                    onChange={handleTitleChange} 
                    className="h-8 text-lg font-bold bg-black/20 border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-400"
                    placeholder="Enter site title"
                  />
                  <div className="flex space-x-1">
                    <Button onClick={handleSaveTitleChange} size="sm" className="cyber-button-primary">
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setTitle(siteTitle);
                        setCustomizing(false);
                      }}
                      className="cyber-button-secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {/* CRT-style pixel dots */}
                    <div className="grid grid-cols-8 gap-0.5">
                      {Array.from({ length: 32 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 bg-green-400 rounded-full opacity-60"
                          animate={{ 
                            opacity: [0.3, 0.8, 0.3],
                            scale: [0.8, 1.2, 0.8]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                        />
                      ))}
                    </div>
                    <motion.h1 
                      className="text-2xl font-bold text-green-400 font-serif italic tracking-wide crt-glow"
                      animate={{ 
                        textShadow: [
                          "0 0 10px #4ade80",
                          "0 0 20px #4ade80, 0 0 30px #4ade80",
                          "0 0 10px #4ade80"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                        textShadow: "0 0 10px #4ade80, 0 0 20px #4ade80"
                      }}
                    >
                      The HQ
                    </motion.h1>
                  </motion.div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCustomizing(true)}
                    className="ml-2 h-7 w-7 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-cyan-400" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Compact on mobile, full on desktop */}
          <div className="flex items-center space-x-2">
            {/* Search - Hidden on small screens */}
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <Input
                placeholder="Search systems..."
                className="pl-9 w-[220px] h-9 bg-black/20 border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-400"
              />
            </div>
            
            {/* Theme Toggle - Hidden on small screens */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="hidden sm:flex hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all duration-300"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400" />
              )}
            </Button>
            
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all duration-300">
                  <Bell className="h-5 w-5 text-cyan-400" />
                  {notificationCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge 
                        variant="destructive" 
                        className="h-5 min-w-[1.25rem] flex items-center justify-center p-0 text-xs bg-gradient-to-r from-red-500 to-orange-500 border-0 pulse-glow"
                      >
                        {notificationCount > 99 ? '99+' : notificationCount}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[320px] p-0 premium-glass border-cyan-500/20">
                <div className="px-4 py-3 border-b border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">System Alerts</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-7 hover:bg-cyan-500/10 text-cyan-400 p-0">
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="h-[400px] overflow-y-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="px-4 py-3 border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors cursor-pointer"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white shadow-lg
                          ${i % 3 === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 
                            i % 3 === 1 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                            'bg-gradient-to-r from-green-500 to-emerald-500'}
                        `}>
                          {i % 3 === 0 ? (
                            <Bell className="h-4 w-4" />
                          ) : i % 3 === 1 ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <CheckCircleIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {i % 3 === 0 ? 'Neural Network Update Available' : 
                             i % 3 === 1 ? 'Tower Alpha-3 Anomaly Detected' : 
                             'Autonomous Harvest Sequence Complete'}
                          </p>
                          <p className="text-xs text-cyan-400 mt-1">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-3 border-t border-cyan-500/20">
                  <Button variant="outline" className="w-full text-xs h-8 cyber-button-secondary">
                    Access Full Alert Matrix
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-cyan-400/20">
                    A
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-white">Admin Protocol</p>
                    <p className="text-xs text-cyan-400">System Administrator</p>
                  </div>
                  <ChevronDown className="h-4 w-4 hidden md:block text-cyan-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 premium-glass border-cyan-500/20">
                <DropdownMenuLabel className="text-white font-semibold">Command Center</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cyan-500/20" />
                <DropdownMenuItem className="hover:bg-cyan-500/10 text-gray-300 hover:text-white transition-colors">
                  <User className="h-4 w-4 mr-2 text-cyan-400" />
                  User Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-cyan-500/10 text-gray-300 hover:text-white transition-colors">
                  <Settings className="h-4 w-4 mr-2 text-cyan-400" />
                  System Config
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cyan-500/20" />
                <DropdownMenuItem className="hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors">
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Secondary Row - Only show on small screens when needed */}
        <AnimatePresence>
          {isMobile && (
            <motion.div 
              className="flex items-center justify-center mt-3 lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Search */}
              <div className="flex relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
                <Input
                  placeholder="Search neural networks..."
                  className="pl-9 w-full h-9 bg-black/20 border-cyan-500/30 focus:border-cyan-400 text-white placeholder:text-gray-400"
                />
              </div>
              
              {/* Mobile Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="ml-2 sm:hidden hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-400" />
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

// Missing icon components
const AlertTriangle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Header;