import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import CRTHeader from "@/components/layout/CRTHeader";
import { ConnectionStatus } from "@/components/ui/ConnectionStatus";
import Landing from "@/pages/Landing";
import Demo from "@/pages/Demo";
import Dashboard from "@/pages/Dashboard";
import Monitoring from "@/pages/Monitoring";
import Network from "@/pages/Network";
import DeviceManagement from "@/pages/DeviceManagement";
import Plants from "@/pages/Plants";
import ReportsPage from "@/pages/Reports";
import AIVision from "@/pages/AIVision";
import Settings from "@/pages/Settings";
import CropTokenization from "@/pages/CropTokenization";
import FacilityManagement from "@/pages/FacilityManagement";
import PlantMarketplace from "@/pages/PlantMarketplace";
import AIPlantHealthDiagnostics from "@/pages/AIPlantHealthDiagnostics";
import CollaborativeDashboard from "@/pages/CollaborativeDashboard";
import BlockchainSupplyChain from "@/pages/BlockchainSupplyChain";
import AdvancedAnalytics from "@/pages/AdvancedAnalytics";
import EnterpriseIntegrations from "@/pages/EnterpriseIntegrations";
import PredictiveMaintenance from "@/pages/PredictiveMaintenance";
import DigitalTwin from "@/pages/DigitalTwin";
import ResourceEfficiency from "@/pages/ResourceEfficiency";
import PlantRecognition from "@/pages/PlantRecognition";
import EnergyHarvesting from "@/pages/EnergyHarvesting";
import InvestorDashboard from "@/pages/InvestorDashboard";
import Resources from "@/pages/Resources";
import About from "@/pages/About";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeManagerProvider } from "./contexts/ThemeManagerContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import TutorialProvider from "@/components/tutorial/TutorialProvider";
import VoiceCareAssistant from "@/components/assistant/VoiceCareAssistant";
import FloatingNav from "@/components/navigation/FloatingNav";
import PerformanceMonitor from "@/components/ui/performance-monitor";
import ToastNotifications from "@/components/notifications/ToastNotifications";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const { settings } = useNotificationSettings();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [location] = useLocation();
  
  // Check if we're on the landing page or demo page
  useEffect(() => {
    setIsLandingPage(location === '/' || location === '/demo');
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme="light" initialThemePreset="organic">
        <ThemeManagerProvider>
          <WebSocketProvider>
          <TutorialProvider>
            <TooltipProvider>
              <div className="min-h-screen flex flex-col">
                {!isLandingPage && <Navbar toggleSidebar={toggleSidebar} />}
                <div className="flex-1 flex overflow-hidden">
                  {!isLandingPage && <Sidebar collapsed={!sidebarOpen} setCollapsed={(collapsed) => setSidebarOpen(!collapsed)} />}
                  <main className={`flex-1 relative z-0 overflow-y-auto overflow-x-hidden focus:outline-none transition-colors duration-300 ${
                    isLandingPage ? 'bg-slate-900' : 'bg-gray-50 dark:bg-dark-800'
                  }`}>
                    <div className={isLandingPage ? '' : 'py-6'}>
                      <Switch>
                        <Route path="/" component={Landing} />
                        <Route path="/demo" component={Demo} />
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/monitoring" component={Monitoring} />
                        <Route path="/network" component={Network} />
                        <Route path="/device-management" component={DeviceManagement} />
                        <Route path="/facility-management" component={FacilityManagement} />
                        <Route path="/plants" component={Plants} />
                        <Route path="/plant-marketplace" component={PlantMarketplace} />
                        <Route path="/ai-diagnostics" component={AIPlantHealthDiagnostics} />
                        <Route path="/collaborative" component={CollaborativeDashboard} />
                        <Route path="/blockchain" component={BlockchainSupplyChain} />
                        <Route path="/analytics" component={AdvancedAnalytics} />
                        <Route path="/integrations" component={EnterpriseIntegrations} />
                        <Route path="/predictive-maintenance" component={PredictiveMaintenance} />
                        <Route path="/crop-tokenization" component={CropTokenization} />
                        <Route path="/reports" component={ReportsPage} />
                        <Route path="/ai-vision" component={AIVision} />
                        <Route path="/digital-twin" component={DigitalTwin} />
                        <Route path="/resource-efficiency" component={ResourceEfficiency} />
                        <Route path="/plant-recognition" component={PlantRecognition} />
                        <Route path="/energy-harvesting" component={EnergyHarvesting} />
                        <Route path="/investor-dashboard" component={InvestorDashboard} />
                        <Route path="/resources" component={Resources} />
                        <Route path="/about" component={About} />
                        <Route path="/settings" component={Settings} />
                        <Route component={NotFound} />
                      </Switch>
                    </div>
                    <PerformanceMonitor />
                  </main>
                </div>
                <Footer />
              </div>

              <VoiceCareAssistant />
              <FloatingNav />
              <ToastNotifications enabled={settings.popupsEnabled} />
              <ConnectionStatus />
              <Toaster />
            </TooltipProvider>
          </TutorialProvider>
          </WebSocketProvider>
        </ThemeManagerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
