import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import VisualScanPage from "@/pages/VisualScanPage";
import MineralDatabase from "@/pages/MineralDatabase";
import MlAnalysisPage from "@/pages/MlAnalysisPage";
import AppHeader from "@/components/AppHeader";
import MobileNavigation from "@/components/MobileNavigation";
import { useEffect, useState } from "react";

function Router() {
  const [location] = useLocation();
  const isMobile = window.innerWidth < 1024;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <AppHeader />
      <div className="flex-1 flex overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/scan" component={VisualScanPage} />
          <Route path="/minerals" component={MineralDatabase} />
          <Route path="/analysis/:analysisId" component={MlAnalysisPage} />
          <Route path="/analysis" component={MlAnalysisPage} />
          <Route path="/scans/:scanId/analysis" component={MlAnalysisPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      {isMobile && <MobileNavigation currentPath={location} />}
    </div>
  );
}

function App() {
  // Set the document title
  useEffect(() => {
    document.title = "GeoScan Pro - Geological Scanning & Analysis";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
