import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Activity } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Clock, 
  Zap, 
  AlertCircle, 
  CheckCircle2,
  Waves,
  Lightbulb
} from 'lucide-react';

interface ActivityLogProps {
  activities: Activity[];
  loading?: boolean;
}

const ActivityLog: React.FC<ActivityLogProps> = ({ activities, loading = false }) => {
  // Get icon based on activity type or specified icon
  const getActivityIcon = (activity: Activity) => {
    if (activity.icon) {
      switch (activity.icon) {
        case 'pump': return <Waves className="h-6 w-6" />;
        case 'light': return <Lightbulb className="h-6 w-6" />;
        default: break;
      }
    }
    
    switch (activity.type) {
      case 'system': return <Zap className="h-6 w-6" />;
      case 'warning': return <AlertCircle className="h-6 w-6" />;
      case 'success': return <CheckCircle2 className="h-6 w-6" />;
      case 'command': return <Zap className="h-6 w-6" />;
      default: return <Clock className="h-6 w-6" />;
    }
  };

  // Get background color based on activity type
  const getActivityBg = (activity: Activity) => {
    switch (activity.type) {
      case 'system': return 'bg-gray-300 dark:bg-dark-600 text-gray-600 dark:text-gray-400';
      case 'warning': return 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-200';
      case 'success': return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200';
      case 'command': return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200';
      default: return 'bg-gray-300 dark:bg-dark-600 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader className="px-5 py-4 border-b border-gray-200 dark:border-dark-600">
        <CardTitle className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-5">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <p className="text-gray-500 dark:text-gray-400">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex justify-center items-center py-6">
            <p className="text-gray-500 dark:text-gray-400">No activities recorded yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-dark-600">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full ${getActivityBg(activity)} flex items-center justify-center`}>
                      {getActivityIcon(activity)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
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

export default ActivityLog;
