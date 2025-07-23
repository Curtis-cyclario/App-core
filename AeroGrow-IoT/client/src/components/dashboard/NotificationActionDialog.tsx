import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  X,
  Play,
  Pause,
  Calendar as CalendarSchedule,
  Flag,
  MessageSquare
} from 'lucide-react';
import { Notification } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface NotificationActionDialogProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete: () => void;
}

export default function NotificationActionDialog({
  notification,
  open,
  onOpenChange,
  onActionComplete
}: NotificationActionDialogProps) {
  const [actionType, setActionType] = useState<'immediate' | 'schedule' | 'prioritize' | 'assign' | 'resolve' | 'dismiss'>('immediate');
  const [priority, setPriority] = useState(notification?.priority || 'medium');
  const [assignedTo, setAssignedTo] = useState(notification?.assignedTo || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    notification?.dueDate ? new Date(notification.dueDate) : undefined
  );
  const [notes, setNotes] = useState(notification?.notes || '');
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  const handleAction = async () => {
    if (!notification) return;
    
    setLoading(true);
    try {
      let updateData: any = {};
      
      switch (actionType) {
        case 'immediate':
          updateData = {
            status: 'in_progress',
            assignedTo: 'Current User',
            notes: notes || 'Addressing immediately'
          };
          break;
          
        case 'schedule':
          updateData = {
            status: 'scheduled',
            dueDate: dueDate?.toISOString(),
            assignedTo,
            notes
          };
          break;
          
        case 'prioritize':
          updateData = {
            priority,
            notes
          };
          break;
          
        case 'assign':
          updateData = {
            assignedTo,
            status: 'in_progress',
            notes
          };
          break;
          
        case 'resolve':
          updateData = {
            status: 'resolved',
            resolvedAt: new Date().toISOString(),
            resolvedBy: 'Current User',
            notes
          };
          break;
          
        case 'dismiss':
          updateData = {
            status: 'dismissed',
            notes
          };
          break;
      }

      await apiRequest('PATCH', `/api/notifications/${notification.id}`, updateData);
      
      toast({
        title: 'Notification Updated',
        description: `Successfully ${actionType === 'immediate' ? 'started addressing' : actionType}d notification.`,
      });
      
      onActionComplete();
      onOpenChange(false);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'immediate': return <Play className="h-4 w-4" />;
      case 'schedule': return <CalendarSchedule className="h-4 w-4" />;
      case 'prioritize': return <Flag className="h-4 w-4" />;
      case 'assign': return <User className="h-4 w-4" />;
      case 'resolve': return <CheckCircle className="h-4 w-4" />;
      case 'dismiss': return <X className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto" aria-describedby="notification-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Manage Notification
          </DialogTitle>
          <DialogDescription id="notification-dialog-description">
            Take action on this notification to address the issue or schedule follow-up.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notification Details */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{notification.message}</h4>
              <Badge className={getPriorityColor(notification.priority)}>
                {notification.priority}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Category: {notification.category}</p>
              <p>Created: {format(new Date(notification.timestamp), 'PPpp')}</p>
              {notification.status !== 'open' && (
                <p>Status: {notification.status}</p>
              )}
            </div>
          </div>

          {/* Action Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Choose Action</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'immediate', label: 'Address Now', description: 'Start working on this immediately' },
                { id: 'schedule', label: 'Schedule', description: 'Set a due date for later action' },
                { id: 'prioritize', label: 'Change Priority', description: 'Update priority level' },
                { id: 'assign', label: 'Assign', description: 'Assign to team member' },
                { id: 'resolve', label: 'Mark Resolved', description: 'Mark as completed' },
                { id: 'dismiss', label: 'Dismiss', description: 'Dismiss without action' }
              ].map((action) => (
                <motion.button
                  key={action.id}
                  onClick={() => setActionType(action.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    actionType === action.id
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getActionIcon(action.id)}
                    <span className="font-medium">{action.label}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action-Specific Fields */}
          <div className="space-y-4">
            {actionType === 'schedule' && (
              <div className="space-y-3">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {(actionType === 'prioritize' || actionType === 'schedule') && (
              <div className="space-y-3">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        Low Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        Medium Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        High Priority
                      </div>
                    </SelectItem>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        Critical Priority
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {(actionType === 'assign' || actionType === 'schedule') && (
              <div className="space-y-3">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Current User">Myself</SelectItem>
                    <SelectItem value="Maintenance Team">Maintenance Team</SelectItem>
                    <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                    <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                    <SelectItem value="Farm Manager">Farm Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Notes for all actions */}
            <div className="space-y-3">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or comments..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <EnhancedButton 
            onClick={handleAction} 
            disabled={loading}
            glow={true}
            gradient={true}
            {loading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </>
            ) : (
              <>
                {getActionIcon(actionType)}
                <span className="ml-2">
                  {actionType === 'immediate' ? 'Start Now' : 
                   actionType === 'schedule' ? 'Schedule' :
                   actionType === 'prioritize' ? 'Update Priority' :
                   actionType === 'assign' ? 'Assign' :
                   actionType === 'resolve' ? 'Mark Resolved' :
                   'Dismiss'}
                </span>
              </>
            )}
          </EnhancedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}