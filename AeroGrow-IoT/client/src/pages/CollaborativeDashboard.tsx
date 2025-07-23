import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  MessageSquare, 
  Video,
  Share2,
  Bell,
  Activity,
  Calendar,
  Clock,
  Eye,
  Edit,
  Send,
  UserPlus,
  Settings,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  role: string;
  status: 'online' | 'away' | 'offline';
  avatar: string;
  currentTask?: string;
}

interface Activity {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'update' | 'alert' | 'message' | 'task';
}

interface ChatMessage {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  type: 'message' | 'system';
}

const CollaborativeDashboard = () => {
  const [activeUsers, setActiveUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Lead Botanist',
      status: 'online',
      avatar: 'SC',
      currentTask: 'Monitoring Tower 3'
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      role: 'Systems Engineer',
      status: 'online',
      avatar: 'MR',
      currentTask: 'Calibrating sensors'
    },
    {
      id: 3,
      name: 'Dr. Emily Watson',
      role: 'Research Director',
      status: 'away',
      avatar: 'EW'
    },
    {
      id: 4,
      name: 'Alex Kim',
      role: 'Data Analyst',
      status: 'online',
      avatar: 'AK',
      currentTask: 'Analyzing yield data'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    {
      id: 1,
      user: 'Sarah Chen',
      action: 'adjusted',
      target: 'Tower 3 nutrient levels',
      timestamp: '2 minutes ago',
      type: 'update'
    },
    {
      id: 2,
      user: 'Mike Rodriguez',
      action: 'resolved',
      target: 'sensor calibration issue',
      timestamp: '5 minutes ago',
      type: 'alert'
    },
    {
      id: 3,
      user: 'Alex Kim',
      action: 'shared',
      target: 'weekly analytics report',
      timestamp: '12 minutes ago',
      type: 'message'
    },
    {
      id: 4,
      user: 'Dr. Emily Watson',
      action: 'created',
      target: 'new research protocol',
      timestamp: '18 minutes ago',
      type: 'task'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: 'Sarah Chen',
      message: 'Tower 3 is showing excellent growth rates this week!',
      timestamp: '10:23 AM',
      type: 'message'
    },
    {
      id: 2,
      user: 'Mike Rodriguez',
      message: 'All sensors are now calibrated and running optimally',
      timestamp: '10:25 AM',
      type: 'message'
    },
    {
      id: 3,
      user: 'System',
      message: 'Automated backup completed successfully',
      timestamp: '10:30 AM',
      type: 'system'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: chatMessages.length + 1,
        user: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'message'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update': return <Edit className="h-4 w-4 text-blue-400" />;
      case 'alert': return <Bell className="h-4 w-4 text-yellow-400" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-green-400" />;
      case 'task': return <Target className="h-4 w-4 text-purple-400" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-radial from-teal-500/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 organic-card p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Collaborative Operations Center</h1>
                <p className="text-emerald-200">Real-time team coordination and communication hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button className="organic-button-secondary">
                <Video className="h-4 w-4 mr-2" />
                Start Meeting
              </Button>
              <Button className="organic-button-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Team
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Real-time Activity Feed */}
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-emerald-400" />
                    <span>Live Activity Feed</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentActivities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-3 p-3 bg-gray-800/50 border border-gray-600 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white">
                          <span className="font-medium text-emerald-300">{activity.user}</span>
                          {' '}{activity.action}{' '}
                          <span className="text-blue-300">{activity.target}</span>
                        </div>
                        <div className="text-xs text-gray-400">{activity.timestamp}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shared Workspace */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="organic-card p-2 flex flex-wrap justify-center gap-2">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
                  <Eye className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
                  <Target className="h-4 w-4 mr-2" />
                  Shared Tasks
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Team Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="organic-card">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">94%</div>
                        <div className="text-sm text-gray-300">System Efficiency</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="organic-card">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Target className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">12/15</div>
                        <div className="text-sm text-gray-300">Tasks Complete</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="organic-card">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Users className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">8</div>
                        <div className="text-sm text-gray-300">Active Members</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <Card className="organic-card">
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Shared Task Management</h3>
                      <p className="text-gray-400">Collaborative task tracking and assignment system</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card className="organic-card">
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">Team Performance Analytics</h3>
                      <p className="text-gray-400">Productivity insights and collaboration metrics</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Team Members */}
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="h-5 w-5 text-emerald-400" />
                  <span>Team Online ({activeUsers.filter(u => u.status === 'online').length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-emerald-500 text-white text-xs">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(user.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.role}</div>
                        {user.currentTask && (
                          <div className="text-xs text-emerald-300 truncate">{user.currentTask}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Chat */}
            <Card className="organic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                  <span>Team Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`p-2 rounded-lg ${
                        message.type === 'system' 
                          ? 'bg-blue-500/10 border border-blue-500/20' 
                          : 'bg-gray-800/50'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${
                            message.type === 'system' ? 'text-blue-400' : 'text-emerald-300'
                          }`}>
                            {message.user}
                          </span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <div className="text-sm text-white">{message.message}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 bg-gray-800/50 border-gray-600 text-white text-sm"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="organic-button-primary p-2"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeDashboard;