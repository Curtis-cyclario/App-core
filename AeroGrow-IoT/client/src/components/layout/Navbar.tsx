import React from 'react';
import { Bell, Moon, Sun, User, Home } from 'lucide-react';
import { Link } from 'wouter';
import VertiGrowLogo from '../icons/VertiGrowLogo';
import { useTheme } from '@/hooks/useTheme';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { Button } from '@/components/ui/button';
import TutorialButton from '@/components/tutorial/TutorialButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NotificationsPanel from '../dashboard/NotificationsPanel';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { theme, setTheme } = useTheme();
  const { unreadCount, notifications, markAllAsRead } = useNotifications();
  const { settings, togglePopups, toggleSound, toggleCriticalOnly } = useNotificationSettings();

  return (
    <header className="glassmorphism sticky top-0 z-50 shadow-sm border-b border-gray-200/50 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Mobile menu button - aligned with other navbar elements */}
            <Button 
              variant="ghost"
              size="icon"
              className="lg:hidden px-0 py-0 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            
            {/* Logo - clickable to return to dashboard */}
            <Link href="/dashboard" className="flex-shrink-0 flex items-center cursor-pointer">
              <div className="block lg:hidden">
                <VertiGrowLogo size={32} />
              </div>
              <div className="hidden lg:flex items-center">
                <div className="mr-3 animate-float">
                  <VertiGrowLogo size={32} className="animate-pulse-warm" />
                </div>
                <div className="space-y-1">
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 via-blue-400 via-purple-400 via-pink-400 to-emerald-400 bg-clip-text text-transparent animate-gradient-cycle">
                    Vertigro
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Vertical Farming Intelligence</div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Right nav items */}
          <div className="flex items-center">
            {/* Home button - return to dashboard */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700"
                    >
                      <span className="sr-only">Return to Dashboard</span>
                      <Home className="h-5 w-5" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Return to Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Theme switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-3 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700"
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme('light')} className="hover:bg-accent">
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="hover:bg-accent">
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Help & Tutorial Button */}
            <TutorialButton className="ml-3" />

            {/* Notifications */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-3 relative rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className={`absolute -top-1 -right-1 ${unreadCount > 99 ? 'w-auto px-1' : 'w-5'} h-5 flex items-center justify-center p-0 text-xs`}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <NotificationsPanel 
                    notifications={notifications} 
                    onMarkAllAsRead={markAllAsRead} 
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* User menu */}
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center max-w-xs rounded-full text-sm focus:outline-none transition-colors duration-200"
                  >
                    <span className="sr-only">Open user menu</span>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
