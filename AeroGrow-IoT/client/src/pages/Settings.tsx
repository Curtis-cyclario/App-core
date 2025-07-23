import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { 
  Palette, 
  Monitor, 
  Bell, 
  Shield, 
  Database, 
  Wifi,
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';
import { useThemeManager } from '@/contexts/ThemeManagerContext';

const Settings = () => {
  const { currentTheme, setTheme, availableThemes, isDarkMode, toggleDarkMode } = useThemeManager();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    alerts: true
  });
  
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    dataRetention: 30,
    enableLogging: true,
    syncInterval: 5
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-radial from-teal-500/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 organic-card p-8"
        >
          <div className="flex items-center space-x-3">
            <SettingsIcon className="h-8 w-8 text-emerald-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">System Settings</h1>
              <p className="text-emerald-200">Configure themes, notifications, and system preferences</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="organic-card p-2 flex flex-wrap justify-center gap-3 border-[10px] border-transparent">
            <TabsTrigger value="themes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2 m-[10px]">
              <Palette className="h-4 w-4 mr-2" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="display" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2 m-[10px]">
              <Monitor className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2 m-[10px]">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2 m-[10px]">
              <Database className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">Theme Selection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableThemes.map((theme) => (
                      <motion.div
                        key={theme.id}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                          ${currentTheme.id === theme.id 
                            ? 'border-emerald-500 bg-emerald-500/10' 
                            : 'border-gray-600 hover:border-emerald-400 bg-gray-800/50'
                          }
                        `}
                        onClick={() => setTheme(theme.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">{theme.name}</h3>
                          {currentTheme.id === theme.id && (
                            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 mb-4">{theme.description}</p>
                        
                        {/* Theme Preview */}
                        <div className="space-y-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ backgroundColor: theme.primaryColor }}
                          ></div>
                          <div className="flex space-x-1">
                            <div 
                              className="h-1 w-1/3 rounded"
                              style={{ backgroundColor: theme.secondaryColor }}
                            ></div>
                            <div 
                              className="h-1 w-1/3 rounded"
                              style={{ backgroundColor: theme.accentColor }}
                            ></div>
                            <div 
                              className="h-1 w-1/3 rounded opacity-50"
                              style={{ backgroundColor: theme.primaryColor }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Dark Mode</h4>
                      <p className="text-sm text-gray-300">Toggle between light and dark themes</p>
                    </div>
                    <Switch 
                      checked={isDarkMode} 
                      onCheckedChange={toggleDarkMode}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="display" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">Display Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Animations</h4>
                      <p className="text-sm text-gray-300">Enable smooth transitions and effects</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Particle Effects</h4>
                      <p className="text-sm text-gray-300">Show background particle animations</p>
                    </div>
                    <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">High Contrast</h4>
                      <p className="text-sm text-gray-300">Improve visibility with enhanced contrast</p>
                    </div>
                    <Switch className="data-[state=checked]:bg-emerald-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-300">Receive system alerts via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Push Notifications</h4>
                      <p className="text-sm text-gray-300">Browser push notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Critical Alerts</h4>
                      <p className="text-sm text-gray-300">Immediate notifications for system issues</p>
                    </div>
                    <Switch 
                      checked={notifications.alerts}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, alerts: checked }))}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="system" className="mt-[10px]">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">System Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">Auto Backup</h4>
                      <p className="text-sm text-gray-300">Automatically backup system data</p>
                    </div>
                    <Switch 
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">System Logging</h4>
                      <p className="text-sm text-gray-300">Enable detailed system logs</p>
                    </div>
                    <Switch 
                      checked={systemSettings.enableLogging}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableLogging: checked }))}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                  </div>
                  
                  <div className="flex justify-between gap-4 pt-6">
                    <Button className="organic-button-secondary flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Settings
                    </Button>
                    <Button className="organic-button-secondary flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Settings
                    </Button>
                    <Button className="organic-button-primary flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;