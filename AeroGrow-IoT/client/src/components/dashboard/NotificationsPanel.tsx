import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Notification } from '@shared/schema';
import { format, formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Info, AlertCircle, Bell, Filter, Settings, Check, Clock, User, Flag, MousePointer } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import NotificationActionDialog from './NotificationActionDialog';

interface NotificationsPanelProps {
  notifications: Notification[];
  markAllAsRead: () => void;
  limit?: number;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  notifications, 
  markAllAsRead, 
  limit = 5 
}) => {
  const { markAsRead } = useNotifications();
  const [filterLevels, setFilterLevels] = useState<string[]>(['danger', 'warning', 'info']);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [alertPreferences, setAlertPreferences] = useState({
    showDesktopAlerts: true,
    soundEnabled: false,
    showCriticalOnly: false,
  });

  // Filter notifications by selected criticality levels and limit
  const displayedNotifications = notifications
    .filter(notification => filterLevels.includes(notification.level))
    .slice(0, limit);
    
  // Toggle notification level filter
  const toggleLevel = (level: string) => {
    if (filterLevels.includes(level)) {
      setFilterLevels(filterLevels.filter(l => l !== level));
    } else {
      setFilterLevels([...filterLevels, level]);
    }
  };

  // Get appropriate icon based on notification level
  const getNotificationIcon = (level: string) => {
    switch (level) {
      case 'danger':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleDismiss = (id: number) => {
    markAsRead(id);
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setActionDialogOpen(true);
  };

  const handleActionComplete = () => {
    // Refresh notifications or handle the update
    window.location.reload(); // Simple approach - in production, you'd update the state properly
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 border-red-200 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-200 text-blue-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'in_progress': return <Clock className="h-3 w-3" />;
      case 'scheduled': return <Clock className="h-3 w-3" />;
      case 'resolved': return <Check className="h-3 w-3" />;
      case 'dismissed': return <AlertCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-gray-200 dark:border-dark-600">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Notifications
          </CardTitle>
          <div className="flex space-x-2">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Show by criticality</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filterLevels.includes('danger')}
                  onCheckedChange={() => toggleLevel('danger')}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Critical Alerts
                  </div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterLevels.includes('warning')}
                  onCheckedChange={() => toggleLevel('warning')}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                    Warnings
                  </div>
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterLevels.includes('info')}
                  onCheckedChange={() => toggleLevel('info')}
                  className="flex items-center"
                >
                  <div className="flex items-center flex-1">
                    <Info className="h-4 w-4 mr-2 text-blue-500" />
                    Information
                  </div>
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <Settings className="h-4 w-4 mr-1" />
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={alertPreferences.showDesktopAlerts}
                  onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, showDesktopAlerts: !!checked})}
                >
                  Desktop Alerts
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={alertPreferences.soundEnabled}
                  onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, soundEnabled: !!checked})}
                >
                  Sound Notifications
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={alertPreferences.showCriticalOnly}
                  onCheckedChange={(checked) => setAlertPreferences({...alertPreferences, showCriticalOnly: !!checked})}
                >
                  Only Show Critical
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="h-8"
            >
              Mark all read
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm text-gray-500">
          {filterLevels.length === 3 ? (
            'Showing all notifications'
          ) : (
            `Filtering: ${filterLevels.includes('danger') ? 'Critical ' : ''}${filterLevels.includes('warning') ? 'Warning ' : ''}${filterLevels.includes('info') ? 'Info' : ''}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 py-5">
        {notifications.length === 0 ? (
          <div className="flex justify-center items-center py-6">
            <p className="text-gray-500 dark:text-gray-400">No notifications</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-dark-600">
            {displayedNotifications.map((notification) => (
              <li key={notification.id} className="py-4">
                <div 
                  className="flex items-start cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors group"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.level)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {notification.level === 'danger' ? 'Alert' : 
                         notification.level === 'warning' ? 'Warning' : 'Information'}
                      </p>
                      <div className="flex items-center gap-2">
                        {notification.priority && (
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </Badge>
                        )}
                        {notification.status && notification.status !== 'open' && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            {getStatusIcon(notification.status)}
                            <span>{notification.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MousePointer className="h-3 w-3" />
                        Click to manage
                      </div>
                    </div>
                    {notification.assignedTo && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        Assigned to: {notification.assignedTo}
                      </div>
                    )}
                    <div className="mt-2 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(notification.id);
                        }}
                        className="text-xs px-2 py-1"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[10px] border-transparent"
                        onClick={() => handleDismiss(notification.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
